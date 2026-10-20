chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(['mode', 'blacklist', 'whitelist']);
  if (!data.mode) {
    await chrome.storage.local.set({
      mode: 'blacklist',
      blacklist: [],
      whitelist: []
    });
  }
});

// Let popup/content ask "should I run on this host?"
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'SHOULD_RUN') {
    chrome.storage.local.get(['mode', 'blacklist', 'whitelist']).then(({mode, blacklist, whitelist}) => {
      const host = msg.host;
      let enabled = true;
      if (mode === 'blacklist') {
        enabled = !blacklist?.some(d => host.includes(d));
      } else {
        enabled = whitelist?.some(d => host.includes(d));
      }
      sendResponse({enabled, mode});
    });
    return true; // async
  }
});