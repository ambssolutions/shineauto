// Rego lookup: plate + state in, make / model / year out.
// Runs on Vercel as a serverless function so the data provider's key never reaches the browser.
//
// Switch it on with Vercel environment variables (Project > Settings > Environment Variables):
//   REGO_PROVIDER     "regcheck" (Infinite Loop Reg Check, recommended: AUD 0.30 a lookup, 10 free) or "carsxe" (CarsXE Plate Decoder)
//   NSW plates come back without a rego expiry date, so the page links NSW drivers to Service NSW's free check instead.
//   REGCHECK_USERNAME the Reg Check account username        (when REGO_PROVIDER=regcheck)
//   CARSXE_KEY        the CarsXE API key                     (when REGO_PROVIDER=carsxe)
//   REGO_ALLOWED_ORIGINS  optional, comma-separated, e.g. "https://shineauto.com.au,https://shineauto.vercel.app"
// With no provider set it answers 503 and the page keeps the plate box hidden.
//
// Privacy: plates are sent to the provider to look the car up. Nothing is stored or logged here,
// and only the car's description goes back to the browser (no VIN, no owner details).

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
const WINDOW_MS = 10 * 60 * 1000, MAX_PER_WINDOW = 6;
const hits = new Map(); // best-effort per-instance limit; the provider's own quota is the hard stop

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function limited(ip) {
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

const pick = (...vals) => vals.find(v => v !== undefined && v !== null && String(v).trim() !== "");
const text = v => (v && typeof v === "object" ? pick(v.CurrentTextValue, v.value, v.name) : v);
const year = v => { const m = String(v ?? "").match(/(19|20)\d{2}/); return m ? +m[0] : undefined; };
// Dates come as DD/MM/YYYY (Australian, e.g. Reg Check) or ISO; never read 03/12 as March.
const date = v => {
  const t = String(v ?? "").trim(); if (!t) return undefined;
  const au = t.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/);
  const d = au ? new Date(Date.UTC(+au[3], +au[2] - 1, +au[1])) : new Date(t);
  return isNaN(d) ? undefined : d.toISOString().slice(0, 10);
};

// Each provider returns a slightly different shape; turn it into one small, safe object.
function normalise(raw) {
  if (!raw || typeof raw !== "object") return null;
  const v = raw.vehicle || raw.result || raw.data || raw;
  const out = {
    make: text(pick(v.CarMake, v.make, v.Make)),
    model: text(pick(v.CarModel, v.model, v.Model)),
    year: year(pick(v.RegistrationYear, v.year, v.Year, v.registration_year, v.ManufactureYearFrom, v.build_date)),
    description: text(pick(v.Description, v.description, v.vehicle_description)),
    body: text(pick(v.BodyStyle, v.body, v.body_type, v.BodyType)),
    colour: text(pick(v.Colour, v.colour, v.color, v.Color)),
    regoExpiry: date(pick(v.Expiry, v.expiry, v.registration_expiry, v.RegistrationExpiry, v.expiry_date))
  };
  Object.keys(out).forEach(k => out[k] === undefined && delete out[k]);
  return out.make || out.description ? out : null;
}

async function viaRegcheck(plate, state) {
  const u = new URL("https://www.regcheck.org.uk/api/reg.asmx/CheckAustralia");
  u.searchParams.set("RegistrationNumber", plate);
  u.searchParams.set("State", state);
  u.searchParams.set("username", process.env.REGCHECK_USERNAME);
  const r = await fetch(u, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error("provider " + r.status);
  const xml = await r.text();
  const m = xml.match(/<vehicleJson>([\s\S]*?)<\/vehicleJson>/i);
  if (!m) return null;
  const decoded = m[1].replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  return normalise(JSON.parse(decoded));
}

async function viaCarsxe(plate, state) {
  const u = new URL("https://api.carsxe.com/v2/platedecoder");
  u.searchParams.set("key", process.env.CARSXE_KEY);
  u.searchParams.set("plate", plate);
  u.searchParams.set("state", state);
  u.searchParams.set("country", "AU");
  const r = await fetch(u, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error("provider " + r.status);
  const body = await r.json();
  if (body && (body.success === false || body.error)) return null;
  return normalise(body);
}

const PROVIDERS = {
  regcheck: { ready: () => !!process.env.REGCHECK_USERNAME, run: viaRegcheck },
  carsxe: { ready: () => !!process.env.CARSXE_KEY, run: viaCarsxe }
};

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { ok: false, reason: "method" });

  const provider = PROVIDERS[(process.env.REGO_PROVIDER || "").toLowerCase()];
  if (!provider || !provider.ready()) return json(res, 503, { ok: false, reason: "off" });

  const allowed = (process.env.REGO_ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  const origin = req.headers.origin || req.headers.referer || "";
  if (allowed.length && !allowed.some(a => origin.startsWith(a))) return json(res, 403, { ok: false, reason: "origin" });

  const q = new URL(req.url, "http://x").searchParams;
  const plate = (q.get("plate") || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const state = (q.get("state") || "NSW").toUpperCase();
  if (!/^[A-Z0-9]{2,9}$/.test(plate) || !STATES.includes(state)) return json(res, 400, { ok: false, reason: "input" });

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
  if (limited(ip)) return json(res, 429, { ok: false, reason: "busy" });

  try {
    const vehicle = await provider.run(plate, state);
    if (!vehicle) return json(res, 404, { ok: false, reason: "notfound" });
    return json(res, 200, { ok: true, vehicle });
  } catch {
    return json(res, 502, { ok: false, reason: "provider" });
  }
}

export { normalise };
