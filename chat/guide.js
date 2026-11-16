/* Shine chat: a guided "Help me choose" flow, added on top of the shared chat engine (chat.js stays untouched).
   It asks what the visitor needs, one follow-up question, then suggests: book it, not needed yet, or check with our expert.
   Facts only from the website. Booking is by phone. */
(function () {
  var TEL = "tel:+61287985715", BALLI = "tel:+61433597181";
  var BOOK = { t: "Call to book (02) 8798 5715", h: TEL };
  var EXPERT = { t: "Talk to Balli 0433 597 181", h: BALLI };
  var FLOW = {
    start: { q: "What's going on with your car?", o: [
      ["Warning light on", "light"], ["Strange noise", "noise"], ["Brakes feel wrong", "brakes"], ["Won't start", "battery"],
      ["Running hot", "hot"], ["Air con not cold", "acYes"], ["Service is due", "logbook"], ["Rego due: pink or blue slip", "slip"],
      ["Defect notice", "defect"], ["Something else", "other"]] },
    slip: { q: "Which one do you need?", o: [["Pink slip", "pink"], ["Blue slip", "blue"], ["Not sure", "pinkUnsure"]] },
    noise: { q: "When do you hear it?", o: [["When I brake", "brakeYes"], ["Over bumps", "bumps"], ["From the engine", "engNoise"], ["Not sure", "engNoise"]] },
    bumps: { a: "Knocks or clunks over bumps can mean worn steering or suspension parts. Steering and suspension are part of our mechanical repairs, so book it in and we'll take a look.", r: "book", l: [BOOK] },
    engNoise: { a: "Noises are best heard in person. Call and tell us what it sounds like and when it happens, and we'll find a time to take a look.", r: "expert", l: [EXPERT] },
    hot: { q: "Is the temperature light on, or the gauge high?", o: [["Yes", "hotYes"], ["No, it just smells or steams", "hotYes"], ["Not sure", "hotYes"]] },
    hotYes: { a: "Engine temperature is a red light: stop as soon as it's safe and switch off. Let the engine cool, and never open the radiator cap while it's hot. Call before driving on.", r: "expert", l: [{ t: "Call the workshop now", h: TEL }, { t: "What's that light?", h: "/#lights" }] },
    pink: { q: "Is the car registered in NSW and more than five years old?", o: [["Yes", "pinkYes"], ["No", "pinkNo"], ["Not sure", "pinkUnsure"]] },
    pinkYes: { a: "Then it needs a pink slip to renew its rego. We do pink slips for petrol, diesel and LPG cars. The most a station can charge for a light vehicle is $52.", r: "book", l: [BOOK, { t: "What gets checked", h: "/#inspect" }] },
    pinkNo: { a: "Cars five years old or newer usually don't need a pink slip to renew rego. Your renewal notice will say if an inspection is needed.", r: "none", l: [{ t: "Check your rego with Service NSW", h: "https://service.nsw.gov.au/transaction/check-vehicle-registration" }] },
    pinkUnsure: { a: "Your rego renewal notice says whether you need an inspection. If you'd rather check with us, give Balli a call.", r: "expert", l: [EXPERT, { t: "Check your rego with Service NSW", h: "https://service.nsw.gov.au/transaction/check-vehicle-registration" }] },
    blue: { q: "Which of these fits your car?", o: [["Rego expired over 3 months ago", "blueYes"], ["From interstate or overseas", "blueYes"], ["Written-off, approved for rego", "blueYes"], ["None of these", "blueNo"]] },
    blueYes: { a: "That needs a blue slip: a safety and identity check to register it in NSW. The most a station can charge for a light vehicle is $82.", r: "book", l: [BOOK, { t: "Pink slip or blue slip?", h: "/#slips" }] },
    blueNo: { a: "You may only need a pink slip, or no inspection at all. Our team can tell you which.", r: "expert", l: [EXPERT] },
    logbook: { q: "Is the service due? Check the date or kilometres in your logbook or on the windscreen sticker.", o: [["Yes, it's due", "logYes"], ["Not yet", "logNo"], ["Not sure", "logUnsure"]] },
    logYes: { a: "We service to the schedule in your car's logbook. Bring the logbook so the service can be recorded.", r: "book", l: [BOOK] },
    logNo: { a: "No need to book yet. Keep an eye on the date and kilometres, and book in when it's due.", r: "none", l: [{ t: "Logbook servicing guide", h: "/guides/logbook-servicing" }] },
    logUnsure: { a: "Tell us the car and roughly when it was last serviced, and we'll let you know.", r: "expert", l: [EXPERT] },
    light: { q: "What is the light doing?", o: [["It's red", "lightRed"], ["It's flashing", "lightRed"], ["Amber and steady", "lightAmber"], ["Not sure", "lightUnsure"]] },
    lightRed: { a: "A red or flashing warning light can mean act now. Stop somewhere safe as soon as you can and call us before driving on.", r: "expert", l: [{ t: "Call the workshop now", h: TEL }, { t: "What's that light?", h: "/#lights" }] },
    lightAmber: { a: "An amber light usually means get it checked soon. You can usually drive on gently and book it in.", r: "book", l: [BOOK, { t: "What's that light?", h: "/#lights" }] },
    lightUnsure: { a: "Have a look at our warning lights guide, or call and describe the light. We'll tell you what to do next.", r: "expert", l: [{ t: "What's that light?", h: "/#lights" }, EXPERT] },
    brakes: { q: "What are the brakes doing?", o: [["Grinding or squealing", "brakeYes"], ["Pulling to one side", "brakeYes"], ["Pedal feels soft", "brakeSoft"], ["Just want a check", "brakeCheck"]] },
    brakeYes: { a: "That's worth getting checked soon. We do all mechanical repairs, including brakes, steering and suspension, and tyres.", r: "book", l: [BOOK] },
    brakeSoft: { a: "A soft or sinking brake pedal needs checking before you drive far. Call us and we'll tell you what to do next.", r: "expert", l: [{ t: "Call the workshop", h: TEL }] },
    brakeCheck: { a: "Happy to take a look at the brakes and tyres. For tyres, have your tyre size handy when you call. It's printed on the side of the tyre.", r: "book", l: [BOOK] },
    aircon: { q: "Is the air con blowing warm or not cooling like it used to?", o: [["Yes", "acYes"], ["No, something else", "acNo"]] },
    acYes: { a: "We do air con regas and repairs. A slow gas leak or a faulty part such as the compressor are common causes.", r: "book", l: [BOOK] },
    acNo: { a: "Describe what it's doing and our team will tell you if it needs a look.", r: "expert", l: [EXPERT] },
    battery: { q: "What happens when you turn the key?", o: [["Nothing at all", "batNo"], ["Slow to crank", "batSlow"], ["Battery light is on", "batLight"]] },
    batNo: { a: "Call us and tell us what happens when you turn the key. We'll let you know the next step.", r: "expert", l: [{ t: "Call the workshop", h: TEL }] },
    batSlow: { a: "We check the battery and the charging system, and replace the battery if it needs it.", r: "book", l: [BOOK] },
    batLight: { a: "The battery may not be charging. Switch off what you don't need, like the air con and radio, get somewhere safe and call us.", r: "expert", l: [{ t: "Call the workshop", h: TEL }, { t: "Battery light explained", h: "/#lights" }] },
    defect: { q: "We do defect clearances. Do you have the defect notice with you?", o: [["Yes", "defYes"], ["No", "defNo"]] },
    defYes: { a: "Call us and tell us what's on the notice. We'll fix the items and clear it.", r: "book", l: [BOOK] },
    defNo: { a: "Give us a call and tell us what the notice was for, and we'll let you know what's needed.", r: "expert", l: [EXPERT] },
    other: { a: "Tell me what the car is doing in your own words below, or talk to our team.", r: "expert", l: [EXPERT], focus: true }
  };
  var TAG = { book: "Book it in", none: "Not needed right now", expert: "Check with our expert" };

  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }
  function scroll(log) { log.scrollTop = log.scrollHeight; }
  function track(step) { try { if (window.gtag) gtag("event", "chat_guide", { step: step }); } catch (e) {} }

  function typing(log, cb) {
    var t = el("div", "ac-m ac-bot sg-typing"); t.innerHTML = "<i></i><i></i><i></i>"; log.appendChild(t); scroll(log);
    setTimeout(function () { t.remove(); cb(); }, 650);
  }
  function chips(log, opts, onPick) {
    var box = el("div", "ac-chips sg-chips");
    opts.forEach(function (o) {
      var b = el("button", "ac-chip", o[0]); b.type = "button";
      b.addEventListener("click", function () {
        [].forEach.call(box.querySelectorAll("button"), function (x) { x.disabled = true; x.classList.toggle("sg-picked", x === b); });
        log.appendChild(el("div", "ac-m ac-me", o[0])); scroll(log); onPick(o[1]);
      });
      box.appendChild(b);
    });
    log.appendChild(box); scroll(log);
  }
  var ASK = ["How much is a pink slip?", "Are you open on Saturday?", "Where are you?", "Is your work guaranteed?"];
  function ask(q) {
    var f = document.querySelector(".ac-panel.on .ac-in") || document.querySelector(".ac-in"); if (!f) return;
    var i = f.querySelector("input"); i.value = q;
    if (f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }
  function askOther(log) {
    var i = document.querySelector(".ac-in input"); if (i) i.focus({ preventScroll: true });
    typing(log, function () {
      log.appendChild(el("div", "ac-m ac-bot", "Sure. Type your question below, or pick one of these:"));
      chips(log, ASK.map(function (q) { return [q, q]; }).concat([["Back to the start", "start"]]), function (v) {
        if (v === "start") { step(log, "start"); return; }
        var last = log.lastChild; if (last && last.classList.contains("ac-me")) last.remove(); // the engine shows the question itself
        ask(v);
      });
    });
  }
  function step(log, id) {
    var n = FLOW[id]; if (!n) return; track(id);
    typing(log, function () {
      if (n.q) { log.appendChild(el("div", "ac-m ac-bot", n.q)); chips(log, n.o, function (next) { step(log, next); }); return; }
      var b = el("div", "ac-m ac-bot");
      if (n.r) b.appendChild(el("span", "sg-tag sg-" + n.r, TAG[n.r]));
      b.appendChild(el("div", null, n.a));
      if (n.l && n.l.length) {
        var links = el("div", "ac-links");
        n.l.forEach(function (x) { var a = el("a", null, x.t); a.href = x.h; if (/^https?:/.test(x.h)) { a.target = "_blank"; a.rel = "noopener"; } links.appendChild(a); });
        b.appendChild(links);
      }
      log.appendChild(b);
      chips(log, [["Start again", "start"], ["Ask something else", "type"]], function (next) {
        if (next === "type") { askOther(log); return; }
        step(log, next);
      });
      if (n.focus) { var i = document.querySelector(".ac-in input"); if (i) i.focus(); }
    });
  }
  function maybeStart() {
    var log = document.querySelector(".ac-panel.on .ac-log"); if (!log || log.dataset.sg) return;
    if (!log.children.length) return;
    if (log.querySelector(".ac-me")) { log.dataset.sg = "1"; return; }
    log.dataset.sg = "1";
    setTimeout(function () { if (!log.querySelector(".ac-me")) step(log, "start"); }, 500);
  }

  /* Day-aware opening hours: "open tomorrow?", "open now?", "closing time today?", "open Saturday?" */
  var DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  var HRS = [null, [9, 17], [9, 17], [9, 17], [9, 17], [9, 17], [9, 14]];
  function fmt(h) { return (h > 12 ? h - 12 : h) + (h >= 12 ? "pm" : "am"); }
  function sydNow() {
    var p = {}; new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "long", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { d: DAYS.indexOf(p.weekday.toLowerCase()), m: (+p.hour % 24) * 60 + (+p.minute) };
  }
  function hoursAnswer(q) {
    q = q.toLowerCase();
    if (!/\b(open|opened|close|closed|closing|shut|hours|trading|working)\b/.test(q)) return null;
    var now = sydNow(), d = null, label = "";
    if (/\b(tomorrow|tmrw|tmr|tomoz)\b/.test(q)) { d = (now.d + 1) % 7; label = "Tomorrow"; }
    else if (/\b(today|tonight|now|right now|at the moment|currently|still)\b/.test(q)) { d = now.d; label = "Today"; }
    else if (/\b(weekend)\b/.test(q)) return "This weekend: Saturday 9am to 2pm, and we're closed on Sunday.";
    else DAYS.forEach(function (n, i) { if (d === null && new RegExp("\\b" + n.slice(0, 3) + "(" + n.slice(3) + ")?s?\\b").test(q)) { d = i; label = "On " + n.charAt(0).toUpperCase() + n.slice(1); } });
    if (d === null) return null;
    var h = HRS[d], name = DAYS[d].charAt(0).toUpperCase() + DAYS[d].slice(1), out;
    if (label !== "Today" && label !== "Tomorrow") label = "On " + name;
    var lab = /^On /.test(label) ? label : label + " (" + name + ")";
    out = h ? lab + " we're open " + fmt(h[0]) + " to " + fmt(h[1]) + "." : lab + " we're closed. We're open Monday to Friday 9am to 5pm and Saturday 9am to 2pm.";
    if (label === "Today" && h) {
      if (now.m < h[0] * 60) out += " We open at " + fmt(h[0]) + ".";
      else if (now.m < h[1] * 60) out += " We're open now, until " + fmt(h[1]) + ".";
      else out += " We've closed for today.";
    }
    return out + " On public holidays, call first to check.";
  }
  document.addEventListener("submit", function (e) {
    var f = e.target; if (!f.classList || !f.classList.contains("ac-in")) return;
    var i = f.querySelector("input"), q = (i && i.value || "").trim(), a = q && hoursAnswer(q); if (!a) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var log = document.querySelector(".ac-panel.on .ac-log") || document.querySelector(".ac-log"); if (!log) return;
    i.value = ""; log.dataset.sg = "1"; log.appendChild(el("div", "ac-m ac-me", q)); scroll(log); track("hours_day");
    typing(log, function () {
      var b = el("div", "ac-m ac-bot"); b.appendChild(el("div", null, a));
      var links = el("div", "ac-links"), c = el("a", null, "Call (02) 8798 5715"); c.href = TEL; links.appendChild(c);
      var v = el("a", null, "Hours and address"); v.href = "/#visit"; links.appendChild(v); b.appendChild(links);
      log.appendChild(b); scroll(log);
    });
  }, true);

  /* Voice: say what went wrong instead of failing silently (the shared engine only reports a blocked mic) */
  (function () {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR || !SR.prototype || SR.prototype.__sg) return;
    var MSG = {
      "no-speech": "I didn't hear anything. Tap the microphone, wait for \"Listening\", then speak. Or type your question.",
      "audio-capture": "I couldn't find a microphone on this device. Please type your question.",
      "network": "Voice needs this browser's speech service, and it couldn't connect. Please try Chrome or Safari, or type your question.",
      "language-not-supported": "Voice isn't available in this browser's language setting. Please type your question.",
      "service-not-allowed": null, "not-allowed": null, "aborted": null
    };
    var start = SR.prototype.start;
    SR.prototype.start = function () {
      var rec = this, heard = false;
      try { rec.addEventListener("result", function () { heard = true; }); } catch (e) {}
      try { rec.addEventListener("error", function (ev) {
        var m = MSG[ev.error]; if (m === null) return; if (m === undefined) m = "Voice didn't work in this browser (" + ev.error + "). Please type your question.";
        var log = document.querySelector(".ac-panel.on .ac-log") || document.querySelector(".ac-log"); if (!log) return;
        log.dataset.sg = "1"; log.appendChild(el("div", "ac-m ac-bot", m)); scroll(log); track("voice_" + ev.error);
      }); } catch (e) {}
      return start.apply(rec, arguments);
    };
    SR.prototype.__sg = 1;
  })();
  var css = ".sg-typing{display:flex;gap:4px;align-items:center;width:max-content}.sg-typing i{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.35;animation:sg-b 1s infinite}.sg-typing i:nth-child(2){animation-delay:.15s}.sg-typing i:nth-child(3){animation-delay:.3s}@keyframes sg-b{0%,100%{opacity:.25;transform:none}50%{opacity:.8;transform:translateY(-2px)}}" +
    ".sg-chips .ac-chip[disabled]{opacity:.45;cursor:default}.sg-chips .ac-chip.sg-picked{opacity:1;border-color:#e8740c;background:#fff3e4;color:#1a1209}html[data-theme=dark] .sg-chips .ac-chip.sg-picked{background:#2b1f12;color:#fff}" +
    ".sg-tag{display:inline-block;margin-bottom:6px;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:700}.sg-book{background:#fde3c8;color:#7a3b04}.sg-none{background:#dcf2e3;color:#1d6b3a}.sg-expert{background:#e3e9f7;color:#2a4f9c}" +
    "@media (prefers-reduced-motion:reduce){.sg-typing i{animation:none}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  function nameLaunch() { var b = document.querySelector(".ac-launch"); if (b && !b.getAttribute("aria-label")) b.setAttribute("aria-label", "Chat with us"); }
  nameLaunch();
  new MutationObserver(function () {
    nameLaunch();
    var log = document.querySelector(".ac-log");
    if (log && !log.children.length) delete log.dataset.sg; // the chat was reset
    maybeStart();
  }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
})();
