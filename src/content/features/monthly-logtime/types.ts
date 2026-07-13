export enum Month {
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

export type MonthStats = {
  hour: number;
  min: number;
};

export type MonthStatsMap = {
  [key in Month]?: MonthStats;
};
