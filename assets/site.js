/* Shine Auto Repairs: page behaviour (moved out of index.html to keep the page light) */
(function(){
  var root=document.documentElement;
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var hasIO="IntersectionObserver" in window;

  function seen(el,fn,thr){
    if(!el)return;
    if(!hasIO){fn(el);return}
    new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){o.unobserve(e.target);fn(e.target)}})},{threshold:thr||0,rootMargin:"0px 0px -10% 0px"}).observe(el);
  }
  function addIn(el){el.classList.add("in")}

  // Reveals: CSS scroll-driven where supported, observer fallback otherwise
  var hasSDA=window.CSS&&CSS.supports&&CSS.supports("animation-timeline: view()");
  if(!reduce&&!hasSDA&&hasIO){root.classList.add("io");$$(".rv").forEach(function(el){seen(el,addIn,0)})}
  seen($("#ps"),addIn,.3);

  // Section headings rise in word by word (transform only, text stays in the DOM)
  if(!reduce&&hasIO){$$(".sec__head h2,.callcard h2").forEach(function(h){
    var ws=h.textContent.trim().split(/\s+/);
    h.innerHTML=ws.map(function(w,i){return '<span class="w" style="--i:'+i+'"><span>'+w.replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c]})+'</span></span>'}).join(" ");
    h.classList.add("split");seen(h,addIn,0)})}
  // Header: dark while over the hero, light over the page
  var hero=$(".hero"),tick=false;
  function hdr(){tick=false;root.classList.toggle("lit",hero.getBoundingClientRect().bottom<90)}
  addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(hdr)}},{passive:true});hdr();

  // Menu
  var nav=$("#nav"),mb=$(".menu-btn",nav);
  function setMenu(o){nav.classList.toggle("open",o);mb.setAttribute("aria-expanded",String(o));mb.setAttribute("aria-label",o?"Close menu":"Open menu")}
  mb.addEventListener("click",function(){setMenu(mb.getAttribute("aria-expanded")!=="true")});
  var my=0;addEventListener("scroll",function(){if(!nav.classList.contains("open")){my=scrollY;return}if(Math.abs(scrollY-my)>24)setMenu(false)},{passive:true});
  mb.addEventListener("click",function(){my=scrollY});
  $$(".nav__links a",nav).forEach(function(a){a.addEventListener("click",function(){setMenu(false)})});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&nav.classList.contains("open")){setMenu(false);mb.focus()}});

  // FAQ: slow native fold
  $$(".faq button").forEach(function(b){
    b.addEventListener("click",function(){var it=b.closest(".faq__item"),o=!it.classList.contains("open-q");it.classList.toggle("open-q",o);b.setAttribute("aria-expanded",String(o))});
  });

  // Warning lights: one selected at a time, the first shown to start
  var panel=$("#lpanel"),lb=$$(".lbtn");
  function light(b,user){
    lb.forEach(function(x){x.setAttribute("aria-pressed",String(x===b))});
    $$(".lp").forEach(function(p){p.classList.toggle("on",p.id==="lp-"+b.getAttribute("data-l"))});
    panel.classList.add("has");
    if(user&&innerWidth<=980){var r=panel.getBoundingClientRect();if(r.top>innerHeight*.7||r.top<0)panel.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})}
  }
  lb.forEach(function(b){b.addEventListener("click",function(){light(b,!b.dataset.auto)})});
  if(lb.length)light(lb[0]);

  // A moving indicator behind the chosen item in a list
  function indicator(list,sel){
    var ind=document.createElement("span");ind.className="ind";ind.setAttribute("aria-hidden","true");list.prepend(ind);list.classList.add("has-ind");
    function place(){var it=$(sel,list);if(!it)return;ind.style.width=it.offsetWidth+"px";ind.style.height=it.offsetHeight+"px";ind.style.transform="translate("+it.offsetLeft+"px,"+it.offsetTop+"px)"}
    place();addEventListener("resize",place);return place;
  }
  var placeL=indicator($(".lights .list"),'[aria-pressed="true"]');
  lb.forEach(function(b,i){
    b.addEventListener("click",placeL);
    b.addEventListener("keydown",function(e){var k=e.key,cols=innerWidth<=760?3:1,j=null;
      if(k==="ArrowDown")j=i+cols;if(k==="ArrowUp")j=i-cols;if(k==="ArrowRight")j=i+1;if(k==="ArrowLeft")j=i-1;if(k==="Home")j=0;if(k==="End")j=lb.length-1;
      if(j!==null){e.preventDefault();j=(j+lb.length)%lb.length;light(lb[j]);placeL();lb[j].focus()}});
  });

  // Services: one at a time like a status. Bars fill, then the next service slides to the centre.
  // Previous / next / pause; keeps moving until paused with the button, rests while off screen; native sideways scroll, no autoplay under reduced motion.
  (function(){
    var car=$(".scar");if(!car)return;
    var tr=$(".sc-track",car),cards=$$(".sc",car),cnt=$(".sc-count b",car),play=$(".sc-play",car),bars=[],cur=0,prog=0,user=reduce,why={};
    var bw=document.createElement("div");bw.className="sc-bars";
    cards.forEach(function(c,i){var b=document.createElement("button");b.type="button";b.className="sc-bar";b.setAttribute("aria-label","Show "+c.querySelector("h3").textContent);b.innerHTML="<i></i>";
      b.addEventListener("click",function(){show(i,true)});bw.appendChild(b);bars.push(b);
      b.querySelector("i").addEventListener("animationend",function(){if(i===cur)show((cur+1)%cards.length)});});
    car.insertBefore(bw,tr);
    cards.forEach(function(c,i){var r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("class","sc-ring");r.setAttribute("aria-hidden","true");
      r.innerHTML='<rect width="100%" height="100%" rx="26" ry="26" pathLength="100"/>';c.appendChild(r);
      r.firstChild.addEventListener("animationend",function(){if(i===cur&&!car.classList.contains("still"))show((cur+1)%cards.length)})});
    function centre(i){var c=cards[i].getBoundingClientRect(),t=tr.getBoundingClientRect();return Math.round(tr.scrollLeft+(c.left-t.left)-(tr.clientWidth-c.width)/2)}
    function paint(){cards.forEach(function(c,k){if(k===cur){c.classList.remove("on");void c.offsetWidth;c.classList.add("on")}else c.classList.remove("on")});
      bars.forEach(function(b,k){b.classList.toggle("done",k<cur);var was=b.classList.contains("on");b.classList.remove("on");if(k===cur){void b.offsetWidth;b.classList.add("on")}b.setAttribute("aria-current",String(k===cur))});
      cnt.textContent=cur+1}
    /* a slow eased glide between services (snap is paused while it runs) */
    function glide(x){if(reduce){tr.scrollLeft=x;return}cancelAnimationFrame(glide.r);var s0=tr.scrollLeft,d=x-s0,t0=0;tr.style.scrollSnapType="none";
      function st(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/950),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;tr.scrollLeft=s0+d*e;if(k<1)glide.r=requestAnimationFrame(st);else tr.style.scrollSnapType=""}
      glide.r=requestAnimationFrame(st)}
    function show(i,byUser){cur=(i+cards.length)%cards.length;clearTimeout(prog);prog=setTimeout(function(){prog=0},1200);
      glide(centre(cur));paint()}
    function hold(){car.classList.toggle("hold",!!(user||why.h||why.f||why.o||why.t||document.hidden))}
    function setUser(p){user=p;car.classList.toggle("is-paused",p);play.setAttribute("aria-label",p?"Play the services slideshow":"Pause the services slideshow");hold()}
    $$(".sc-btn[data-dir]",car).forEach(function(b){b.addEventListener("click",function(){show(cur+(+b.dataset.dir),true)})});
    play.addEventListener("click",function(){setUser(!user)});
    cards.forEach(function(c,i){c.addEventListener("click",function(e){if(i!==cur&&!e.target.closest("a")){e.preventDefault();show(i,true)}})});
    var raf=0;tr.addEventListener("scroll",function(){if(raf||prog)return;raf=requestAnimationFrame(function(){raf=0;if(prog)return;
      var mid=tr.scrollLeft+tr.clientWidth/2,best=0,d=1e9;cards.forEach(function(c,k){var x=Math.abs(c.offsetLeft+c.offsetWidth/2-mid);if(x<d){d=x;best=k}});
      if(best!==cur){cur=best;paint()}})},{passive:true});
    document.addEventListener("visibilitychange",hold);
    /* finger swipes: when the scrolling stops, glide to the nearest card */
    var settleT=0,touching=false;tr.addEventListener("touchstart",function(){touching=true;cancelAnimationFrame(glide.r)},{passive:true});
    tr.addEventListener("touchend",function(){touching=false},{passive:true});
    tr.addEventListener("scroll",function(){if(prog||touching)return;clearTimeout(settleT);settleT=setTimeout(function(){if(prog||touching)return;var x=centre(cur);if(Math.abs(tr.scrollLeft-x)>2){prog=setTimeout(function(){prog=0},1200);glide(x)}},140)},{passive:true});
    if(hasIO)new IntersectionObserver(function(es){why.o=!es[0].isIntersecting;hold()},{threshold:.35}).observe(car);else why.o=0;
    if(reduce)car.classList.add("still");
    addEventListener("resize",function(){tr.scrollTo({left:centre(cur)})});
    setUser(user);tr.scrollTo({left:centre(0)});paint();
  })();


  // 3D bay: the drag cue goes once the car has been turned
  var stage=$(".bay-stage");stage.addEventListener("pointerdown",function(){stage.classList.add("dragged")});stage.addEventListener("keydown",function(e){if(/Arrow/.test(e.key))stage.classList.add("dragged")});

  // Steps draw in, the rating needle sweeps once
  seen($(".steps"),addIn,.35);seen($(".b-rate"),addIn,.5);

  // Soft pointer light on cards (laptops only)
  if(matchMedia("(hover:hover) and (pointer:fine)").matches)$$(".lift").forEach(function(c){var raf=0,ev;c.addEventListener("pointermove",function(e){ev=e;if(!raf)raf=requestAnimationFrame(function(){raf=0;var r=c.getBoundingClientRect();c.style.setProperty("--mx",(ev.clientX-r.left)+"px");c.style.setProperty("--my",(ev.clientY-r.top)+"px")})})});

  // Nav: mark the section in view
  if(hasIO){var links={};$$(".nav__links a").forEach(function(a){links[a.getAttribute("href").slice(1)]=a});
    var navIO=new IntersectionObserver(function(es){es.forEach(function(e){var a=links[e.target.id];if(a)a.classList.toggle("on",e.isIntersecting)})},{rootMargin:"-45% 0px -50% 0px"});
    Object.keys(links).forEach(function(id){var el=document.getElementById(id);if(el)navIO.observe(el)})}

  // Phone quick bar: hidden while the hero is on screen
  if(hasIO){new IntersectionObserver(function(es){root.classList.toggle("past-hero",es[0].intersectionRatio<0.2)},{threshold:[0,0.2,0.4]}).observe(hero)}
  else root.classList.add("past-hero");

  // Rego lookup: plate and state in, the car and a slip guide out
  var form=$("#rego"),inp=$("#rego-plate"),st=$("#rego-state"),badge=$("#rego-badge"),go=$("#rego-go"),out=$("#rego-out");
  var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
  var TEL='<a href="tel:+61287985715">(02) 8798 5715</a>';
  var MSG={
    off:'Car lookup is coming soon. For now, call us on '+TEL+' and we\'ll check it for you.',
    notfound:'We couldn\'t find that plate. Check it and try again, or just <a href="tel:+61287985715">call us</a>.',
    busy:'That\'s a lot of lookups. Try again in a few minutes, or <a href="tel:+61287985715">call us</a>.',
    fail:'The lookup isn\'t working right now. Call us on '+TEL+' and we\'ll help.'
  };
  var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
  var tc=function(s){return String(s||"").split(/\s+/).map(function(w){return /\d/.test(w)?w.toUpperCase():w.toLowerCase().replace(/(^|[\-\/])([a-z])/g,function(m,a,b){return a+b.toUpperCase()})}).join(" ")};
  function say(html){out.innerHTML='<div class="rres rres--msg">'+html+'</div>'}
  function clearSlips(){["slip-pink","slip-blue"].forEach(function(id){$("#"+id).classList.remove("is-car")});$("#slip-verdict").hidden=true}
  st.addEventListener("change",function(){if(reduce){badge.textContent=st.value;return}badge.classList.remove("flip");void badge.offsetWidth;badge.classList.add("flip");setTimeout(function(){badge.textContent=st.value},180)});
  // Placeholder types out example plates until the visitor starts
  if(!reduce){var EX=["ABC12D","SHINE1","YOUR REGO"],wi=0,ci=0,del=false,tw=null;
    var step=function(){if(document.activeElement===inp||inp.value||root.classList.contains("past-hero")){tw=setTimeout(step,800);return}
      var w=EX[wi];ci+=del?-1:1;inp.placeholder=w.slice(0,ci)||" ";
      var d=del?55:120;if(!del&&ci===w.length){del=true;d=1600}else if(del&&ci===0){del=false;wi=(wi+1)%EX.length;d=350}
      tw=setTimeout(step,d)};
    tw=setTimeout(step,2600);inp.addEventListener("focus",function(){clearTimeout(tw);inp.placeholder="YOUR REGO";tw=setTimeout(step,800)});}
  inp.addEventListener("input",function(){var v=inp.value.toUpperCase();if(v!==inp.value)inp.value=v});
  function today(){var p=new Intl.DateTimeFormat("en-CA",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()).split("-");return {y:+p[0],ms:Date.UTC(+p[0],+p[1]-1,+p[2])}}
  function name(v){
    var make=v.make||"",model=v.model||"",drop={};
    (make+" "+model).split(/\s+/).forEach(function(w){if(w)drop[w.toLowerCase()]=1});
    var variant=(v.description||"").split(/\s+/).filter(function(w){return w&&!drop[w.toLowerCase()]}).join(" ");
    var parts=make||model?[make,model,variant]:[v.description||""];
    return [v.year||""].concat(parts).filter(Boolean).map(function(x,i){return i===0&&v.year?x:tc(x)}).join(" ");
  }
  function show(v,state){
    var t=today(),html='<strong>'+esc(name(v)||"Your car")+'</strong>',meta=[v.colour,v.body].filter(Boolean).map(tc).join(" · ");
    if(meta)html+='<span class="m">'+esc(meta)+'</span>';
    var days=null;
    if(v.regoExpiry&&/^\d{4}-\d{2}-\d{2}/.test(v.regoExpiry)){
      var e=v.regoExpiry.split("-"),ems=Date.UTC(+e[0],+e[1]-1,+e[2]);days=Math.round((ems-t.ms)/864e5);
      var ds=(+e[2])+" "+MONTHS[+e[1]-1]+" "+e[0];
      html+='<span>'+(days>=0?"Rego due "+ds+(days<=42?(days===0?", today":", in "+days+" day"+(days===1?"":"s")):""):"Rego ran out "+(-days)+" day"+(days===-1?"":"s")+" ago")+'</span>';
    }else if(state==="NSW"){
      html+='<span><a href="https://service.nsw.gov.au/transaction/check-vehicle-registration" target="_blank" rel="noopener">Check your rego due date with Service NSW</a></span>';
    }
    var reg=state==="NSW"&&(days===null||days>-90),kind=null;
    if(!reg)kind="blue";else if(v.year)kind=(t.y-v.year>5)?"pink":"none";
    var V={pink:["Needs a pink slip to renew","Your car needs a pink slip to renew its rego."],none:["No inspection needed to renew","No inspection needed to renew. A logbook service is still worth booking."],blue:["Needs a blue slip to register in NSW","You'll need a blue slip to register it in NSW."]};
    clearSlips();
    if(kind){
      html+='<span class="verd" style="--vc:'+(kind==="blue"?"#3b6fd8":kind==="pink"?"#d24a6c":"#2f9e5b")+'">'+V[kind][0]+'</span>';
      if(kind!=="none")$("#slip-"+kind).classList.add("is-car");
      $("#slip-verdict-t").textContent=V[kind][1];$("#slip-verdict").hidden=false;
    }
    html+='<a class="btn btn--ink" href="#slips">See what\'s checked and the fees</a>';
    out.innerHTML='<div class="rres">'+html+'</div>';
  }
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var plate=inp.value.toUpperCase().replace(/[^A-Z0-9]/g,""),state=st.value;
    if(plate.length<2){say("Type the letters and numbers on your plate.");inp.focus();return}
    go.disabled=true;var lbl=go.textContent;go.textContent="Looking up your car…";say("Looking up your car…");
    fetch("/api/rego?plate="+encodeURIComponent(plate)+"&state="+encodeURIComponent(state),{headers:{Accept:"application/json"}})
      .then(function(r){return r.json().catch(function(){return {}}).then(function(b){return {s:r.status,b:b||{}}})})
      .then(function(x){
        if(x.s===200&&x.b.ok&&x.b.vehicle)return show(x.b.vehicle,state);
        clearSlips();
        var k=x.b.reason;say(MSG[k==="off"&&x.s===503?"off":k==="notfound"?"notfound":k==="busy"?"busy":"fail"]);
      })
      .catch(function(){clearSlips();say(MSG.fail)})
      .then(function(){go.disabled=false;go.textContent=lbl});
  });

  // Open now, in Sydney time. Hours: Mon to Fri 9 to 5, Sat 9 to 2, Sun closed. Shared by the hero and the hours card.
  var H={0:null,1:[540,1020],2:[540,1020],3:[540,1020],4:[540,1020],5:[540,1020],6:[540,840]};
  var NAMES=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  function fmt(m){var h=Math.floor(m/60),mm=m%60,s=h>=12?"pm":"am",h12=h%12||12;return h12+(mm?":"+String(mm).padStart(2,"0"):"")+s}
  function sydney(){
    var p=new Intl.DateTimeFormat("en-US",{timeZone:"Australia/Sydney",weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
    var g=function(t){for(var i=0;i<p.length;i++)if(p[i].type===t)return p[i].value};
    return {d:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(g("weekday")),m:(+g("hour")%24)*60+(+g("minute"))};
  }
  function update(){
    var n;try{n=sydney()}catch(e){return}
    var t=H[n.d],open=!!(t&&n.m>=t[0]&&n.m<t[1]),msg;
    if(open)msg="Open now, until "+fmt(t[1])+" today";
    else if(t&&n.m<t[0])msg="Closed, opens today at "+fmt(t[0]);
    else{for(var k=1;k<8;k++){var dd=(n.d+k)%7;if(H[dd]){msg="Closed, opens "+(k===1?"tomorrow":NAMES[dd])+" at "+fmt(H[dd][0]);break}}}
    $$("[data-status]").forEach(function(el){el.classList.toggle("is-open",open);$("[data-status-text]",el).textContent=msg});
    var tb=$(".tbar");if(tb){var S=420,E=1140,pc=function(m){return Math.max(0,Math.min(1,(m-S)/(E-S)))};
      $(".tbar__t",tb).innerHTML=t?"Today, <b>"+fmt(t[0])+" to "+fmt(t[1])+"</b>":"<b>Closed today</b>";
      $(".tbar__open",tb).style.transform=t?"translateX("+pc(t[0])*100+"%) scaleX("+(pc(t[1])-pc(t[0]))+")":"scaleX(0)";
      var nw=$(".tbar__now",tb);nw.style.transform="translateX("+pc(n.m)*100+"%)";nw.style.opacity=(n.m<S||n.m>E)?0:1;}
    $$(".hours li").forEach(function(li){li.classList.toggle("today",li.getAttribute("data-days").split(",").indexOf(String(n.d))>-1)});
  }
  update();setInterval(function(){if(!document.hidden)update()},60000);
})();

