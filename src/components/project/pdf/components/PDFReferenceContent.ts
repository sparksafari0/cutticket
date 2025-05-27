
import { Project } from '@/types/project';
import { createImageContainer, createImage } from '../utils/pdfStyles';

export class PDFReferenceContent {
  private project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  create(referenceStartIndex?: number): HTMLElement {
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
    const imageContainer = createImageContainer('100%');

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

    const img = createImage(photo, 'contain');
    img.style.position = 'relative';
    img.style.zIndex = '2';

    imageContainer.appendChild(label);
    imageContainer.appendChild(img);

    return imageContainer;
  }
}
