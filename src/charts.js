// Small hand-built SVG charts. One accent for results, one neutral for "before",
// direct labels on every mark, a hidden table for screen readers, hover tooltips.

const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]))

function srTable(rows, head) {
  return `<table class="sr-only"><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
    .join('')}</tbody></table>`
}

// Horizontal bars. Labels above each bar, value at the end of the bar.
function bars(ch) {
  const W = 520, rowH = 64, top = 8, left = 0, right = 70
  const H = top + ch.bars.length * rowH + 24
  const x = (v) => left + (v / ch.max) * (W - left - right)
  const rows = ch.bars.map((b, i) => {
    const y = top + i * rowH
    const w = Math.max(x(b.value) - left, 6)
    return `
      <g class="bar-row" data-tip="${esc(b.label)}: ${esc(b.display)}">
        <text class="lbl" x="${left}" y="${y + 14}">${esc(b.label)}</text>
        <rect class="hit" x="${left}" y="${y + 20}" width="${W - left}" height="34" fill="transparent"/>
        <path class="bar ${b.highlight ? 'hi' : 'base'}" d="M${left} ${y + 24} h${w - 4} a4 4 0 0 1 4 4 v18 a4 4 0 0 1 -4 4 h-${w - 4} z" style="--w:${w}"/>
        <text class="val" x="${left + w + 10}" y="${y + 43}">${esc(b.display)}</text>
      </g>`
  })
  const be = ch.breakEven ? `
      <line class="ref" x1="${x(ch.breakEven)}" x2="${x(ch.breakEven)}" y1="${top + 18}" y2="${H - 18}"/>
      <text class="ref-lbl" x="${x(ch.breakEven) + 6}" y="${H - 4}">break-even ${ch.breakEven}${ch.unit}</text>` : ''
  return `<svg viewBox="0 0 ${W} ${H}" class="chart chart-bars" role="img" aria-label="${esc(ch.title)}">${be}${rows.join('')}</svg>
    ${srTable(ch.bars.map((b) => [b.label, b.display]), ['Level', 'Return on ad spend'])}`
}

// Two-point position chart: start rank to current rank, lower is better.
function rank(ch) {
  const W = 520, H = 300, padL = 44, padR = 90, padT = 26, padB = 40
  const y = (v) => padT + ((v - 1) / (ch.worst - 1)) * (H - padT - padB)
  const x1 = padL + 20, x2 = W - padR
  const grid = [1, 3, 6, 9, 12].filter((v) => v <= ch.worst).map((v) => `
      <line class="grid" x1="${padL}" x2="${W - padR + 30}" y1="${y(v)}" y2="${y(v)}"/>
      <text class="axis" x="${padL - 12}" y="${y(v) + 4}" text-anchor="end">#${v}</text>`).join('')
  return `<svg viewBox="0 0 ${W} ${H}" class="chart chart-rank" role="img" aria-label="${esc(ch.title)}">
      ${grid}
      <path class="slope" d="M${x1} ${y(ch.from.value)} C ${x1 + 160} ${y(ch.from.value)}, ${x2 - 160} ${y(ch.to.value)}, ${x2} ${y(ch.to.value)}"/>
      <g data-tip="${esc(ch.from.label)}: #${ch.from.value}"><circle class="hit" cx="${x1}" cy="${y(ch.from.value)}" r="18" fill="transparent"/><circle class="dot base" cx="${x1}" cy="${y(ch.from.value)}" r="6"/></g>
      <g data-tip="${esc(ch.to.label)}: #${ch.to.value}"><circle class="hit" cx="${x2}" cy="${y(ch.to.value)}" r="18" fill="transparent"/><circle class="dot hi" cx="${x2}" cy="${y(ch.to.value)}" r="7"/></g>
      <text class="val" x="${x1}" y="${y(ch.from.value) + 26}" text-anchor="middle">${esc(ch.from.label)} #${ch.from.value}</text>
      <text class="val strong" x="${x2 + 14}" y="${y(ch.to.value) + 5}">${esc(ch.to.label)} #${ch.to.value}</text>
    </svg>
    ${srTable([[ch.from.label, '#' + ch.from.value], [ch.to.label, '#' + ch.to.value]], ['Point', 'Google position'])}`
}

function tiles(ch) {
  return `<div class="tiles">${ch.tiles.map((t) => `
      <div class="tile"><strong data-count="${t.value}" data-suffix="${esc(t.suffix || '')}">${t.value.toLocaleString('en-US')}${esc(t.suffix || '')}</strong><span>${esc(t.label)}</span></div>`).join('')}</div>`
}

export function renderChart(ch) {
  const body = ch.type === 'bars' ? bars(ch) : ch.type === 'rank' ? rank(ch) : tiles(ch)
  return `<figure class="chart-card">
      <figcaption><span class="chart-title">${esc(ch.title)}</span></figcaption>
      ${body}
      ${ch.note ? `<p class="chart-note">${esc(ch.note)}</p>` : ''}
    </figure>`
}

// Illustrative funnel for the method section: where revenue leaks.
export function funnelSvg() {
  const stages = ['Ad seen', 'Click', 'Lead', 'Booked call', 'Customer']
  const W = 520, rowH = 54
  const widths = [1, 0.74, 0.5, 0.2, 0.13]
  const rows = stages.map((s, i) => {
    const w = widths[i] * (W - 120)
    const y = i * rowH
    const leak = i === 3
    return `<g data-tip="${leak ? 'Most businesses lose the most here: leads that never get a fast follow-up' : esc(s)}">
        <rect class="hit" x="0" y="${y}" width="${W}" height="${rowH - 6}" fill="transparent"/>
        <rect class="f-bar ${leak ? 'leak' : ''}" x="${(W - 120 - w) / 2}" y="${y + 6}" width="${w}" height="${rowH - 18}" rx="4" style="--w:${w}"/>
        <text class="lbl" x="${W - 108}" y="${y + 31}">${esc(s)}</text>
        ${leak ? `<text class="leak-lbl" x="${(W - 120 + w) / 2 + 12}" y="${y + 31}">the leak</text>` : ''}
      </g>`
  })
  return `<figure class="chart-card funnel">
      <figcaption><span class="chart-title">Where revenue usually leaks</span><span class="chart-tag">Illustration</span></figcaption>
      <svg viewBox="0 0 ${W} ${stages.length * rowH}" class="chart" role="img" aria-label="Funnel from ad seen to customer, with the drop between lead and booked call marked as the leak">${rows.join('')}</svg>
    </figure>`
}
