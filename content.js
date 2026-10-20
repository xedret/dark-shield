(async function() {
  if (window !== window.top) return;

  const host = location.hostname;

  // 1. Ask background if we should run
  const {enabled} = await new Promise(resolve => {
    chrome.runtime.sendMessage({type: 'SHOULD_RUN', host}, res => resolve(res || {enabled:true}));
  });
  if (!enabled) {
    console.log('Dark Shield: disabled for', host);
    return; // <-- This fixes WhatsApp + Toggle button
  }

  const docEl = document.documentElement;
  function tagBody() {
    if (!document.body) return false;
    if (host.includes('amazon.')) {
      docEl.setAttribute('data-extension-dark','amazon');
      document.body.setAttribute('data-extension-dark','amazon');
    } else if (host.includes('superuser.com') || host.includes('stackoverflow.com') || host.includes('stackexchange.com')) {
      docEl.setAttribute('data-extension-dark','stack');
      document.body.setAttribute('data-extension-dark','stack');
    }
    return true;
  }

  async function injectCss() {
    try {
      const url = chrome.runtime.getURL('dark.css');
      const css = await (await fetch(url)).text();
      const style = document.createElement('style');
      style.id = 'dark-shield-style';
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    } catch(e) { console.warn(e); }
  }

  function fixContrast() {
    if (!document.body) return;
    document.querySelectorAll('div,section,article,p,span,a').forEach(el=>{
      const s = getComputedStyle(el);
      const bgM = s.backgroundColor.match(/rgb\((\d+), (\d+), (\d+)/);
      const fgM = s.color.match(/rgb\((\d+), (\d+), (\d+)/);
      if(!bgM||!fgM) return;
      const bgL = (parseInt(bgM[1])+parseInt(bgM[2])+parseInt(bgM[3]))/3;
      const fgL = (parseInt(fgM[1])+parseInt(fgM[2])+parseInt(fgM[3]))/3;
      if(bgL>200 && fgL>150){
        el.style.setProperty('background-color','#181818','important');
        el.style.setProperty('color','#e0e0e0','important');
        el.style.setProperty('-webkit-text-fill-color','#e0e0e0','important');
      }
      if(bgL<50 && fgL<80){
        el.style.setProperty('color','#cccccc','important');
        el.style.setProperty('-webkit-text-fill-color','#cccccc','important');
      }
    });
  }

  function init() {
    if (!tagBody()) { setTimeout(init, 100); return; }
    injectCss();
    setTimeout(fixContrast, 600);
    const obs = new MutationObserver(fixContrast);
    if(document.body) obs.observe(document.body,{childList:true,subtree:true});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();