/* Ask Shine: open the website assistant with the visitor's question */
(function(){var f=document.getElementById("askbox");if(!f)return;
f.addEventListener("submit",function(e){e.preventDefault();var q=f.q.value.trim();
 if(!window.SITE_CHAT_OPEN){location.href="tel:+61287985715";return;}
 window.SITE_CHAT_OPEN();
 var tries=0;(function put(){var inp=document.querySelector(".ac-in input");
  if(!inp){if(++tries<40)return setTimeout(put,50);return;}
  if(!q){inp.focus();return;}
  inp.value=q;inp.dispatchEvent(new Event("input",{bubbles:true}));
  var form=inp.closest("form");if(form&&form.requestSubmit)form.requestSubmit();else{var b=document.querySelector(".ac-in button[type=submit],.ac-in .ac-send");if(b)b.click();}
  f.q.value="";})();
});})();

/* Hero scenes: crossfade every 6s once the roller door has opened; pause off screen; none under reduced motion */
(function(){var box=document.getElementById("heroShow");if(!box)return;var imgs=[].slice.call(box.querySelectorAll("img")),dots=[].slice.call(document.querySelectorAll(".hero__dots i"));
 var hero=box.parentNode,body=hero.querySelector(".hero__body"),blur=document.getElementById("heroBlur"),bl=blur?[].slice.call(blur.querySelectorAll("img")):[];
 /* fit the blurred area to the text block */
 function fitBlur(){if(!blur||!body)return;var hr=hero.getBoundingClientRect(),w=0,top=1e9,bot=0;
  [].forEach.call(body.children,function(c){var r=c.getBoundingClientRect();if(!r.height)return;w=Math.max(w,r.width);top=Math.min(top,r.top);bot=Math.max(bot,r.bottom)});
  if(!w)return;var h=bot-top;blur.style.setProperty("--bw",Math.round(Math.min(hr.width*.75,w*.62+120))+"px");blur.style.setProperty("--bh",Math.round(h*.62+70)+"px");blur.style.setProperty("--by",Math.round(top-hr.top+h/2)+"px");}
 fitBlur();addEventListener("resize",fitBlur);addEventListener("load",fitBlur);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitBlur);
 var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;if(reduce||imgs.length<2)return;
 function load(im){if(im&&im.dataset.src){if(im.dataset.srcset)im.srcset=im.dataset.srcset;im.src=im.dataset.src;im.removeAttribute("data-src");}}
 function ready(im){return !im||(im.complete&&im.naturalWidth)}
 var cur=0,timer=null,vis=true;
 function go(){var nx=(cur+1)%imgs.length,im=imgs[nx],bi=bl[nx];load(im);load(bi);load(imgs[(nx+1)%imgs.length]);load(bl[(nx+1)%imgs.length]);
  var done=false,show=function(){if(done||!ready(im)||!ready(bi))return;done=true;imgs[cur].classList.remove("on");im.classList.add("on");if(bl[cur])bl[cur].classList.remove("on");if(bi)bi.classList.add("on");dots.forEach(function(d,k){d.classList.toggle("on",k===nx);if(k===nx){d.style.animation="none";void d.offsetWidth;d.style.animation="";}});cur=nx;};
  show();if(!done){im.addEventListener("load",show,{once:true});if(bi)bi.addEventListener("load",show,{once:true});}}
 function start(){if(!timer)timer=setInterval(function(){if(vis&&!document.hidden)go();},6000);}
 addEventListener("load",function(){setTimeout(function(){load(imgs[1]);load(bl[1]);start();},2600);});
 if("IntersectionObserver" in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;},{threshold:.15}).observe(box);
})();

