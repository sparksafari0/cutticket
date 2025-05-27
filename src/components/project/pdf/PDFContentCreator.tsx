
import { Project } from '@/types/project';
import { format } from 'date-fns';

export class PDFContentCreator {
  private project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  createPDFContent = (pageType: 'main' | 'reference', referenceStartIndex?: number): HTMLElement => {
    const container = this.createContainer();
    const header = this.createHeader();
    container.appendChild(header);

    if (pageType === 'main') {
      const content = this.createMainContent();
      container.appendChild(content);
    } else {
      const content = this.createReferenceContent(referenceStartIndex);
      container.appendChild(content);
    }

    return container;
  };

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.style.width = '794px'; // A4 width in pixels at 96 DPI
    container.style.height = '1123px'; // A4 height in pixels at 96 DPI
    container.style.padding = '40px';
    container.style.backgroundColor = '#f5f5f5';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    return container;
  }

  private createHeader(): HTMLElement {
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
    titleLine.innerHTML = `<strong>Title:</strong> ${this.project.title || ''}`;
    
    const styleLine = document.createElement('div');
    styleLine.innerHTML = `<strong>Style #:</strong> ${this.project.styleNumber || ''}`;
    
    titleSection.appendChild(titleLine);
    titleSection.appendChild(styleLine);

    // Date section
    const dateSection = document.createElement('div');
    dateSection.style.textAlign = 'right';
    dateSection.style.fontSize = '18px';
    dateSection.innerHTML = `<strong>Date:</strong><br>${format(this.project.dueDate, 'MMM dd, yyyy')}`;

    header.appendChild(brand);
    header.appendChild(titleSection);
    header.appendChild(dateSection);

    return header;
  }

  private createMainContent(): HTMLElement {
    const content = document.createElement('div');
    content.style.display = 'flex';
    content.style.gap = '20px';
    content.style.height = 'calc(100% - 120px)';

    const leftSide = this.createMainImageSection();
    const rightSide = this.createNotesAndFabricSection();

    content.appendChild(leftSide);
    content.appendChild(rightSide);

    return content;
  }

  private createMainImageSection(): HTMLElement {
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

    if (this.project.imageUrl) {
      const mainImage = document.createElement('img');
      mainImage.src = this.project.imageUrl;
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
    return leftSide;
  }

  private createNotesAndFabricSection(): HTMLElement {
    const rightSide = document.createElement('div');
    rightSide.style.flex = '1';
    rightSide.style.display = 'flex';
    rightSide.style.flexDirection = 'column';
    rightSide.style.gap = '20px';

    const notesContainer = this.createNotesSection();
    const fabricGrid = this.createFabricGrid();

    rightSide.appendChild(notesContainer);
    rightSide.appendChild(fabricGrid);

    return rightSide;
  }

  private createNotesSection(): HTMLElement {
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
    notesContent.textContent = this.project.notes || '';

    notesContainer.appendChild(notesLabel);
    notesContainer.appendChild(notesContent);

    return notesContainer;
  }

  private createFabricGrid(): HTMLElement {
    const fabricGrid = document.createElement('div');
    fabricGrid.style.display = 'grid';
    fabricGrid.style.gridTemplateColumns = '1fr 1fr';
    fabricGrid.style.gap = '12px';
    fabricGrid.style.flex = '1';

    const fabricItems = [
      { label: 'SELF', image: this.project.fabricSelfImage, text: this.project.fabricSelfText },
      { label: 'COMBO 1', image: this.project.fabricCombo1Image, text: this.project.fabricCombo1Text },
      { label: 'COMBO 2', image: this.project.fabricCombo2Image, text: this.project.fabricCombo2Text },
      { label: 'LINING', image: this.project.fabricLiningImage, text: this.project.fabricLiningText }
    ];

    fabricItems.forEach(item => {
      const fabricItem = this.createFabricItem(item);
      fabricGrid.appendChild(fabricItem);
    });

    return fabricGrid;
  }

  private createFabricItem(item: { label: string; image?: string; text?: string }): HTMLElement {
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

    return fabricItem;
  }

  private createReferenceContent(referenceStartIndex?: number): HTMLElement {
    const content = document.createElement('div');
    content.style.display = 'grid';
    content.style.gridTemplateColumns = '1fr 1fr';
    content.style.gap = '20px';
    content.style.height = 'calc(100% - 120px)';

    const startIndex = referenceStartIndex || 0;
    const referencePhotos = this.project.referencePhotos || [];
    const photosToShow = referencePhotos.slice(startIndex, startIndex + 2);

    photosToShow.forEach((photo) => {
      const imageContainer = this.createReferenceImageContainer(photo);
      content.appendChild(imageContainer);
    });

    return content;
  }

  private createReferenceImageContainer(photo: string): HTMLElement {
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

    return imageContainer;
  }
}
