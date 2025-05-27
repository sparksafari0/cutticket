
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Project } from '@/types/project';

export const generateProjectPDF = async (
  project: Project, 
  createPDFContent: (pageType: 'main' | 'reference', referenceStartIndex?: number) => HTMLElement
) => {
  const pdf = new jsPDF('p', 'pt', 'a4');
  let isFirstPage = true;

  // Generate main page
  const mainContent = createPDFContent('main');
  document.body.appendChild(mainContent);

  const mainCanvas = await html2canvas(mainContent, {
    width: 794,
    height: 1123,
    scale: 2,
    useCORS: true,
    allowTaint: true
  });

  if (!isFirstPage) pdf.addPage();
  pdf.addImage(mainCanvas.toDataURL('image/png'), 'PNG', 0, 0, 595, 842);
  isFirstPage = false;

  document.body.removeChild(mainContent);

  // Generate reference photo pages if they exist
  const referencePhotos = project.referencePhotos || [];
  if (referencePhotos.length > 0) {
    for (let i = 0; i < referencePhotos.length; i += 2) {
      const refContent = createPDFContent('reference', i);
      document.body.appendChild(refContent);

      const refCanvas = await html2canvas(refContent, {
        width: 794,
        height: 1123,
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      pdf.addPage();
      pdf.addImage(refCanvas.toDataURL('image/png'), 'PNG', 0, 0, 595, 842);

      document.body.removeChild(refContent);
    }
  }

  // Save the PDF
  const fileName = `${project.title || 'Project'}_Cut_Ticket.pdf`;
  pdf.save(fileName);
};
