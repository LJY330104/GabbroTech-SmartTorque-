const welcome=document.getElementById('welcome');
const scrollHint=document.getElementById('welcome-scroll');
if(welcome&&scrollHint&&document.documentElement.classList.contains('welcome-active')){
  let ready=false,touchY=null,wheelDistance=0,lastWheel=0;
  const active=()=>document.documentElement.classList.contains('welcome-active');
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const updateLabel=()=>{
    const zh=window.siteLanguage?.()==='zh';
    document.getElementById('welcome-scroll-label').textContent=zh?'向下滑动':'Scroll down to explore';
    scrollHint.setAttribute('aria-label',zh?'向下滑动，了解 Gabbrotech':'Scroll down to explore Gabbrotech');
  };
  function revealHint(){
    if(!active())return;
    ready=true;wheelDistance=0;
    document.documentElement.classList.add('welcome-ready');
    scrollHint.removeAttribute('aria-hidden');scrollHint.removeAttribute('aria-disabled');scrollHint.tabIndex=0;
  }
  function enterCompany(){
    if(!ready||!active()||document.documentElement.classList.contains('welcome-leaving'))return;
    document.documentElement.classList.add('welcome-leaving');
    setTimeout(()=>{
      document.documentElement.classList.remove('welcome-active','welcome-ready','welcome-leaving');
      history.replaceState(null,'','#about');
      const about=document.getElementById('about'),heading=about.querySelector('h2');
      about.querySelectorAll('.reveal').forEach(element=>element.classList.add('visible'));
      heading.tabIndex=-1;about.scrollIntoView({behavior:'instant',block:'start'});heading.focus({preventScroll:true});
    },reduced()?0:400);
  }
  updateLabel();window.addEventListener('site-language-change',updateLabel);
  // Wait for the actual end of both logo layers, including their CSS delay.
  // Already-finished animations resolve immediately; reduced motion has none.
  const logoAnimations=[...welcome.querySelectorAll('.welcome-logo img')].flatMap(layer=>layer.getAnimations());
  Promise.all(logoAnimations.map(animation=>animation.finished.catch(()=>{}))).then(revealHint);
  scrollHint.addEventListener('click',event=>{event.preventDefault();enterCompany();});
  window.addEventListener('wheel',event=>{
    if(!active()||event.ctrlKey)return;
    event.preventDefault();
    if(!ready){wheelDistance=0;return;}
    const now=performance.now();if(now-lastWheel>180)wheelDistance=0;lastWheel=now;
    const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
    wheelDistance=delta>0?wheelDistance+delta:0;
    if(wheelDistance>=32)enterCompany();
  },{passive:false});
  window.addEventListener('touchstart',event=>{touchY=active()&&event.touches.length===1?event.touches[0].clientY:null;},{passive:true});
  window.addEventListener('touchmove',event=>{
    if(!active()||touchY===null||event.touches.length!==1)return;
    event.preventDefault();
    if(!ready){touchY=event.touches[0].clientY;return;}
    if(touchY-event.touches[0].clientY>48){touchY=null;enterCompany();}
  },{passive:false});
  window.addEventListener('touchend',()=>{touchY=null;},{passive:true});
  window.addEventListener('touchcancel',()=>{touchY=null;},{passive:true});
  window.addEventListener('keydown',event=>{
    if(!active()||event.target.closest('button,input,textarea,select,[contenteditable]'))return;
    if(['ArrowDown','PageDown',' '].includes(event.key)){event.preventDefault();enterCompany();}
  });
}
