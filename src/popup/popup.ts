document.addEventListener('DOMContentLoaded', () => {
  // 42 Intra 링크
  const intraBtn = document.getElementById('intra-link');
  intraBtn?.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://intra.42.fr' });
  });

  // GitHub 링크
  const githubBtn = document.getElementById('github-link');
  githubBtn?.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/enkoding1/42-time-extension' });
  });
}); 