/* Warning lights: step to the next light every 7s (phones and laptops) while the panel is on screen; a tap holds it for 15s */
(function(){var sec=document.querySelector(".lights");if(!sec)return;var btns=[].slice.call(sec.querySelectorAll(".lbtn")),list=sec.querySelector(".list");
 if(!btns.length||!list||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 var mq=matchMedia("all"),bar=document.createElement("div");bar.className="lprog";bar.setAttribute("aria-hidden","true");bar.innerHTML="<i></i>";list.parentNode.insertBefore(bar,list.nextSibling);
 var vis=false,holdUntil=0,auto=false;
 function restart(){var i=bar.firstChild;i.style.animation="none";void i.offsetWidth;i.style.animation=""}
 function cur(){return btns.findIndex(function(b){return b.getAttribute("aria-pressed")==="true"})}
 function next(){var i=(cur()+1)%btns.length;btns[i].dataset.auto="1";btns[i].click();delete btns[i].dataset.auto;restart()}
 bar.firstChild.addEventListener("animationend",function(){if(auto&&vis&&Date.now()>holdUntil&&!document.hidden)next();else restart()});
 btns.forEach(function(b){b.addEventListener("click",function(){if(!b.dataset.auto){holdUntil=Date.now()+15000;sec.classList.add("hold");setTimeout(function(){sec.classList.remove("hold");restart()},15000)}})});
 function set(){auto=mq.matches;sec.classList.toggle("auto",auto&&vis);if(auto&&vis)restart()}
 if("IntersectionObserver" in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;set()},{threshold:.5}).observe(sec.querySelector(".duo")||sec);
 mq.addEventListener("change",set);
})();



