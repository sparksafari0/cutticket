
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Project } from '@/types/project';

export const generateProjectPDF = async (
  project: Project, 
  createPDFContent: (pageType: 'main' | 'reference', referenceStartIndex?: number) => HTMLElement
) => {
  // Use landscape orientation for horizontal layout
  const pdf = new jsPDF('l', 'pt', 'a4'); // 'l' for landscape
  let isFirstPage = true;

  // Generate main page
  const mainContent = createPDFContent('main');
  document.body.appendChild(mainContent);

  const mainCanvas = await html2canvas(mainContent, {
    width: 1123, // A4 landscape width
    height: 794,  // A4 landscape height
    scale: 1.2,   // Slightly higher quality but still reasonable file size
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });

  if (!isFirstPage) pdf.addPage();
  // A4 landscape dimensions: 842 x 595 points
  pdf.addImage(mainCanvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, 842, 595);
  isFirstPage = false;

  document.body.removeChild(mainContent);

  // Generate reference photo pages if they exist
  const referencePhotos = project.referencePhotos || [];
  if (referencePhotos.length > 0) {
    for (let i = 0; i < referencePhotos.length; i += 2) {
      const refContent = createPDFContent('reference', i);
      document.body.appendChild(refContent);

      const refCanvas = await html2canvas(refContent, {
        width: 1123,
        height: 794,
        scale: 1.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      pdf.addPage();
      pdf.addImage(refCanvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, 842, 595);

      document.body.removeChild(refContent);
    }
  }

  // Open PDF in browser instead of downloading
  const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};
