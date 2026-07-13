import { Feature } from '../../types';
import { getMonthlyAccumulatedTime } from './aggregate';
import { updateSvgCalendar } from './render-svg';
import { updateV3Calendar, observeV3Calendar } from './render-table';

export const monthlyLogtime: Feature = {
  id: 'monthly-logtime',
  shouldRun: () => true,
  run: async (ctx) => {
    const locationStats = await ctx.getLocationStats();
    if (!locationStats) return;

    const monthlyStats = getMonthlyAccumulatedTime(locationStats);

    const svg = document.getElementById('user-locations');
    if (svg) {
      updateSvgCalendar(svg, monthlyStats);
    }

    updateV3Calendar(monthlyStats);
    observeV3Calendar(monthlyStats);
  },
};
