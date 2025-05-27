
export const createBaseContainer = (width: string = '1123px', height: string = '794px'): HTMLElement => {
  const container = document.createElement('div');
  container.style.width = width;
  container.style.height = height;
  container.style.padding = '40px';
  container.style.backgroundColor = '#f5f5f5';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  return container;
};

export const createImageContainer = (height: string, objectFit: 'contain' | 'cover' = 'contain'): HTMLElement => {
  const container = document.createElement('div');
  container.style.height = height;
  container.style.backgroundColor = '#d1d5db';
  container.style.borderRadius = '8px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  return container;
};

export const createImage = (src: string, objectFit: 'contain' | 'cover' = 'contain'): HTMLElement => {
  const img = document.createElement('img');
  img.src = src;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = objectFit;
  return img;
};

export const createPlaceholder = (text: string, fontSize: string = '24px'): HTMLElement => {
  const placeholder = document.createElement('div');
  placeholder.style.fontSize = fontSize;
  placeholder.style.color = '#6b7280';
  placeholder.style.fontWeight = 'bold';
  placeholder.textContent = text;
  return placeholder;
};
