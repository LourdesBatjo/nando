/* music: mp3 jika ada, jika tidak pakai ambient sintetis */
const music=(()=>{
  let audio=null,ctx=null,master=null,timer=null,playing=false,vol=.6,useSynth=!CONFIG.music;
  const ui=$("#music"),pp=$("#pp"),stat=$("#mstat");
  const set=p=>{playing=p;ui.classList.toggle("on",p);pp.textContent=p?"❚❚":"▶";pp.setAttribute("aria-label",p?"Jeda musik":"Putar musik")};
  const chords=[[220,261.6,329.6],[174.6,220,261.6],[261.6,329.6,392],[196,246.9,293.7]];
  let step=0;
  function pad_(){const t=ctx.currentTime,ch=chords[step++%4];
    ch.forEach(f=>[f,f*2.003].forEach((ff,k)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=k?"sine":"triangle";o.frequency.value=ff;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(k?.025:.05,t+2.5);g.gain.linearRampToValueAtTime(0,t+7.5);
      o.connect(g).connect(master);o.start(t);o.stop(t+7.6)}))}
  function startSynth(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw 0;
    if(!ctx){ctx=new AC();master=ctx.createGain();master.gain.value=vol*.8;master.connect(ctx.destination)}
    ctx.resume();if(!timer){pad_();timer=setInterval(pad_,6000)}stat.textContent="Ambient bawaan"}
  async function play(){try{
      if(useSynth)startSynth();
      else{if(!audio){audio=new Audio(CONFIG.music);audio.loop=true;audio.onerror=()=>{useSynth=true;audio=null;try{startSynth();set(true)}catch(e){stat.textContent="Audio tidak didukung"}}}
        audio.volume=vol;await audio.play()}
      set(true)}catch(e){stat.textContent="Musik tidak dapat diputar";set(false)}}
  function pause(){if(audio)audio.pause();if(ctx)ctx.suspend();set(false)}
  pp.onclick=()=>playing?pause():play();
  $("#vol").oninput=e=>{vol=+e.target.value;if(audio)audio.volume=vol;if(master)master.gain.value=vol*.8};
  return{play,get playing(){return playing}};
})();
