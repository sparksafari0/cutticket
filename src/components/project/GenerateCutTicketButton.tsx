
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { Project } from '@/types/project';
import { generateProjectPDF } from '@/utils/pdfGenerator';
import { PDFContentCreator } from './pdf/PDFContentCreator';

interface GenerateCutTicketButtonProps {
  project: Project;
}

const GenerateCutTicketButton = ({ project }: GenerateCutTicketButtonProps) => {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    
    try {
      const pdfContentCreator = new PDFContentCreator(project);
      await generateProjectPDF(project, pdfContentCreator.createPDFContent);
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
