export function formatTime(hour: number, min: number): string {
  return `${hour.toString().padStart(2, '0')}h ${min.toString().padStart(2, '0')}m`;
}
