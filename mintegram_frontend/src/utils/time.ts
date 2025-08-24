export function mmss(totalSec: number): string {
  const s = Math.max(0, totalSec | 0)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}
