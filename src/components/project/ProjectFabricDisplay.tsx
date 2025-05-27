import { Project } from '@/types/project';
import { Image } from 'lucide-react';
interface ProjectFabricDisplayProps {
  project: Project;
  onSetExpandedPhoto: (photo: string) => void;
}
const ProjectFabricDisplay = ({
  project,
  onSetExpandedPhoto
}: ProjectFabricDisplayProps) => {
  const fabricItems = [{
    label: 'Self',
    image: project.fabricSelfImage,
    text: project.fabricSelfText
  }, {
    label: 'Combo 1',
    image: project.fabricCombo1Image,
    text: project.fabricCombo1Text
  }, {
    label: 'Combo 2',
    image: project.fabricCombo2Image,
    text: project.fabricCombo2Text
  }, {
    label: 'Lining',
    image: project.fabricLiningImage,
    text: project.fabricLiningText
  }];

  // Check if any fabric data exists
  const hasFabricData = fabricItems.some(item => item.image || item.text);
  if (!hasFabricData) return null;
  return <div className="space-y-2">
      
      <div className="grid grid-cols-4 gap-2">
        {fabricItems.map((item, index) => <div key={index} className="space-y-1">
            <div className="text-xs font-medium text-gray-600 text-center">
              {item.label}
            </div>
            <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
              {item.image ? <img src={item.image} alt={`${item.label} fabric`} className="w-full h-full object-cover cursor-pointer" onClick={() => onSetExpandedPhoto(item.image!)} /> : item.text ? <div className="w-full h-full flex items-center justify-center p-1">
                  <span className="text-xs text-center text-gray-700 break-words">
                    {item.text}
                  </span>
                </div> : <div className="w-full h-full flex items-center justify-center">
                  <Image className="h-4 w-4 text-gray-400" />
                </div>}
            </div>
          </div>)}
      </div>
    </div>;
};
export default ProjectFabricDisplay;