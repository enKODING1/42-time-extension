import { Feature, PageContext } from './types';
import { fetchLocationStats } from './api/intra';
import { waitForLoginAndRun } from './lib/dom';
import { monthlyLogtime } from './features/monthly-logtime';
import { logtimeGraph } from './features/logtime-graph';

// 새 기능은 features/ 아래에 폴더를 만들고 이 배열에 등록한다.
const features: Feature[] = [monthlyLogtime, logtimeGraph];

function createContext(login: string): PageContext {
  let locationStats: Promise<Record<string, string> | null> | null = null;

  return {
    login,
    // 여러 기능이 호출해도 실제 요청은 한 번만 일어난다.
    getLocationStats: () => {
      if (!locationStats) {
        locationStats = fetchLocationStats(login);
      }
      return locationStats;
    },
  };
}

waitForLoginAndRun((login) => {
  const ctx = createContext(login);

  for (const feature of features) {
    if (!feature.shouldRun(ctx)) continue;

    feature.run(ctx).catch((error) => {
      console.error(`[${feature.id}]`, error);
    });
  }
});
