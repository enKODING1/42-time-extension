import { formatTime } from '../../lib/time';
import { Month, MonthStatsMap } from './types';

// 신버전 프로필(v3)의 테이블 달력에 월별 누적 시간 행을 추가한다.
export function updateV3Calendar(monthlyStats: MonthStatsMap): void {
  const tables = document.querySelectorAll('table.table-fixed');

  tables.forEach((table) => {
    const thead = table.querySelector('thead');
    if (!thead) return;

    const monthTr = thead.querySelector('tr');
    if (!monthTr) return;

    const monthThs = monthTr.querySelectorAll('th');
    if (thead.querySelector('tr[data-logtime]')) return;

    const timeTr = document.createElement('tr');
    timeTr.setAttribute('data-logtime', 'true');

    monthThs.forEach((th) => {
      const monthName = th.textContent?.trim().toLowerCase();
      const matchedMonth = Object.values(Month).find((m) => m === monthName);

      const td = document.createElement('td');
      td.colSpan = th.colSpan || 1;
      td.style.textAlign = 'center';

      if (matchedMonth && monthlyStats[matchedMonth]) {
        const { hour, min } = monthlyStats[matchedMonth]!;
        td.textContent = formatTime(hour, min);
        td.style.color = '#007B7C';
        td.style.fontWeight = 'bold';
      } else {
        td.textContent = '-';
      }

      timeTr.appendChild(td);
    });

    thead.appendChild(timeTr);
  });
}

// v3 프로필은 테이블이 늦게 렌더링되므로, 나타날 때까지 감시했다가 한 번 적용한다.
export function observeV3Calendar(monthlyStats: MonthStatsMap): void {
  const observer = new MutationObserver((_mutations, obs) => {
    const tables = document.querySelectorAll('table.table-fixed');
    let updated = false;

    tables.forEach((table) => {
      const thead = table.querySelector('thead');
      if (!thead) return;

      const monthTr = thead.querySelector('tr');
      if (!monthTr) return;

      const monthThs = monthTr.querySelectorAll('th');
      if (!thead.querySelector('tr[data-logtime]') && monthThs.length > 0) {
        updateV3Calendar(monthlyStats);
        updated = true;
      }
    });

    if (updated) {
      obs.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
