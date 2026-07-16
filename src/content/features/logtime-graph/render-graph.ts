import { formatTime } from '../../lib/time';
import { MonthlyPoint } from './aggregate';

const LINE_COLOR = '#00BABC';
const TEXT_COLOR = '#007B7C';
const GRID_COLOR = '#E2E8F0';
const LABEL_COLOR = '#64748B';

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl<K extends keyof SVGElementTagNameMap>(
  name: K,
  attrs: Record<string, string> = {}
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

// 눈금이 깔끔한 값으로 떨어지도록 시간 단위를 올림한다.
function getTickUnit(maxHour: number, tickCount: number): number {
  const rawStep = maxHour / tickCount;
  const units = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500];
  return units.find((unit) => unit >= rawStep) ?? Math.ceil(rawStep);
}

export function renderGraph(series: MonthlyPoint[]): SVGSVGElement {
  const padLeft = 48;
  const padRight = 28;
  const padTop = 28;
  const padBottom = 34;
  const stepX = 72;
  const chartHeight = 210;

  const tickCount = 4;
  const maxMin = Math.max(...series.map((point) => point.totalMin));
  const tickUnit = getTickUnit(maxMin / 60, tickCount);
  const maxHour = tickUnit * tickCount;

  const width = padLeft + padRight + stepX * Math.max(series.length - 1, 1);
  const height = padTop + chartHeight + padBottom;

  const toX = (index: number) => padLeft + index * stepX;
  const toY = (totalMin: number) =>
    padTop + chartHeight * (1 - totalMin / 60 / maxHour);

  const svg = svgEl('svg', {
    viewBox: `0 0 ${width} ${height}`,
    width: String(width),
    height: String(height),
    'font-family': 'sans-serif',
  });

  for (let tick = 0; tick <= tickCount; tick++) {
    const y = padTop + chartHeight * (1 - tick / tickCount);

    svg.appendChild(
      svgEl('line', {
        x1: String(padLeft - 6),
        x2: String(width - padRight + 6),
        y1: String(y),
        y2: String(y),
        stroke: GRID_COLOR,
        'stroke-width': '1',
      })
    );

    const tickLabel = svgEl('text', {
      x: String(padLeft - 10),
      y: String(y + 3),
      'text-anchor': 'end',
      'font-size': '10',
      fill: LABEL_COLOR,
    });
    tickLabel.textContent = `${tickUnit * tick}h`;
    svg.appendChild(tickLabel);
  }

  svg.appendChild(
    svgEl('polyline', {
      points: series
        .map((point, i) => `${toX(i)},${toY(point.totalMin)}`)
        .join(' '),
      fill: 'none',
      stroke: LINE_COLOR,
      'stroke-width': '2',
    })
  );

  series.forEach((point, i) => {
    const cx = toX(i);
    const cy = toY(point.totalMin);
    const hour = Math.floor(point.totalMin / 60);
    const min = point.totalMin % 60;

    const circle = svgEl('circle', {
      cx: String(cx),
      cy: String(cy),
      r: '3.5',
      fill: LINE_COLOR,
    });
    const title = svgEl('title');
    title.textContent = `${point.label}: ${formatTime(hour, min)}`;
    circle.appendChild(title);
    svg.appendChild(circle);

    const value = svgEl('text', {
      x: String(cx),
      y: String(cy - 10),
      'text-anchor': 'middle',
      'font-size': '10',
      'font-weight': 'bold',
      fill: TEXT_COLOR,
    });
    value.textContent = `${hour}h`;
    svg.appendChild(value);

    const monthLabel = svgEl('text', {
      x: String(cx),
      y: String(padTop + chartHeight + 20),
      'text-anchor': 'middle',
      'font-size': '10',
      fill: LABEL_COLOR,
    });
    monthLabel.textContent = point.label;
    svg.appendChild(monthLabel);
  });

  return svg;
}
