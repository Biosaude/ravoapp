export function calculateLevel(xp: number) {
  const safe = Math.max(0, xp)
  const thresholds = [0, 1000, 2500, 5000, 8000]
  let level = 1
  thresholds.forEach((value, index) => { if (safe >= value) level = index + 1 })
  const floor = thresholds[level - 1]
  const ceiling = thresholds[level] ?? floor + 2000
  return { level, title: level >= 5 ? 'Guardião' : level >= 3 ? 'Cartógrafo' : 'Explorador', current: safe - floor, needed: ceiling - floor, total: safe }
}
