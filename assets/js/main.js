const cfg = (typeof CONFIG !== 'undefined' && CONFIG) ? CONFIG : (window.CONFIG || {});
const personName = cfg.name || "Oloan Fernando Nainggolan";
const bdayDate = cfg.date || "3 November 2026";

if($("#op-name")) $("#op-name").textContent = personName;
if($("#h-name")) $("#h-name").textContent = personName;
if($("#h-date")) $("#h-date").textContent = bdayDate;
if($(".hero-tag") && cfg.heroTag) $(".hero-tag").textContent = cfg.heroTag;
if($(".hero-title") && cfg.heroTitle) $(".hero-title").innerHTML = cfg.heroTitle.replace(/\n/g,"<br>");
if($(".greeting-msg") && cfg.heroMsg) $(".greeting-msg").textContent = cfg.heroMsg;
const heroImg = $("#hero-img");
if(heroImg && cfg.profile) heroImg.src = cfg.profile;
const portrait = $("#portrait");
if(portrait) portrait.append(img(cfg.profile, personName, personName.split(" ").map(w=>w[0]).slice(0,1)+"22"));

/* manual secret access to admin panel (NO button on page) */
document.addEventListener("keydown",(e)=>{
  if(e.ctrlKey&&e.shiftKey&&(e.key==="A"||e.key==="a")){
    e.preventDefault();
    window.location.href="admin.html";
  }
});
let _cClicks=0,_cTimer=null;
const credits=$("#closing small");
if(credits){
  credits.style.userSelect="none";
  credits.addEventListener("click",()=>{
    _cClicks++;clearTimeout(_cTimer);
    if(_cClicks>=3){_cClicks=0;window.location.href="admin.html";}
    else{_cTimer=setTimeout(()=>{_cClicks=0},800);}
  });
}

/* flow */
const openBtn = $("#openBtn");
if(openBtn){
  openBtn.onclick=()=>{
    const op = $("#opening");
    if(op) op.classList.add("gone");
    document.body.classList.remove("locked");
    document.body.classList.add("open");
    if(typeof music !== 'undefined' && music && !music.playing){
      try{ music.play(); }catch(e){ console.warn("Audio autoplay:", e); }
    }
    window.scrollTo(0,0);
  };
}
$("#replay").onclick=()=>{ // tidak memulai ulang musik yang sedang berjalan
  document.body.classList.add("locked");document.body.classList.remove("open");
  $("#opening").classList.remove("gone");window.scrollTo({top:0,behavior:"instant"});
};

/* reveal + progress */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));
addEventListener("scroll",()=>{const h=document.documentElement;$("#bar").style.width=(scrollY/(h.scrollHeight-innerHeight||1)*100)+"%"},{passive:true});

/* ambient brass sparks across full screen & over photo */
(()=>{
  const c=$("#bg");if(!c)return;
  const x=c.getContext("2d");
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  let w,h,P=[];
  const rs=()=>{w=c.width=innerWidth;h=c.height=innerHeight};
  rs();addEventListener("resize",rs);

  // Brass spark colors: rich brass gold, antique gold, warm shimmer
  const colors=[
    [212,175,55],  // rich brass gold
    [198,166,107], // warm antique gold
    [232,198,110], // bright brass shimmer
    [245,220,150]  // golden ember
  ];

  for(let i=0;i<68;i++){
    const col=colors[Math.floor(Math.random()*colors.length)];
    P.push({
      x:Math.random(),
      y:Math.random(),
      r:Math.random()*1.5+0.35,
      vy:Math.random()*0.00007+0.000025,
      vx:(Math.random()-0.5)*0.000015,
      baseA:Math.random()*0.45+0.15,
      freq:Math.random()*0.035+0.015,
      phase:Math.random()*Math.PI*2,
      rgb:col
    });
  }

  let t=0;
  (function f(){
    t++;
    x.clearRect(0,0,w,h);
    for(let i=0;i<P.length;i++){
      const p=P[i];
      p.y-=p.vy*16;
      p.x+=p.vx*16+Math.sin(t*0.018+p.phase)*0.00012;
      if(p.y<0){p.y=1;p.x=Math.random();}
      if(p.x<0)p.x=1;else if(p.x>1)p.x=0;

      const a=Math.max(0.06,p.baseA+Math.sin(t*p.freq+p.phase)*0.22);

      if(p.r>1.1){
        x.shadowBlur=5;
        x.shadowColor=`rgba(${p.rgb[0]},${p.rgb[1]},${p.rgb[2]},${a*0.7})`;
      }else{
        x.shadowBlur=0;
      }

      x.fillStyle=`rgba(${p.rgb[0]},${p.rgb[1]},${p.rgb[2]},${a})`;
      x.beginPath();
      x.arc(p.x*w,p.y*h,p.r,0,Math.PI*2);
      x.fill();
    }
    requestAnimationFrame(f);
  })();
})();
