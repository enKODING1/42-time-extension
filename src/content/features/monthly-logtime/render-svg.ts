import { formatTime } from '../../lib/time';
import { Month, MonthStatsMap } from './types';

// 구버전 프로필(v2)의 SVG 달력에 월별 누적 시간을 표시한다.
export function updateSvgCalendar(
  svg: Element,
  monthlyStats: MonthStatsMap
): void {
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
