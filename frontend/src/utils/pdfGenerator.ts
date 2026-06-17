// src/utils/pdfGenerator.ts – PDF report generation

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AnalysisResult {
  filename: string;
  atsScore: number;
  analysis: {
    skills: number;
    experience: number;
    education: number;
    keywords: number;
    format: number;
  };
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
}

export const generateResumeReport = (data: AnalysisResult) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const margin = 20;
  let y = margin;
  const pageWidth = doc.internal.pageSize.getWidth();

  // ===== HEADER =====
  doc.setFontSize(24);
  doc.setTextColor(79, 70, 229); // Indigo
  doc.text('🧠 AI Resume Analyzer', margin, y);
  y += 8;

  doc.setFontSize(16);
  doc.setTextColor(100);
  doc.text('Comprehensive Resume Analysis Report', margin, y);
  y += 12;

  // ===== RESUME FILENAME =====
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`📄 Resume: ${data.filename}`, margin, y);
  y += 8;

  // ===== OVERALL SCORE =====
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text(`⭐ Overall ATS Score: ${data.atsScore}/100`, margin, y);
  y += 14;

  // ===== SCORE BREAKDOWN TABLE =====
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('📊 Score Breakdown', margin, y);
  y += 6;

  const sectionData = [
    ['Category', 'Score', 'Status'],
    ['Skills', `${data.analysis.skills}/100`, data.analysis.skills >= 80 ? '✅ Excellent' : data.analysis.skills >= 60 ? '📈 Good' : '💪 Needs Work'],
    ['Experience', `${data.analysis.experience}/100`, data.analysis.experience >= 80 ? '✅ Excellent' : data.analysis.experience >= 60 ? '📈 Good' : '💪 Needs Work'],
    ['Education', `${data.analysis.education}/100`, data.analysis.education >= 80 ? '✅ Excellent' : data.analysis.education >= 60 ? '📈 Good' : '💪 Needs Work'],
    ['Keywords', `${data.analysis.keywords}/100`, data.analysis.keywords >= 80 ? '✅ Excellent' : data.analysis.keywords >= 60 ? '📈 Good' : '💪 Needs Work'],
    ['Format', `${data.analysis.format}/100`, data.analysis.format >= 80 ? '✅ Excellent' : data.analysis.format >= 60 ? '📈 Good' : '💪 Needs Work'],
  ];

  autoTable(doc, {
    startY: y,
    head: [sectionData[0]],
    body: sectionData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 50, halign: 'center' },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // ===== KEY STRENGTHS =====
  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94); // Green
  doc.text('✅ Key Strengths', margin, y);
  y += 6;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  data.strengths.forEach((item) => {
    const splitText = doc.splitTextToSize(`• ${item}`, pageWidth - margin * 2 - 10);
    doc.text(splitText, margin + 4, y);
    y += splitText.length * 5 + 2;
  });
  y += 4;

  // ===== AREAS TO IMPROVE =====
  doc.setFontSize(14);
  doc.setTextColor(245, 158, 11); // Amber
  doc.text('⚠️ Areas to Improve', margin, y);
  y += 6;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  data.improvements.forEach((item) => {
    const splitText = doc.splitTextToSize(`• ${item}`, pageWidth - margin * 2 - 10);
    doc.text(splitText, margin + 4, y);
    y += splitText.length * 5 + 2;
  });
  y += 4;

  // ===== MISSING KEYWORDS =====
  if (data.missingKeywords && data.missingKeywords.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('🏷️ Missing Keywords', margin, y);
    y += 6;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const keywordsText = data.missingKeywords.join(' • ');
    const splitText = doc.splitTextToSize(`Add these keywords to improve your ATS score: ${keywordsText}`, pageWidth - margin * 2);
    doc.text(splitText, margin + 4, y);
    y += splitText.length * 5 + 6;
  }

  // ===== RECOMMENDATIONS =====
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('📌 Recommendations', margin, y);
  y += 6;
  doc.setFontSize(11);

  let recommendation = '';
  if (data.atsScore >= 80) {
    recommendation = 'Your resume is well-optimized for ATS! Focus on maintaining this standard and consider adding more quantifiable achievements to stand out even more.';
  } else if (data.atsScore >= 60) {
    recommendation = 'Your resume has a good foundation. Focus on adding more keywords and quantifiable achievements to improve your ATS score.';
  } else {
    recommendation = 'Your resume needs significant improvement. Follow the suggestions above and consider restructuring your resume for better ATS compatibility.';
  }

  const recSplit = doc.splitTextToSize(recommendation, pageWidth - margin * 2);
  doc.text(recSplit, margin + 4, y);
  y += recSplit.length * 5 + 10;

  // ===== FOOTER =====
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text('Generated by AI Resume Analyzer', margin, footerY);
  doc.text(new Date().toLocaleString(), pageWidth - margin - 50, footerY);

  // ===== SAVE PDF =====
  const fileName = `Resume_Report_${data.filename.replace(/\.[^.]+$/, '')}.pdf`;
  doc.save(fileName);
};

export default generateResumeReport;