/* Theme button */
(function(){var b=document.querySelector(".theme-btn");if(!b)return;var root=document.documentElement;
 function paint(){var d=root.getAttribute("data-theme")==="dark";b.setAttribute("aria-pressed",String(d));b.setAttribute("aria-label",d?"Switch to light mode":"Switch to dark mode");
  var m=document.querySelector('meta[name="theme-color"]');}
 b.addEventListener("click",function(){var t=root.getAttribute("data-theme")==="dark"?"light":"dark";root.setAttribute("data-theme",t);try{localStorage.setItem("shine-theme",t)}catch(e){}paint()});
 matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(e){var saved;try{saved=localStorage.getItem("shine-theme")}catch(x){}if(!saved){root.setAttribute("data-theme",e.matches?"dark":"light");paint()}});
 paint();
})();

/* The SUV parks: once the drive-in ends, swap back to the still wheels */
document.addEventListener("animationend",function(e){if(e.animationName==="suv-in"||e.animationName==="suv-in-m"||e.animationName==="suv-lane"||e.animationName==="suv-lane-m"){var r=document.documentElement;r.classList.remove("drive");r.classList.add("parked");setTimeout(function(){r.classList.remove("parked")},900)}});

/* Reviews: move one review at a time every 4.5s while on screen; pause on hover or focus; previous / next always work */
(function(){var run=document.querySelector(".rv-run");if(!run)return;var cards=[].slice.call(run.querySelectorAll(".rv-c")),reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,hold=false,vis=false,last=0;
 function step(){return cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:run.clientWidth}
 function go(d){var max=run.scrollWidth-run.clientWidth,x=run.scrollLeft+d*step();if(d>0&&run.scrollLeft>=max-4)x=0;if(d<0&&run.scrollLeft<=4)x=max;run.scrollTo({left:x,behavior:reduce?"auto":"smooth"})}
 [].forEach.call(document.querySelectorAll(".rv-b"),function(b){b.addEventListener("click",function(){go(+b.dataset.d);last=Date.now()})});
 run.addEventListener("focusin",function(){hold=true});run.addEventListener("focusout",function(){hold=false});
 run.addEventListener("touchstart",function(){last=Date.now()},{passive:true});
 var tm=0;function tick(){clearTimeout(tm);if(reduce)return;tm=setTimeout(function(){if(vis&&!hold&&!document.hidden&&Date.now()-last>6000)go(1);tick()},3500)}
 if("IntersectionObserver" in window)new IntersectionObserver(function(es){var was=vis;vis=es[0].isIntersecting;if(vis&&!was&&!reduce){clearTimeout(tm);tm=setTimeout(function(){go(1);tick()},1000)}},{threshold:.25}).observe(run);
 else vis=true,tick();
})();





