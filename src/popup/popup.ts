// Firefox와 Chrome 호환성을 위한 popup script
(() => {
  const extensionApi = (globalThis as any).browser || chrome;

  document.addEventListener('DOMContentLoaded', () => {
    // 다국어 텍스트 설정
    function setLocalizedText() {
      const appName = document.getElementById('app-name');
      const appSubtitle = document.getElementById('app-subtitle');
      const goToProfile = document.getElementById('go-to-profile');
      const infoText = document.getElementById('info-text');
      const issuesFeedback = document.getElementById('issues-feedback');

      if (appName) appName.textContent = extensionApi.i18n.getMessage('appName');
      if (appSubtitle) appSubtitle.textContent = extensionApi.i18n.getMessage('appSubtitle');
      if (goToProfile) goToProfile.textContent = extensionApi.i18n.getMessage('goToProfile');
      if (infoText) infoText.textContent = extensionApi.i18n.getMessage('infoText');
      if (issuesFeedback) issuesFeedback.textContent = extensionApi.i18n.getMessage('issuesFeedback');
    }

    // 언어 설정 적용
    setLocalizedText();

    // 42 Intra 링크
    const intraBtn = document.getElementById('intra-link');
    intraBtn?.addEventListener('click', () => {
      extensionApi.tabs.create({ url: 'https://intra.42.fr' });
    });

    // GitHub 링크
    const githubBtn = document.getElementById('github-link');
    githubBtn?.addEventListener('click', () => {
      extensionApi.tabs.create({ url: 'https://github.com/enkoding1/42-time-extension' });
    });
  });
})(); 