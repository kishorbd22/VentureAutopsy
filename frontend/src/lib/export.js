import jsPDF from "jspdf"

/**
 * Format analysis data for export
 */
function formatAnalysisData(analysisData, startupName) {
  return {
    reportGenerated: new Date().toISOString(),
    startupName: startupName || "Unnamed Analysis",
    score: analysisData.score || 0,
    riskLevel: analysisData.risk_level || "N/A",
    explanations: analysisData.explanations || [],
    riskFactors: (analysisData.risk_factors || []).map((f) => ({
      factor: f.factor,
      weight: f.weight,
      severity: f.severity,
      description: f.description,
    })),
    insights: analysisData.insights || [],
    recommendations: analysisData.recommendations || [],
    similarStartups: (analysisData.similar_startups || []).map((s) => ({
      name: s.name,
      industry: s.industry,
      deathCause: s.death_cause,
      lifespanDays: s.lifespan_days,
      totalFundingUsd: s.total_funding_usd,
      similarityScore: s.similarity_score,
    })),
  }
}

// ─── JSON Export ────────────────────────────────────────────────

export function exportAsJSON(analysisData, startupName) {
  const data = formatAnalysisData(analysisData, startupName)
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  downloadBlob(blob, `venture-autopsy-${slugify(startupName)}-${timestamp()}.json`)
}

// ─── CSV Export ─────────────────────────────────────────────────

export function exportAsCSV(analysisData, startupName) {
  const data = formatAnalysisData(analysisData, startupName)
  const baseName = `venture-autopsy-${slugify(startupName)}-${timestamp()}`
  const lines = []

  // Header
  lines.push(`"Venture Autopsy Report","${data.startupName}"`)
  lines.push(`"Generated","${data.reportGenerated}"`)
  lines.push(`"Risk Score","${data.score}"`)
  lines.push(`"Risk Level","${data.riskLevel}"`)
  lines.push("")

  // Explanations
  if (data.explanations.length > 0) {
    lines.push("Explanations")
    data.explanations.forEach((exp) => lines.push(`"${exp}"`))
    lines.push("")
  }

  // Risk Factors
  if (data.riskFactors.length > 0) {
    lines.push('"Factor","Weight","Severity","Description"')
    data.riskFactors.forEach((f) =>
      lines.push(`"${f.factor}","${f.weight}","${f.severity}","${f.description || ""}"`)
    )
    lines.push("")
  }

  // Insights
  if (data.insights.length > 0) {
    lines.push("Insights")
    data.insights.forEach((insight) => lines.push(`"${insight}"`))
    lines.push("")
  }

  // Recommendations
  if (data.recommendations.length > 0) {
    lines.push("Recommendations")
    data.recommendations.forEach((rec) => lines.push(`"${rec}"`))
    lines.push("")
  }

  // Similar Startups
  if (data.similarStartups.length > 0) {
    lines.push('"Name","Industry","Death Cause","Lifespan (days)","Funding (USD)","Similarity"')
    data.similarStartups.forEach((s) =>
      lines.push(
        `"${s.name || ""}","${s.industry || ""}","${s.deathCause || ""}","${s.lifespanDays || ""}","${s.totalFundingUsd || ""}","${s.similarityScore || ""}"`
      )
    )
  }

  const bom = "\uFEFF"
  const blob = new Blob([bom + lines.join("\r\n")], { type: "text/csv;charset=utf-8" })
  downloadBlob(blob, `${baseName}.csv`)
}

// ─── PDF Export ─────────────────────────────────────────────────

export function exportAsPDF(analysisData, startupName) {
  const data = formatAnalysisData(analysisData, startupName)
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = 210
  const margin = 15
  const contentWidth = pageWidth - 2 * margin
  let y = margin

  function addPage() {
    pdf.addPage()
    y = margin
  }

  function checkPage(needed) {
    if (y + needed > 290) addPage()
  }

  function addSection(title, items, transformer) {
    if (!items || items.length === 0) return
    checkPage(12)
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text(title, margin, y)
    y += 8

    items.forEach((item) => {
      const text = transformer ? transformer(item) : item
      const lines = pdf.splitTextToSize(text, contentWidth)
      checkPage(lines.length * 5 + 4)
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.text(lines, margin, y)
      y += lines.length * 5 + 2
    })
    y += 4
  }

  // Title
  pdf.setFontSize(22)
  pdf.setFont("helvetica", "bold")
  pdf.text("Venture Autopsy Report", margin, y)
  y += 8

  pdf.setFontSize(11)
  pdf.setFont("helvetica", "normal")
  pdf.text("Startup: " + data.startupName, margin, y)
  y += 5
  pdf.text("Generated: " + data.reportGenerated, margin, y)
  y += 10

  // Separator
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, y, pageWidth - margin, y)
  y += 8

  // Risk Score
  checkPage(20)
  pdf.setFontSize(16)
  pdf.setFont("helvetica", "bold")
  pdf.text("Risk Score: " + data.score + "/100", margin, y)
  y += 7
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "normal")
  pdf.text("Risk Level: " + data.riskLevel, margin, y)
  y += 12

  // Sections
  addSection("Explanations", data.explanations)

  addSection(
    "Risk Factors",
    data.riskFactors,
    (f) => f.factor + " (" + f.weight + " pts, " + f.severity + ")" + (f.description ? " - " + f.description : "")
  )

  addSection("Insights", data.insights)
  addSection("Recommendations", data.recommendations)

  addSection(
    "Similar Startups",
    data.similarStartups,
    (s) =>
      s.name + " | " + s.industry + " | Cause: " + s.deathCause +
      " | Lifespan: " + (s.lifespanDays || "?") + "d" +
      " | Funding: " + (s.totalFundingUsd ? "$" + (s.totalFundingUsd / 1e6).toFixed(1) + "M" : "?")
  )

  // Footer
  checkPage(12)
  pdf.setFontSize(8)
  pdf.setFont("helvetica", "italic")
  pdf.setTextColor(150, 150, 150)
  pdf.text("Generated by Venture Autopsy - AI-Powered Startup Failure Intelligence", margin, 285)

  pdf.save("venture-autopsy-" + slugify(startupName) + "-" + timestamp() + ".pdf")
}

