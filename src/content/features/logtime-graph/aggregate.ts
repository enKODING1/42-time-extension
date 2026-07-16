export type MonthlyPoint = {
  key: string; // 'YYYY-MM'
  label: string;
  totalMin: number;
};

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// locations_stats의 일별 기록을 연-월 단위로 합쳐 시간순 시계열로 만든다.
// (monthly-logtime의 aggregate는 연도를 무시하므로 그래프에는 쓸 수 없다)
export function getMonthlySeries(
  stats: Record<string, string>
): MonthlyPoint[] {
  const minutesByMonth = new Map<string, number>();

  for (const dateStr in stats) {
    const [year, month] = dateStr.split('-');
    if (!year || !month) continue;

    const [h, m] = stats[dateStr].split('.')[0].split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) continue;

    const key = `${year}-${month}`;
    minutesByMonth.set(key, (minutesByMonth.get(key) ?? 0) + h * 60 + m);
  }

  const keys = Array.from(minutesByMonth.keys()).sort();
  const years = new Set(keys.map((key) => key.slice(0, 4)));

  return keys.map((key) => {
    const [year, month] = key.split('-');
    const name = MONTH_LABELS[Number(month) - 1] ?? month;

    return {
      key,
      label: years.size > 1 ? `${name} ${year.slice(2)}` : name,
      totalMin: minutesByMonth.get(key)!,
    };
  });
}
