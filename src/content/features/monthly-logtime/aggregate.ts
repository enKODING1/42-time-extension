import { Month, MonthStatsMap } from './types';

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

export function getMonthlyAccumulatedTime(
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
