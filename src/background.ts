// Firefox와 Chrome 호환성을 위한 background script
(() => {
  const extensionApi = (globalThis as any).browser || chrome;

  extensionApi.runtime.onInstalled.addListener(() => {
    console.log('익스텐션이 설치되었습니다!');
  });
})();