/* If the visitor scrolls during the drive-in, skip straight to the parked button */
(function(){var r=document.documentElement;function stop(){if(scrollY>40&&r.classList.contains("drive"))r.classList.remove("drive")}addEventListener("scroll",stop,{passive:true})})();

/* Pink slip clips: list the checks that have a real clip in assets/video/ps-<check>.mp4 (and .webm, optional poster from the photo).
   Until a clip is listed here, that check shows its photo. Example: var CLIPS=["tyres","brakes"]; */
(function(){var CLIPS=[];var bay=document.getElementById("bay3d");if(!bay||!CLIPS.length)return;
 var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,stage=bay.querySelector(".ps-scene");
 CLIPS.forEach(function(n){var im=stage.querySelector('img[data-pt="'+n+'"]');if(!im)return;var v=document.createElement("video");
  v.dataset.pt=n;v.muted=true;v.loop=true;v.playsInline=true;v.preload="none";v.setAttribute("aria-label",im.alt);v.poster=(im.dataset.src||im.src);
  v.innerHTML='<source src="assets/video/ps-'+n+'.webm" type="video/webm"><source src="assets/video/ps-'+n+'.mp4" type="video/mp4">';
  v.className=im.className;im.after(v);im.classList.add("has-clip")});
 function sync(){stage.querySelectorAll("video").forEach(function(v){var on=!!stage.querySelector('img.on[data-pt="'+v.dataset.pt+'"]');v.classList.toggle("on",on);if(on&&!reduce){v.preload="auto";v.play().catch(function(){})}else v.pause()})}
 new MutationObserver(sync).observe(stage,{subtree:true,attributes:true,attributeFilter:["class"]});sync();
})();

