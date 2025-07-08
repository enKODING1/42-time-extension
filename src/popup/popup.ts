document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('intra-link');
  btn?.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://intra.42.fr' });
  });
}); 