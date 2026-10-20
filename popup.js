document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
  const host = new URL(tab.url).hostname;
  document.getElementById('current-site').textContent = host;

  const {mode, blacklist=[], whitelist=[]} = await chrome.storage.local.get(['mode','blacklist','whitelist']);
  let isEnabled = mode === 'blacklist' ? !blacklist.some(d=>host.includes(d)) : whitelist.some(d=>host.includes(d));
  
  const btn = document.getElementById('toggle-site');
  btn.textContent = isEnabled ? `Disable Dark on ${host}` : `Enable Dark on ${host}`;

  btn.addEventListener('click', async () => {
    const data = await chrome.storage.local.get(['mode','blacklist','whitelist']);
    let bl = data.blacklist || [], wl = data.whitelist || [];
    if (data.mode === 'blacklist') {
      if (isEnabled) bl.push(host); else bl = bl.filter(d=>!host.includes(d) && d!==host);
      await chrome.storage.local.set({blacklist: bl});
    } else {
      if (isEnabled) wl = wl.filter(d=>!host.includes(d) && d!==host); else wl.push(host);
      await chrome.storage.local.set({whitelist: wl});
    }
    chrome.tabs.reload(tab.id);
    window.close();
  });
});