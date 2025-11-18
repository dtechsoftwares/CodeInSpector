
import { AnalysisReport } from '../types';

declare const jspdf: any;
declare const html2canvas: any;

export const generatePdf = async (report: AnalysisReport, elementId: string) => {
  const { jsPDF } = jspdf;
  const reportElement = document.getElementById(elementId);

  if (!reportElement) {
    console.error('Report element not found!');
    return;
  }

  const canvas = await html2canvas(reportElement, {
      scale: 2, // Higher scale for better quality
      backgroundColor: '#111827', // Match the dark background
      useCORS: true,
      windowWidth: reportElement.scrollWidth,
      windowHeight: reportElement.scrollHeight
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = imgWidth / imgHeight;
  const newImgHeight = pdfWidth / ratio;
  
  let heightLeft = newImgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, newImgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft >= 0) {
    position = heightLeft - newImgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, newImgHeight);
    heightLeft -= pdfHeight;
  }
  
  const safeProjectName = report.projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  pdf.save(`CodeInspector_Report_${safeProjectName}.pdf`);
};
