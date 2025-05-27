
import { Project } from '@/types/project';
import { createBaseContainer } from './utils/pdfStyles';
import { PDFHeader } from './components/PDFHeader';
import { PDFMainContent } from './components/PDFMainContent';
import { PDFReferenceContent } from './components/PDFReferenceContent';

export class PDFContentCreator {
  private project: Project;
  private header: PDFHeader;
  private mainContent: PDFMainContent;
  private referenceContent: PDFReferenceContent;

  constructor(project: Project) {
    this.project = project;
    this.header = new PDFHeader(project);
    this.mainContent = new PDFMainContent(project);
    this.referenceContent = new PDFReferenceContent(project);
  }

  createPDFContent = (pageType: 'main' | 'reference', referenceStartIndex?: number): HTMLElement => {
    const container = createBaseContainer();
    const header = this.header.create();
    container.appendChild(header);

    if (pageType === 'main') {
      const content = this.mainContent.create();
      container.appendChild(content);
    } else {
      const content = this.referenceContent.create(referenceStartIndex);
      container.appendChild(content);
    }

    return container;
  };
}