/* Pink slip: Delta-style live diagram. Each check lists its steps; the mechanic does them in order, the current step is highlighted. */
(function(){var bay=document.getElementById("bay3d"),lw=document.getElementById("lw");if(!bay||!lw)return;
 var stage=bay.querySelector(".lw-stage"),keys=[].slice.call(bay.querySelectorAll(".pt-num [data-pt]")),again=bay.querySelector(".pt-again"),man=lw.querySelector(".lw-man"),hl=lw.querySelector(".lw-hl");
 var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,cur=0,step=0,vis=false,paused=false,hold=0,timer=0,walkT=0,lastX=860,STEP_MS=2800;
 var S={"tyres": [{"x": 622, "f": -1, "p": "c", "t": "gauge", "a": "low", "h": [530, 282, 64, 40, 10]}, {"x": 622, "f": -1, "p": "c", "t": "torch", "a": "low", "h": [524, 262, 76, 76, 38]}, {"x": 214, "f": 1, "p": "c", "t": "torch", "a": "low", "h": [240, 262, 76, 76, 38]}], "brakes": [{"x": 214, "f": 1, "p": "c", "t": "torch", "a": "low", "h": [248, 272, 60, 56, 28]}, {"x": 620, "f": -1, "p": "s", "t": "", "a": "reach", "h": [444, 240, 112, 48, 10], "o": "o-door"}], "steering": [{"x": 650, "f": -1, "p": "s", "t": "", "a": "clip", "h": [512, 240, 96, 10, 4], "lift": 1}, {"x": 545, "f": 1, "p": "s", "t": "", "a": "up", "h": [530, 196, 64, 64, 32], "lift": 1}, {"x": 545, "f": 1, "p": "s", "t": "torch", "a": "up", "h": [500, 180, 40, 50, 10], "lift": 1}], "lights": [{"x": 712, "f": -1, "p": "s", "t": "clip", "a": "clip", "h": [652, 248, 30, 22, 8]}, {"x": 124, "f": 1, "p": "s", "t": "clip", "a": "clip", "h": [164, 246, 30, 36, 8], "o": "s-lights"}, {"x": 124, "f": 1, "p": "s", "t": "clip", "a": "clip", "h": [168, 270, 40, 26, 6], "o": "s-lights"}], "windscreen": [{"x": 600, "f": -1, "p": "s", "t": "", "a": "reach", "h": [444, 198, 112, 42, 12]}, {"x": 600, "f": -1, "p": "s", "t": "", "a": "reach", "h": [438, 232, 124, 14, 6]}], "seatbelts": [{"x": 620, "f": -1, "p": "s", "t": "", "a": "reach", "h": [444, 198, 112, 92, 12], "o": "o-door"}, {"x": 620, "f": -1, "p": "s", "t": "", "a": "low", "h": [444, 250, 60, 40, 10], "o": "o-door"}, {"x": 620, "f": -1, "p": "s", "t": "", "a": "reach", "h": [444, 198, 40, 60, 10], "o": "o-door"}], "body": [{"x": 398, "f": 1, "p": "c", "t": "torch", "a": "low", "h": [300, 280, 250, 22, 8]}, {"x": 500, "f": -1, "p": "c", "t": "torch", "a": "low", "h": [520, 252, 84, 40, 20]}], "exhaust": [{"x": 132, "f": 1, "p": "s", "t": "", "a": "clip", "h": [232, 240, 96, 10, 4], "lift": 1}, {"x": 292, "f": 1, "p": "s", "t": "torch", "a": "up", "h": [188, 216, 100, 26, 10], "lift": 1}, {"x": 330, "f": 1, "p": "s", "t": "", "a": "up", "h": [262, 212, 40, 30, 10], "lift": 1}], "lpg": [{"x": 132, "f": 1, "p": "s", "t": "", "a": "reach", "h": [206, 206, 88, 48, 14], "o": "o-boot"}, {"x": 132, "f": 1, "p": "s", "t": "spray", "a": "spray", "h": [226, 206, 40, 24, 10], "o": "o-boot"}, {"x": 132, "f": 1, "p": "s", "t": "clip", "a": "clip", "h": [206, 218, 88, 34, 14], "o": "o-boot"}]};
 var CU={"tyres": ["gauge", "side", "match"], "brakes": ["disc", "lever"], "steering": ["hoist", "rock", "shock"], "lights": ["head", "tail", "ind"], "windscreen": ["glass", "wiper"], "seatbelts": ["belt", "buckle", "retract"], "body": ["sill", "arch"], "exhaust": ["hoist", "pipe", "mount"], "lpg": ["tank", "spray", "tag"]},CUN=["gauge", "side", "match", "disc", "lever", "hoist", "rock", "shock", "head", "tail", "ind", "glass", "wiper", "belt", "buckle", "retract", "sill", "arch", "pipe", "mount", "tank", "spray", "tag"];
 var CL=["f-l","p-c","t-gauge","t-torch","t-clip","t-spray","a-low","a-up","a-clip","a-reach","a-spray","lift","s-lights","o-door","o-boot"];
 function pose(c){CL.forEach(function(x){lw.classList.remove(x)});
  if(c.f<0)lw.classList.add("f-l");if(c.p==="c")lw.classList.add("p-c");if(c.t)lw.classList.add("t-"+c.t);lw.classList.add("a-"+c.a);if(c.lift)lw.classList.add("lift");if(c.o)lw.classList.add(c.o);
  hl.setAttribute("x",c.h[0]);hl.setAttribute("y",c.h[1]+(c.lift?-70:0));hl.setAttribute("width",c.h[2]);hl.setAttribute("height",c.h[3]);hl.setAttribute("rx",c.h[4]);
  if(lastX!==c.x&&!reduce){lw.classList.add("walk");clearTimeout(walkT);walkT=setTimeout(function(){lw.classList.remove("walk")},1300)}
  man.style.transform="translate("+c.x+"px,332px) scale(1.25)";lastX=c.x}
 function showStep(){var id=keys[cur].dataset.pt,list=bay.querySelectorAll('.pt-info[data-pt="'+id+'"] .pt-steps li');
  [].forEach.call(list,function(li,n){li.classList.toggle("on",n===step);li.classList.toggle("done",n<step)});pose(S[id][step]);CUN.forEach(function(n){lw.classList.remove("cu-"+n)});lw.classList.remove("cu-go");void lw.getBoundingClientRect();lw.classList.add("cu-"+CU[id][step],"cu-go");
  var li=list[step];lw.setAttribute("aria-label","Animated drawing: the mechanic doing step "+(step+1)+" of the "+keys[cur].getAttribute("aria-label").replace(/^Check \d+: /,"").toLowerCase()+" check: "+(li?li.textContent:""))}
 function pick(i){cur=(i+keys.length)%keys.length;step=0;var id=keys[cur].dataset.pt;
  keys.forEach(function(k,n){k.setAttribute("aria-pressed",String(n===cur))});
  [].forEach.call(bay.querySelectorAll(".pt-info"),function(d){d.hidden=d.dataset.pt!==id});
  bay.style.setProperty("--chk",(S[id].length*STEP_MS/1000)+"s");showStep();restart()}
 function restart(){clearTimeout(timer);bay.classList.remove("auto");if(reduce||paused||!vis)return;void bay.offsetWidth;bay.classList.add("auto");tick()}
 function tick(){clearTimeout(timer);timer=setTimeout(function(){if(paused||!vis||document.hidden)return tick();var n=S[keys[cur].dataset.pt].length;
  if(step<n-1){step++;showStep();tick()}else if(Date.now()>hold)pick(cur+1);else tick()},STEP_MS)}
 keys.forEach(function(k,n){k.addEventListener("click",function(){hold=Date.now()+12000;pick(n)})});
 if(again)again.addEventListener("click",function(){lw.classList.remove("in");lastX=860;man.style.transform="translate(860px,332px)";paused=false;stage.classList.remove("is-paused");lw.classList.remove("paused");bay.classList.remove("hold");
  setTimeout(function(){go();setTimeout(function(){pick(0)},1500)},60)});
 function togglePause(){paused=!paused;stage.classList.toggle("is-paused",paused);lw.classList.toggle("paused",paused);bay.classList.toggle("hold",paused);if(!paused)tick()}
 stage.addEventListener("click",togglePause);stage.addEventListener("keydown",function(e){if(e.key===" "||e.key==="Enter"){e.preventDefault();togglePause()}});
 function go(){lw.classList.add("in");if(!reduce){lw.classList.add("driving");setTimeout(function(){lw.classList.remove("driving")},2300)}}
 var started=false;
 if(reduce||!("IntersectionObserver" in window)){lw.classList.add("in");vis=true;pick(0)}
 else new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&!started){started=true;go();setTimeout(function(){pick(0)},1500)}else if(vis)restart()},{threshold:.35}).observe(stage);
})();

/* Chat: the address in the chat contact card links to Google Maps */
(function(){var M="https://www.google.com/maps/search/?api=1&query=Shine+Auto+Repairs+Warwick+Farm&query_place_id=ChIJ-YbkfgOVEmsRFlQ4039uDYI";
 function fix(n){if(!n.querySelectorAll)return;[].forEach.call(n.querySelectorAll(".ac-note"),function(d){if(d.dataset.map||d.textContent.indexOf("\uD83D\uDCCD")!==0)return;d.dataset.map=1;var t=d.textContent.replace(/^\uD83D\uDCCD\s*/,"");d.textContent="\uD83D\uDCCD ";var a=document.createElement("a");a.href=M;a.target="_blank";a.rel="noopener";a.textContent=t;a.style.color="inherit";a.style.textDecoration="underline";d.appendChild(a)})}
 new MutationObserver(function(ms){ms.forEach(function(m){[].forEach.call(m.addedNodes,fix)})}).observe(document.body,{childList:true,subtree:true})})();
