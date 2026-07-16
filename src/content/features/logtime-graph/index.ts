import { Feature } from '../../types';
import { getMonthlySeries, MonthlyPoint } from './aggregate';
import { renderGraph } from './render-graph';

const BUTTON_ATTR = 'data-logtime-graph-button';
const GRAPH_ATTR = 'data-logtime-graph';

// v3 프로필의 Logtime 섹션. 제목 텍스트 외에는 구분할 표식이 없다.
function findLogtimeSection(): {
  headerRow: HTMLElement;
  body: HTMLElement;
} | null {
  const titles = document.querySelectorAll<HTMLElement>(
    'div.font-bold.uppercase'
  );

  for (const title of Array.from(titles)) {
    if (title.textContent?.trim().toLowerCase() !== 'logtime') continue;

    const headerRow = title.parentElement;
    const body = headerRow?.nextElementSibling;
    if (headerRow && body instanceof HTMLElement) {
      return { headerRow, body };
    }
  }
  return null;
}

// 버튼과 그래프를 섹션에 넣는다. 섹션이 아직 렌더링 전이면 false를 반환한다.
function insertGraphToggle(series: MonthlyPoint[]): boolean {
  const section = findLogtimeSection();
  if (!section) return false;
  if (section.headerRow.querySelector(`[${BUTTON_ATTR}]`)) return true;

  const graph = document.createElement('div');
  graph.setAttribute(GRAPH_ATTR, 'true');
  graph.style.display = 'none';
  graph.style.overflowX = 'auto';
  graph.appendChild(renderGraph(series));
  section.body.insertAdjacentElement('afterend', graph);

  const button = document.createElement('button');
  button.setAttribute(BUTTON_ATTR, 'true');
  button.textContent = '그래프';
  Object.assign(button.style, {
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#007B7C',
    background: 'white',
    border: '1px solid #00BABC',
    borderRadius: '6px',
    cursor: 'pointer',
  });

  button.addEventListener('click', () => {
    const showGraph = graph.style.display === 'none';
    graph.style.display = showGraph ? 'block' : 'none';
    section.body.style.display = showGraph ? 'none' : '';
    button.textContent = showGraph ? '달력' : '그래프';
  });

  section.headerRow.appendChild(button);
  return true;
}

export const logtimeGraph: Feature = {
  id: 'logtime-graph',
  shouldRun: () => true,
  run: async (ctx) => {
    const stats = await ctx.getLocationStats();
    if (!stats) return;

    const series = getMonthlySeries(stats);
    if (series.length === 0) return;

    if (insertGraphToggle(series)) return;

    // v3 섹션은 늦게 렌더링되므로 나타날 때까지 감시한다. (render-table.ts와 같은 패턴)
    const observer = new MutationObserver((_mutations, obs) => {
      if (insertGraphToggle(series)) {
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
};
