export function getLogin(): string | undefined {
  const loginElem = document.querySelector<HTMLElement>('.login');
  if (loginElem?.dataset.login) return loginElem.dataset.login;

  const mailtoElem = document.querySelector('a[href*="mailto"]');
  const login = mailtoElem?.textContent?.split('@');
  return login && login.length > 0 ? login[0] : undefined;
}

export function waitForLoginAndRun(
  callback: (login: string) => void,
  timeoutMs = 10_000
): void {
  const login = getLogin();
  if (login) {
    callback(login);
    return;
  }

  const observer = new MutationObserver(() => {
    const login = getLogin();
    if (!login) return;

    observer.disconnect();
    clearTimeout(timeoutId);
    callback(login);
  });

  // DOM 변화가 끝내 없을 때 observer가 영원히 남지 않도록 타임아웃으로 정리한다.
  const timeoutId = setTimeout(() => {
    observer.disconnect();
    console.log('login not found');
  }, timeoutMs);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-login', 'href'],
  });
}
