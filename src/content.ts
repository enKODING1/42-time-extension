// ============================================================
// Types & Enums
// ============================================================

enum Month {
  Jan = 'jan',
  Feb = 'feb',
  Mar = 'mar',
  Apr = 'apr',
  May = 'may',
  Jun = 'jun',
  Jul = 'jul',
  Aug = 'aug',
  Sep = 'sep',
  Oct = 'oct',
  Nov = 'nov',
  Dec = 'dec',
}

type MonthStats = {
  hour: number;
  min: number;
};

type MonthStatsMap = {
  [key in Month]?: MonthStats;
};

// ============================================================
// API
// ============================================================

async function fetchLocationStats(
  login: string
): Promise<Record<string, string> | null> {
  try {
    const response = await fetch(
      `https://translate.intra.42.fr/users/${login}/locations_stats.json`,
      {
        credentials: 'include',
      }
    );
    if (!response.ok) throw new Error('네트워크 오류');
    return await response.json();
  } catch (error) {
    console.error('요청 실패:', error);
    return null;
  }
}

// ============================================================
// Utility Helpers
// ============================================================

function getMonthKey(month: string): Month {
  const monthEnums = [
    '',
    Month.Jan,
    Month.Feb,
    Month.Mar,
    Month.Apr,
    Month.May,
    Month.Jun,
    Month.Jul,
    Month.Aug,
    Month.Sep,
    Month.Oct,
    Month.Nov,
    Month.Dec,
  ];
  return monthEnums[Number(month)] as Month;
}

function getMonthlyAccumulatedTime(
  stats: Record<string, string>
): MonthStatsMap {
  const result: MonthStatsMap = {};

  for (const dateStr in stats) {
    const [, month] = dateStr.split('-');
    const monthKey = getMonthKey(month);
    const timeStr = stats[dateStr].split('.')[0];
    const [h, m] = timeStr.split(':').map(Number);

    if (!result[monthKey]) {
      result[monthKey] = { hour: 0, min: 0 };
    }
    result[monthKey]!.hour += h;
    result[monthKey]!.min += m;
  }

  for (const value of Object.values(result)) {
    if (value) {
      const totalMin = value.min;
      value.hour += Math.floor(totalMin / 60);
      value.min = totalMin % 60;
    }
  }

  return result;
}

function formatTime(hour: number, min: number): string {
  return `${hour.toString().padStart(2, '0')}h ${min.toString().padStart(2, '0')}m`;
}

// ============================================================
// DOM Helpers
// ============================================================

function getLogin(): string | undefined {
  const loginElem = document.querySelector<HTMLElement>('.login');
  if (loginElem?.dataset.login) return loginElem.dataset.login;

  const mailtoElem = document.querySelector('a[href*="mailto"]');
  const login = mailtoElem?.textContent?.split('@');
  return login && login.length > 0 ? login[0] : undefined;
}

function waitForLoginAndRun(
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

// ============================================================
// UI Renderers — SVG Calendar (v2)
// ============================================================

function updateSvgCalendar(svg: Element, monthlyStats: MonthStatsMap): void {
  const textNodes = svg.querySelectorAll('text');
  const siblingTexts = Array.from(textNodes);

  textNodes.forEach((node) => {
    const month = node.textContent?.trim().toLowerCase() as Month | undefined;
    if (!month || !monthlyStats[month]) return;

    const { hour, min } = monthlyStats[month]!;
    const x = node.getAttribute('x');
    const y = node.getAttribute('y');
    const newY = (parseInt(y!) + 12).toString();

    const alreadyExists = siblingTexts.some(
      (el) =>
        el !== node &&
        el.getAttribute('x') === x &&
        el.getAttribute('y') === newY &&
        el.textContent?.match(/\d+h \d+m/)
    );
    if (alreadyExists) return;

    const newText = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );
    newText.setAttribute('x', x!);
    newText.setAttribute('y', newY);
    newText.setAttribute('fill', '#007B7C');
    newText.setAttribute('font-size', '10');
    newText.setAttribute('font-family', 'sans-serif');
    newText.textContent = formatTime(hour, min);

    if (node.nextSibling) {
      node.parentNode!.insertBefore(newText, node.nextSibling);
    } else {
      node.parentNode!.appendChild(newText);
    }
  });
}

// ============================================================
// UI Renderers — Table Calendar (v3)
// ============================================================

function updateV3Calendar(monthlyStats: MonthStatsMap): void {
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

function observeV3Calendar(monthlyStats: MonthStatsMap): void {
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

// ============================================================
// Main
// ============================================================

waitForLoginAndRun((login) => {
  fetchLocationStats(login).then((locationStats) => {
    if (!locationStats) return;

    const monthlyStats = getMonthlyAccumulatedTime(locationStats);

    const svg = document.getElementById('user-locations');
    if (svg) {
      updateSvgCalendar(svg, monthlyStats);
    }

    updateV3Calendar(monthlyStats);
    observeV3Calendar(monthlyStats);
  });
});
