
import { Project } from '@/types/project';
import { format } from 'date-fns';

export class PDFHeader {
  private project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  create(): HTMLElement {
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'flex-start';
    header.style.marginBottom = '20px';
    header.style.paddingBottom = '20px';
    header.style.borderBottom = '3px solid #000';

    const brand = this.createBrand();
    const titleSection = this.createTitleSection();
    const dateSection = this.createDateSection();

    header.appendChild(brand);
    header.appendChild(titleSection);
    header.appendChild(dateSection);

    return header;
  }

  private createBrand(): HTMLElement {
    const brand = document.createElement('div');
    brand.style.fontSize = '32px';
    brand.style.fontWeight = 'bold';
    brand.style.color = '#000';
    brand.textContent = 'TÉCHIN';
    return brand;
  }

  private createTitleSection(): HTMLElement {
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

    return titleSection;
  }

  private createDateSection(): HTMLElement {
    const dateSection = document.createElement('div');
    dateSection.style.textAlign = 'right';
    dateSection.style.fontSize = '18px';
    dateSection.innerHTML = `<strong>Date:</strong><br>${format(new Date(), 'MMM dd, yyyy')}`;
    return dateSection;
  }
}
