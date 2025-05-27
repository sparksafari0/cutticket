
import { useState, useCallback } from 'react';

interface UseDragAndDropProps {
  onFileDrop: (file: File) => void;
  accept?: string[];
}

export const useDragAndDrop = ({ onFileDrop, accept = ['image/*', 'application/pdf'] }: UseDragAndDropProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const isValidFileType = useCallback((file: File) => {
    return accept.some(acceptType => {
      if (acceptType === 'image/*') {
        return file.type.startsWith('image/');
      }
      if (acceptType === 'application/pdf') {
        return file.type === 'application/pdf';
      }
      return file.type === acceptType;
    });
  }, [accept]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set dragOver to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(isValidFileType);
    
    if (validFile) {
      onFileDrop(validFile);
    }
  }, [onFileDrop, isValidFileType]);

  return {
    isDragOver,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
};
