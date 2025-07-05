async function fetchLocationStats(login: string) {
  try {
    const response = await fetch(`https://translate.intra.42.fr/users/${login}/locations_stats.json`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('네트워크 오류');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('요청 실패:', error);
    return null;
  }
}

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
  Dec = 'dec'
}

type MonthStats = {
  hour: number;
  min: number;
};

type MonthStatsMap = {
  [key in Month]?: MonthStats;
};

function getMonthlyAccumulatedTime(stats: Record<string, string>): MonthStatsMap {
  const result: MonthStatsMap = {};
  for (const dateStr in stats) {
    const [year, month] = dateStr.split('-');
    const monthKey = getMonthKey(month);
    const timeStr = stats[dateStr].split('.')[0];
    const [h, m, s] = timeStr.split(':').map(Number);
    if (!result[monthKey]) {
      result[monthKey] = { hour: 0, min: 0 };
    }
    result[monthKey]!.hour += h;
    result[monthKey]!.min += m;
  }
  for (const [key, value] of Object.entries(result)) {
    if (value) {
      const totalMin = value.min;
      value.hour += Math.floor(totalMin / 60);
      value.min = totalMin % 60;
    }
  }
  return result;
}

function getMonthKey(month: string): Month {
  const monthEnums = [
    '', Month.Jan, Month.Feb, Month.Mar, Month.Apr, Month.May, Month.Jun,
    Month.Jul, Month.Aug, Month.Sep, Month.Oct, Month.Nov, Month.Dec
  ];
  return monthEnums[Number(month)] as Month;
}

(async () => {
  const loginElem = document.querySelector<HTMLElement>('.login');
  const login = loginElem?.dataset.login;
  if (!login) return;
  const locationStats = await fetchLocationStats(login);
  if (locationStats) {
    const monthlyStats = getMonthlyAccumulatedTime(locationStats);
    console.log(monthlyStats);
    const svg = document.getElementById('user-locations');
    if (svg) {
      const textNodes = svg.querySelectorAll('text');
      textNodes.forEach((node) => {
        const month = node.textContent?.trim().toLowerCase();
        if (month && monthlyStats[month as Month]) {
          const { hour, min } = monthlyStats[month as Month]!;
          const x = node.getAttribute('x');
          const y = node.getAttribute('y');
          const siblingTexts = Array.from(svg.querySelectorAll('text'));
          const alreadyExists = siblingTexts.some(
            el => el !== node &&
              el.getAttribute('x') === x &&
              el.getAttribute('y') === (parseInt(y!) + 12).toString() &&
              el.textContent?.match(/\d+h \d+m/)
          );
          if (!alreadyExists) {
            const newText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            newText.setAttribute('x', x!);
            newText.setAttribute('y', (parseInt(y!) + 12).toString());
            newText.setAttribute('fill', '#007B7C');
            newText.setAttribute('font-size', '10');
            newText.setAttribute('font-family', 'sans-serif');
            newText.textContent = `${hour.toString().padStart(2, '0')}h ${min.toString().padStart(2, '0')}m`;
            if (node.nextSibling) {
              node.parentNode!.insertBefore(newText, node.nextSibling);
            } else {
              node.parentNode!.appendChild(newText);
            }
          }
        }
      });
    }
  }
})();
