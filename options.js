document.addEventListener('DOMContentLoaded', async () => {
  const modeSel = document.getElementById('mode');
  const blEl = document.getElementById('blacklist');
  const wlEl = document.getElementById('whitelist');
  const blBadge = document.getElementById('blacklist-count');
  const wlBadge = document.getElementById('whitelist-count');
  const saveBtn = document.getElementById('save');

  function countLines(el) {
    if (!el) return 0;
    return el.value.split('\n').map(s => s.trim()).filter(Boolean).length;
  }

  function updateCounters() {
    if (blBadge) blBadge.textContent = countLines(blEl);
    if (wlBadge) wlBadge.textContent = countLines(wlEl);
  }

  // Load
  const {mode, blacklist = [], whitelist = []} = await chrome.storage.local.get(['mode','blacklist','whitelist']);
  if (modeSel) modeSel.value = mode || 'blacklist';
  if (blEl) blEl.value = blacklist.join('\n');
  if (wlEl) wlEl.value = whitelist.join('\n');
  updateCounters();

  // Live update
  blEl?.addEventListener('input', updateCounters);
  wlEl?.addEventListener('input', updateCounters);

  // Save
  saveBtn?.addEventListener('click', async () => {
    const newBl = blEl.value.split('\n').map(s=>s.trim()).filter(Boolean);
    const newWl = wlEl.value.split('\n').map(s=>s.trim()).filter(Boolean);
    await chrome.storage.local.set({
      mode: modeSel.value,
      blacklist: newBl,
      whitelist: newWl
    });
    updateCounters();
    saveBtn.textContent = 'Saved!';
    setTimeout(()=> saveBtn.textContent = 'Save', 1000);
  });
});