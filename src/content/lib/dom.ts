export function getLogin(): string | undefined {
  const loginElem = document.querySelector<HTMLElement>('.login');
  if (loginElem?.dataset.login) return loginElem.dataset.login;

  const mailtoElem = document.querySelector('a[href*="mailto"]');
  const login = mailtoElem?.textContent?.split('@');
  return login && login.length > 0 ? login[0] : undefined;
}

export function waitForLoginAndRun(
  callback: (login: string) => void,
  retry = 10
): void {
  const login = getLogin();
  if (login) {
    callback(login);
  } else if (retry > 0) {
    setTimeout(() => waitForLoginAndRun(callback, retry - 1), 300);
  } else {
    console.log('login not found');
  }
}
