// lib/buildPdf.js — FINAL 10-PAGE HARMONY INTELLIGENCE REPORT™
import PDFDocument from 'pdfkit'
import getStream from 'get-stream'

const COLORS = {
  primary: '#3E8EFF',
  accent: '#23E0D8',
  dark: '#1F2225',
  light: '#C7CCD6',
  red: '#ef4444',
  green: '#22c55e'
}

export async function buildCalibrationPdf({ batchId, analysis }) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const chunks = []
  doc.on('data', chunks.push.bind(chunks))

  // Helper
  const addHeader = (text) => {
    doc.fontSize(28).fillColor(COLORS.primary).text(text, { underline: true })
    doc.moveDown(1)
  }

  // PAGE 1 — COVER
  doc.fontSize(48).fillColor(COLORS.primary).text('intelQA™', { align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(32).fillColor('white').text('Harmony Intelligence Report™', { align: 'center' })
  doc.moveDown(1)
  doc.fontSize(14).fillColor(COLORS.light).text(`Batch: ${batchId}`, { align: 'center' })
  doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' })
  doc.moveDown(4)
  doc.fontSize(18).fillColor(COLORS.accent).text('Calibration Intelligence™ for Revenue Teams', { align: 'center' })
  doc.addPage()

  // PAGE 2 — EXECUTIVE SUMMARY
  addHeader('Executive Summary')
  doc.fontSize(13).fillColor('white').text(analysis.alignment_summary || 'Perfect calibration achieved across all evaluators.')
  doc.moveDown(2)
  doc.fontSize(16).text(`Overall Alignment Score: ${analysis.overall_alignment_score || 'N/A'}/100`, { align: 'center' })
  doc.addPage()

  // PAGE 3 — DRIFT & HEATMAP
  addHeader('HarmonyHeat™ Calibration Drift')
  doc.fontSize(12).text(`Highest Drift Category: ${analysis.drift_stats?.highest_drift_category || 'N/A'} (${analysis.drift_stats?.drift_percentage || 0}%)`)
  doc.moveDown(1)
  doc.fontSize(10).text(JSON.stringify(analysis.heatmap || {}, null, 2), { lineGap: 3 })
  doc.addPage()

  // PAGE 4 — EMOTION ANALYSIS
  addHeader('EmotionSync™ Analysis')
  if (analysis.emotion_sync) {
    doc.fontSize(13).fillColor(COLORS.red).text(`Tone Misreads Detected: ${analysis.emotion_sync.tone_misreads_detected}`)
    doc.moveDown(0.5)
    doc.fillColor('white').fontSize(11).text(analysis.emotion_sync.explanation || 'No tone issues detected.')
  }
  doc.addPage()

  // PAGE 5 — COMPLIANCE RISKS
  addHeader('ComplianceGuard™ Risk Report')
  if (analysis.compliance_guard) {
    doc.fontSize(13).fillColor(COLORS.red).text(`High-Risk Calls: ${analysis.compliance_guard.high_risk_calls || 0}`)
    doc.moveDown(0.5)
    doc.fillColor('white').fontSize(11).text(analysis.compliance_guard.explanation || 'No compliance issues detected.')
  }
  doc.addPage()

  // PAGE 6-8 — DETAILED SCORE EXPLANATIONS (one per major category)
  addHeader('Score Explanations & Consensus Standards')
  const categories = Object.keys(analysis.score_explanations || {})
  categories.forEach((cat, i) => {
    if (i > 0) doc.addPage()
    const data = analysis.score_explanations[cat]
    doc.fontSize(18).fillColor(COLORS.primary).text(cat)
    doc.moveDown(0.5)
    doc.fontSize(11).fillColor('white')
      .text(`Average: ${data.average} | Range: ${data.range}`)
      .text(`Why They Disagree: ${data.why_they_disagree}`)
      .text(`Recommended Standard: ${data.recommended_standard}`, { italics: true, color: COLORS.accent })
  })

  // PAGE 9 — 30-DAY PLAN
  doc.addPage()
  addHeader('30-Day Harmony Action Plan')
  doc.fontSize(13).fillColor('white').text(analysis['30_day_harmony_plan'] || 'Implement consensus standards and re-run intelQA™ in 30 days.')

  // PAGE 10 — NEXT STEPS
  doc.addPage()
  addHeader('Immediate Next Steps')
  ;(analysis.next_steps || ['Run monthly intelQA™ reports', 'Train on new standards']).forEach((step, i) => {
    doc.fontSize(14).fillColor('white').text(`${i + 1}. ${step}`)
    doc.moveDown(0.5)
  })

  doc.end()
  const buffer = await getStream.buffer(doc)
  return buffer
}