// ─── HTML Export ────────────────────────────────────────────────

export function exportAsHTML(analysisData, startupName) {
  const data = formatAnalysisData(analysisData, startupName)

  const riskColor =
    data.riskLevel === "Critical" ? "#ef4444" :
    data.riskLevel === "High" ? "#f97316" :
    data.riskLevel === "Medium" ? "#f59e0b" : "#10b981"

  let html = '<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Venture Autopsy Report</title>\n'
  html += '<style>\n'
  html += 'body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1f2937}\n'
  html += 'h1{font-size:28px;margin-bottom:4px}\n'
  html += '.meta{color:#6b7280;font-size:14px;margin-bottom:24px}\n'
  html += '.score{display:inline-block;padding:8px 24px;border-radius:8px;color:#fff;font-size:24px;font-weight:700;background:' + riskColor + ';margin-bottom:24px}\n'
  html += 'h2{font-size:18px;margin-top:24px;margin-bottom:8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px}\n'
  html += 'ul{padding-left:20px}\n'
  html += 'li{margin-bottom:4px;line-height:1.5}\n'
  html += 'table{width:100%;border-collapse:collapse;margin-top:8px}\n'
  html += 'th,td{text-align:left;padding:8px;border-bottom:1px solid #e5e7eb;font-size:14px}\n'
  html += 'th{background:#f9fafb;font-weight:600}\n'
  html += '.footer{margin-top:32px;font-size:12px;color:#9ca3af;text-align:center}\n'
  html += '</style></head><body>\n'
  html += '<h1>Venture Autopsy Report</h1>\n'
  html += '<div class="meta">Startup: ' + escapeHtml(data.startupName) + '<br>Generated: ' + data.reportGenerated + '</div>\n'
  html += '<div class="score">' + data.score + '/100 - ' + data.riskLevel + '</div>\n'

  if (data.explanations.length) {
    html += '<h2>Explanations</h2><ul>\n'
    data.explanations.forEach((e) => { html += '<li>' + escapeHtml(e) + '</li>\n' })
    html += '</ul>\n'
  }

  if (data.riskFactors.length) {
    html += '<h2>Risk Factors</h2><table><thead><tr><th>Factor</th><th>Weight</th><th>Severity</th></tr></thead><tbody>\n'
    data.riskFactors.forEach((f) => {
      html += '<tr><td>' + escapeHtml(f.factor) + '</td><td>' + f.weight + '</td><td>' + f.severity + '</td></tr>\n'
    })
    html += '</tbody></table>\n'
  }

  if (data.insights.length) {
    html += '<h2>Insights</h2><ul>\n'
    data.insights.forEach((i) => { html += '<li>' + escapeHtml(i) + '</li>\n' })
    html += '</ul>\n'
  }

  if (data.recommendations.length) {
    html += '<h2>Recommendations</h2><ul>\n'
    data.recommendations.forEach((r) => { html += '<li>' + escapeHtml(r) + '</li>\n' })
    html += '</ul>\n'
  }

  if (data.similarStartups.length) {
    html += '<h2>Similar Startups</h2><table><thead><tr><th>Name</th><th>Industry</th><th>Death Cause</th><th>Lifespan</th><th>Funding</th></tr></thead><tbody>\n'
    data.similarStartups.forEach((s) => {
      html += '<tr><td>' + escapeHtml(s.name) + '</td><td>' + escapeHtml(s.industry) + '</td><td>' + escapeHtml(s.deathCause) + '</td><td>' + (s.lifespanDays || "?") + 'd</td><td>' + (s.totalFundingUsd ? "$" + (s.totalFundingUsd / 1e6).toFixed(1) + "M" : "?") + '</td></tr>\n'
    })
    html += '</tbody></table>\n'
  }

  html += '<div class="footer">Generated by Venture Autopsy - AI-Powered Startup Failure Intelligence</div></body></html>'
  return html
}

// ─── Helpers ────────────────────────────────────────────────────

function slugify(str) {
  return (str || "report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50)
}

function timestamp() {
  const d = new Date()
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate())
}

function pad(n) {
  return n.toString().padStart(2, "0")
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function escapeHtml(str) {
  if (!str) return ""
  return String(str)
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&#34;")
}
