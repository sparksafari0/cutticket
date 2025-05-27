import { Project } from '@/types/project';
import { createImageContainer, createImage, createPlaceholder } from '../utils/pdfStyles';

export class PDFMainContent {
  private project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  create(): HTMLElement {
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

    const mainImageContainer = createImageContainer('100%');
    mainImageContainer.style.width = '100%';

    if (this.project.imageUrl) {
      const mainImage = createImage(this.project.imageUrl, 'contain');
      mainImageContainer.appendChild(mainImage);
    } else {
      const placeholder = createPlaceholder('MAIN IMAGE');
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
    notesContainer.style.height = '240px';
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
    fabricGrid.style.gridTemplateColumns = '120px 120px'; // Fixed width columns for square boxes
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
    fabricItem.style.gap = '6px';

    const label = document.createElement('div');
    label.style.fontSize = '12px';
    label.style.fontWeight = 'bold';
    label.style.textAlign = 'center';
    label.textContent = item.label;

    const imageContainer = createImageContainer('120px'); // Square container
    imageContainer.style.borderRadius = '6px';
    imageContainer.style.width = '120px'; // Fixed width to match height
    imageContainer.style.aspectRatio = '1';

    if (item.image) {
      const img = createImage(item.image, 'contain');
      imageContainer.appendChild(img);
    } else if (item.text) {
      const textDiv = document.createElement('div');
      textDiv.style.fontSize = '10px';
      textDiv.style.textAlign = 'center';
      textDiv.style.padding = '6px';
      textDiv.style.wordBreak = 'break-words';
      textDiv.textContent = item.text;
      imageContainer.appendChild(textDiv);
    }

    fabricItem.appendChild(label);
    fabricItem.appendChild(imageContainer);

    return fabricItem;
  }
}
