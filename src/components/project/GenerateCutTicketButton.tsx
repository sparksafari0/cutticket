
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { Project } from '@/types/project';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

interface GenerateCutTicketButtonProps {
  project: Project;
}

const GenerateCutTicketButton = ({ project }: GenerateCutTicketButtonProps) => {
  const [generating, setGenerating] = useState(false);

  const createPDFContent = (pageType: 'main' | 'reference', referenceStartIndex?: number) => {
    const container = document.createElement('div');
    container.style.width = '794px'; // A4 width in pixels at 96 DPI
    container.style.height = '1123px'; // A4 height in pixels at 96 DPI
    container.style.padding = '40px';
    container.style.backgroundColor = '#f5f5f5';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';

    // Header section
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'flex-start';
    header.style.marginBottom = '20px';
    header.style.paddingBottom = '20px';
    header.style.borderBottom = '3px solid #000';

    // TECHIN brand
    const brand = document.createElement('div');
    brand.style.fontSize = '32px';
    brand.style.fontWeight = 'bold';
    brand.style.color = '#000';
    brand.textContent = 'TÉCHIN';

    // Title and Style section
    const titleSection = document.createElement('div');
    titleSection.style.textAlign = 'left';
    titleSection.style.fontSize = '18px';
    titleSection.style.lineHeight = '1.4';
    
    const titleLine = document.createElement('div');
    titleLine.innerHTML = `<strong>Title:</strong> ${project.title || ''}`;
    
    const styleLine = document.createElement('div');
    styleLine.innerHTML = `<strong>Style #:</strong> ${project.styleNumber || ''}`;
    
    titleSection.appendChild(titleLine);
    titleSection.appendChild(styleLine);

    // Date section
    const dateSection = document.createElement('div');
    dateSection.style.textAlign = 'right';
    dateSection.style.fontSize = '18px';
    dateSection.innerHTML = `<strong>Date:</strong><br>${format(project.dueDate, 'MMM dd, yyyy')}`;

    header.appendChild(brand);
    header.appendChild(titleSection);
    header.appendChild(dateSection);
    container.appendChild(header);

    if (pageType === 'main') {
      // Main content area
      const content = document.createElement('div');
      content.style.display = 'flex';
      content.style.gap = '20px';
      content.style.height = 'calc(100% - 120px)';

      // Left side - Main image
      const leftSide = document.createElement('div');
      leftSide.style.flex = '1';
      leftSide.style.display = 'flex';
      leftSide.style.flexDirection = 'column';

      const mainImageContainer = document.createElement('div');
      mainImageContainer.style.width = '100%';
      mainImageContainer.style.height = '400px';
      mainImageContainer.style.backgroundColor = '#d1d5db';
      mainImageContainer.style.borderRadius = '8px';
      mainImageContainer.style.display = 'flex';
      mainImageContainer.style.alignItems = 'center';
      mainImageContainer.style.justifyContent = 'center';
      mainImageContainer.style.position = 'relative';
      mainImageContainer.style.overflow = 'hidden';

      if (project.imageUrl) {
        const mainImage = document.createElement('img');
        mainImage.src = project.imageUrl;
        mainImage.style.width = '100%';
        mainImage.style.height = '100%';
        mainImage.style.objectFit = 'contain';
        mainImageContainer.appendChild(mainImage);
      } else {
        const placeholder = document.createElement('div');
        placeholder.style.fontSize = '24px';
        placeholder.style.color = '#6b7280';
        placeholder.style.fontWeight = 'bold';
        placeholder.textContent = 'MAIN IMAGE';
        mainImageContainer.appendChild(placeholder);
      }

      leftSide.appendChild(mainImageContainer);
      content.appendChild(leftSide);

      // Right side
      const rightSide = document.createElement('div');
      rightSide.style.flex = '1';
      rightSide.style.display = 'flex';
      rightSide.style.flexDirection = 'column';
      rightSide.style.gap = '20px';

      // Notes section
      const notesContainer = document.createElement('div');
      notesContainer.style.height = '160px';
      notesContainer.style.backgroundColor = '#d1d5db';
      notesContainer.style.borderRadius = '8px';
      notesContainer.style.padding = '16px';
      notesContainer.style.position = 'relative';

      const notesLabel = document.createElement('div');
      notesLabel.style.fontSize = '18px';
      notesLabel.style.fontWeight = 'bold';
      notesLabel.style.marginBottom = '8px';
      notesLabel.textContent = 'NOTES';

      const notesContent = document.createElement('div');
      notesContent.style.fontSize = '14px';
      notesContent.style.whiteSpace = 'pre-wrap';
      notesContent.textContent = project.notes || '';

      notesContainer.appendChild(notesLabel);
      notesContainer.appendChild(notesContent);
      rightSide.appendChild(notesContainer);

      // Fabric grid
      const fabricGrid = document.createElement('div');
      fabricGrid.style.display = 'grid';
      fabricGrid.style.gridTemplateColumns = '1fr 1fr';
      fabricGrid.style.gap = '12px';
      fabricGrid.style.flex = '1';

      const fabricItems = [
        { label: 'SELF', image: project.fabricSelfImage, text: project.fabricSelfText },
        { label: 'COMBO 1', image: project.fabricCombo1Image, text: project.fabricCombo1Text },
        { label: 'COMBO 2', image: project.fabricCombo2Image, text: project.fabricCombo2Text },
        { label: 'LINING', image: project.fabricLiningImage, text: project.fabricLiningText }
      ];

      fabricItems.forEach(item => {
        const fabricItem = document.createElement('div');
        fabricItem.style.display = 'flex';
        fabricItem.style.flexDirection = 'column';
        fabricItem.style.gap = '8px';

        const label = document.createElement('div');
        label.style.fontSize = '14px';
        label.style.fontWeight = 'bold';
        label.style.textAlign = 'center';
        label.textContent = item.label;

        const imageContainer = document.createElement('div');
        imageContainer.style.aspectRatio = '1';
        imageContainer.style.backgroundColor = '#d1d5db';
        imageContainer.style.borderRadius = '8px';
        imageContainer.style.display = 'flex';
        imageContainer.style.alignItems = 'center';
        imageContainer.style.justifyContent = 'center';
        imageContainer.style.overflow = 'hidden';
        imageContainer.style.position = 'relative';

        if (item.image) {
          const img = document.createElement('img');
          img.src = item.image;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          imageContainer.appendChild(img);
        } else if (item.text) {
          const textDiv = document.createElement('div');
          textDiv.style.fontSize = '12px';
          textDiv.style.textAlign = 'center';
          textDiv.style.padding = '8px';
          textDiv.style.wordBreak = 'break-words';
          textDiv.textContent = item.text;
          imageContainer.appendChild(textDiv);
        }

        fabricItem.appendChild(label);
        fabricItem.appendChild(imageContainer);
        fabricGrid.appendChild(fabricItem);
      });

      rightSide.appendChild(fabricGrid);
      content.appendChild(rightSide);
      container.appendChild(content);
    } else {
      // Reference images page
      const content = document.createElement('div');
      content.style.display = 'grid';
      content.style.gridTemplateColumns = '1fr 1fr';
      content.style.gap = '20px';
      content.style.height = 'calc(100% - 120px)';

      const startIndex = referenceStartIndex || 0;
      const referencePhotos = project.referencePhotos || [];
      const photosToShow = referencePhotos.slice(startIndex, startIndex + 2);

      photosToShow.forEach((photo, index) => {
        const imageContainer = document.createElement('div');
        imageContainer.style.backgroundColor = '#d1d5db';
        imageContainer.style.borderRadius = '8px';
        imageContainer.style.display = 'flex';
        imageContainer.style.alignItems = 'center';
        imageContainer.style.justifyContent = 'center';
        imageContainer.style.overflow = 'hidden';
        imageContainer.style.position = 'relative';

        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.top = '50%';
        label.style.left = '50%';
        label.style.transform = 'translate(-50%, -50%)';
        label.style.fontSize = '24px';
        label.style.fontWeight = 'bold';
        label.style.color = '#6b7280';
        label.style.zIndex = '1';
        label.textContent = 'REFERENCE IMAGE';

        const img = document.createElement('img');
        img.src = photo;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.position = 'relative';
        img.style.zIndex = '2';

        imageContainer.appendChild(label);
        imageContainer.appendChild(img);
        content.appendChild(imageContainer);
      });

      container.appendChild(content);
    }

    return container;
  };

  const generatePDF = async () => {
    setGenerating(true);
    
    try {
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
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button 
      onClick={generatePDF} 
      disabled={generating}
      className="w-full"
      size="lg"
    >
      {generating ? (
        <>
          <Download className="h-4 w-4 mr-2 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileText className="h-4 w-4 mr-2" />
          Generate Cut Ticket
        </>
      )}
    </Button>
  );
};

export default GenerateCutTicketButton;
