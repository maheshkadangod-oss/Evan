// "Matrix" decode: each letter flickers through random characters in orange, then settles,
// roughly left to right. Word widths are locked while it runs so lines never reflow.

const GLYPHS = '01ABCDEFGHJKLMNPQRSTUVWXYZ$%#&*+=<>/\\|'
const rand = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]

// targets: elements whose text should decode. Each keeps its own final text.
export function prepare(targets) {
  return [...targets].map((el) => ({ el, text: el.textContent }))
}

export function decode(items, { duration = 1.1, spread = 0.75 } = {}) {
  const total = items.reduce((n, it) => n + it.text.length, 0)
  let offset = 0
  const jobs = items.map((it) => {
    const r = it.el.getBoundingClientRect()
    it.el.style.display = 'inline-block'
    it.el.style.width = r.width + 'px'
    it.el.style.whiteSpace = 'nowrap'
    // each letter resolves at its own moment, in reading order with a little jitter
    const at = [...it.text].map((ch, i) => (ch === ' ' ? 0 : ((offset + i) / Math.max(total, 1)) * spread + Math.random() * (1 - spread)))
    offset += it.text.length
    return { ...it, at }
  })
  const start = performance.now()
  let lastSwap = 0
  return new Promise((resolve) => {
    function tick(now) {
      const p = (now - start) / 1000 / duration
      const swap = now - lastSwap > 45 // change the noise ~20 times a second, not every frame
      if (swap) lastSwap = now
      for (const j of jobs) {
        if (!swap && p < 1) continue
        let html = ''
        for (let i = 0; i < j.text.length; i++) {
          const ch = j.text[i]
          html += p >= j.at[i] || ch === ' ' ? esc(ch) : `<i class="gl">${esc(rand())}</i>`
        }
        j.el.innerHTML = html
      }
      if (p < 1) requestAnimationFrame(tick)
      else {
        for (const j of jobs) { j.el.textContent = j.text; j.el.style.width = ''; j.el.style.display = ''; j.el.style.whiteSpace = '' }
        resolve()
      }
    }
    requestAnimationFrame(tick)
  })
}

const esc = (c) => (c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c)
