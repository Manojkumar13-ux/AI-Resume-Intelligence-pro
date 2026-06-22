import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateReport = async (
  analysis: any,
  user: any,
  resumeName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4'
      });
      
      const filename = `report-${Date.now()}.pdf`;
      const reportDir = path.join(process.cwd(), 'reports');
      const filepath = path.join(reportDir, filename);

      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }

      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      const primaryColor = '#4F46E5';

      doc.fontSize(28)
         .font('Helvetica-Bold')
         .fillColor(primaryColor)
         .text('AI Resume Intelligence Pro', { align: 'center' });
      
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#6B7280')
         .text('Professional Resume Analysis Report', { align: 'center' });
      
      doc.moveDown(0.5);
      doc.fontSize(10)
         .fillColor('#9CA3AF')
         .text(`Report Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      
      doc.moveDown(2);

      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('📄 Resume Information');
      
      doc.moveDown(0.5);
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#374151')
         .text(`File Name: ${resumeName}`);
      doc.text(`User: ${user.name} (${user.email})`);
      
      doc.moveDown(2);

      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('🎯 Overall ATS Score');
      
      doc.moveDown(0.5);
      
      const score = analysis.atsScore || 0;
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .fillColor(score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444')
         .text(`${score}%`, 50, doc.y);
      
      doc.moveDown(2);

      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('📊 ATS Compatibility Breakdown');
      
      doc.moveDown(0.5);
      
      const compatibility = analysis.atsCompatibility || {
        format: 75,
        keywords: 68,
        experience: 72,
        education: 80,
        skills: 70
      };

      const compatItems = [
        { name: 'Format', value: compatibility.format },
        { name: 'Keywords', value: compatibility.keywords },
        { name: 'Experience', value: compatibility.experience },
        { name: 'Education', value: compatibility.education },
        { name: 'Skills', value: compatibility.skills }
      ];

      let startY = doc.y;
      compatItems.forEach((item, index) => {
        const yPos = startY + (index * 25);
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#374151')
           .text(item.name, 50, yPos);
        
        const barX = 180;
        const barWidth = 250;
        const barHeight = 12;
        
        doc.rect(barX, yPos + 2, barWidth, barHeight)
           .fillColor('#E5E7EB')
           .fill();
        
        const fillWidth = (item.value / 100) * barWidth;
        doc.rect(barX, yPos + 2, fillWidth, barHeight)
           .fillColor(item.value >= 80 ? '#10B981' : item.value >= 60 ? '#F59E0B' : '#EF4444')
           .fill();
        
        doc.fontSize(11)
           .font('Helvetica-Bold')
           .fillColor('#1F2937')
           .text(`${item.value}%`, barX + barWidth + 15, yPos);
      });
      
      doc.y = startY + (compatItems.length * 25) + 20;
      doc.moveDown(1);

      const strengths = analysis.strengths || ['Good communication', 'Relevant experience'];
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('✅ Strengths');
      doc.moveDown(0.5);
      strengths.forEach(item => {
        doc.fontSize(12).font('Helvetica').fillColor('#374151').text(`• ${item}`, { indent: 20 });
      });
      
      doc.moveDown(1);
      
      const weaknesses = analysis.weaknesses || ['Missing keywords', 'Lack of metrics'];
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('⚠️ Areas for Improvement');
      doc.moveDown(0.5);
      weaknesses.forEach(item => {
        doc.fontSize(12).font('Helvetica').fillColor('#374151').text(`• ${item}`, { indent: 20 });
      });
      
      doc.moveDown(1);

      const suggestions = analysis.suggestions || ['Add quantifiable achievements', 'Include industry keywords'];
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('💡 Improvement Suggestions');
      doc.moveDown(0.5);
      suggestions.forEach((item: string, index: number) => {
        doc.fontSize(12).font('Helvetica').fillColor('#374151').text(`${index + 1}. ${item}`, { indent: 20 });
      });
      
      doc.moveDown(1);

      const roles = analysis.recommendedRoles || ['Software Engineer', 'Project Manager'];
      if (roles.length > 0) {
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .fillColor('#1F2937')
           .text('🎯 Recommended Job Roles');
        doc.moveDown(0.5);
        roles.forEach(role => {
          doc.fontSize(12).font('Helvetica').fillColor('#374151').text(`• ${role}`, { indent: 20 });
        });
        doc.moveDown(1);
      }

      doc.moveDown(2);
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#9CA3AF')
         .text('Generated by AI Resume Intelligence Pro', { align: 'center' });
      doc.text('© 2024 All Rights Reserved', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};