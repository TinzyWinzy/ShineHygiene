import type { LeadData } from '../types'
import { HYGIENE_MART_CATALOG } from '../types'

export function printQuoteAsPdf(data: LeadData): void {
  const win = window.open('', '_blank')
  if (!win) return

  const paramLines = formatParams(data)

  win.document.write(buildHtml(data, paramLines))
  win.document.close()

  setTimeout(() => {
    win.print()
    win.close()
  }, 500)
}

function formatParams(data: LeadData): string[] {
  switch (data.vertical) {
    case 'commercial':
    case 'office': {
      const p = data.params as { floorArea: number; frequency: string }
      return [`Floor Area: ${p.floorArea} sqm`, `Frequency: ${p.frequency}`]
    }
    case 'residential': {
      const p = data.params as { rooms: number; windowDeepClean: boolean }
      return [`Rooms: ${p.rooms}`, `Window Deep Clean: ${p.windowDeepClean ? 'Yes' : 'No'}`]
    }
    case 'car': {
      const p = data.params as { carSize: string }
      return [`Vehicle: ${p.carSize === 'suv_truck' ? 'SUV / 4x4 Truck' : 'Sedan'}`]
    }
    case 'hygienemart': {
      const p = data.params as { items: { itemId: string; quantity: number }[] }
      const lines = p.items.map(i => {
        const cat = HYGIENE_MART_CATALOG.find(c => c.id === i.itemId)
        const name = cat ? cat.name : i.itemId
        return `${name} × ${i.quantity}`
      })
      return lines.length ? lines : ['No items selected']
    }
  }
}

function buildHtml(data: LeadData, paramLines: string[]): string {
  const dateStr = new Date().toLocaleDateString()
  const breakdownRows = data.quote.breakdown.map(b => {
    const amt = b.amount < 0 ? `($${Math.abs(b.amount).toFixed(2)})` : `$${b.amount.toFixed(2)}`
    return `<tr><td>${escapeHtml(b.label)}</td><td class="amount">${amt}</td></tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Shine Hygiene Solutions — Quote</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;color:#1a1a2e;line-height:1.6;padding:40px}
.header{text-align:center;margin-bottom:40px;padding-bottom:20px;border-bottom:3px solid #0f7b6e}
.header h1{font-size:24px;color:#0f7b6e;letter-spacing:1px}
.header .sub{font-size:14px;color:#666}
.section{margin-bottom:24px}
.section h2{font-size:16px;color:#0f7b6e;margin-bottom:8px;text-transform:uppercase}
.row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
.total{font-size:18px;font-weight:700;border-top:2px solid #1a1a2e;padding-top:10px;margin-top:10px}
table{width:100%;border-collapse:collapse;margin:12px 0}
td,th{padding:8px 12px;text-align:left;border-bottom:1px solid #eee;font-size:14px}
th{font-weight:600;color:#555}
.amount{text-align:right}
hr{border:none;border-top:1px solid #eee;margin:16px 0}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #ccc;font-size:12px;color:#999;text-align:center}
@media print{body{padding:20mm 15mm}}
</style>
</head>
<body>
<div class="header">
<h1>SHINE HYGIENE SOLUTIONS</h1>
<p class="sub">Professional Cleaning Services — Harare, Zimbabwe</p>
</div>

<div class="section">
<h2>Customer Details</h2>
<div class="row"><span>Name:</span><span>${escapeHtml(data.name)}</span></div>
<div class="row"><span>Contact:</span><span>${escapeHtml(data.phone)}</span></div>
<div class="row"><span>Service:</span><span>${data.vertical}</span></div>
${data.preferredDate ? `<div class="row"><span>Preferred Date:</span><span>${escapeHtml(data.preferredDate)}</span></div>` : ''}
${data.preferredTime ? `<div class="row"><span>Preferred Time:</span><span>${escapeHtml(data.preferredTime)}</span></div>` : ''}
</div>

<hr>

<div class="section">
<h2>Job Parameters</h2>
${paramLines.map(l => `<div class="row"><span>${escapeHtml(l)}</span></div>`).join('')}
</div>

<hr>

<div class="section">
<h2>Quote Breakdown</h2>
<table>
<thead><tr><th>Item</th><th class="amount">Amount (USD)</th></tr></thead>
<tbody>
${breakdownRows}
</tbody>
</table>
<div class="row total"><span>Estimated Total</span><span>$${data.quote.total.toFixed(2)} USD</span></div>
</div>

<div class="footer">
<p>This quote is valid for 30 days from ${escapeHtml(dateStr)}.</p>
<p>Shine Hygiene Solutions | WHO Safety Compliant | Harare, Zimbabwe</p>
</div>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
