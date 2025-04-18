import React, { useState } from 'react';
import { HelpCircle } from 'react-feather';

interface BodyMapSelectorProps {
  view: 'front' | 'back';
  bodyPartMapping: Record<string, { name: string }>;
  onSelectBodyPart: (bodyPart: string) => void;
}

const BodyMapSelector: React.FC<BodyMapSelectorProps> = ({ view, bodyPartMapping, onSelectBodyPart }) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const renderBodyPart = (part: string, coordinates: string) => (
    <polygon
      points={coordinates}
      fill="#E0F7FA"
      stroke="#006D77"
      strokeWidth="1"
      onMouseEnter={() => setHoveredPart(part)}
      onMouseLeave={() => setHoveredPart(null)}
      onClick={() => onSelectBodyPart(part)}
      className="cursor-pointer"
    />
  );

  return (
    <div className="relative">
      <div className="flex justify-center">
        <div className="relative">
          <svg
            width="200"
            height="400"
            viewBox="0 0 200 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base body outline */}
            <path
              d={view === 'front' 
                ? "M100,30 C130,30 130,50 130,60 C130,70 120,80 120,90 L120,150 C120,190 150,200 150,250 C150,300 130,350 120,370 L80,370 C70,350 50,300 50,250 C50,200 80,190 80,150 L80,90 C80,80 70,70 70,60 C70,50 70,30 100,30" 
                : "M100,30 C130,30 130,50 130,60 C130,70 120,80 120,90 L120,150 C120,190 150,200 150,250 C150,300 130,350 120,370 L80,370 C70,350 50,300 50,250 C50,200 80,190 80,150 L80,90 C80,80 70,70 70,60 C70,50 70,30 100,30"
              }
              fill="#F0F9FA"
              stroke="#006D77"
              strokeWidth="2"
            />
            
            {/* Front view body parts */}
            {view === 'front' && (
              <>
                {renderBodyPart('head', '85,40 115,40 115,60 85,60')}
                {renderBodyPart('face', '90,45 110,45 110,60 90,60')}
                {renderBodyPart('neck', '90,60 110,60 110,70 90,70')}
                {renderBodyPart('shoulder_right', '70,75 90,75 90,85 70,85')}
                {renderBodyPart('shoulder_left', '110,75 130,75 130,85 110,85')}
                {renderBodyPart('chest', '90,85 110,85 110,120 90,120')}
                {renderBodyPart('arm_upper_right', '70,85 80,85 80,115 70,115')}
                {renderBodyPart('arm_upper_left', '120,85 130,85 130,115 120,115')}
                {renderBodyPart('elbow_right', '70,115 80,115 80,125 70,125')}
                {renderBodyPart('elbow_left', '120,115 130,115 130,125 120,125')}
                {renderBodyPart('arm_lower_right', '70,125 80,125 80,155 70,155')}
                {renderBodyPart('arm_lower_left', '120,125 130,125 130,155 120,155')}
                {renderBodyPart('wrist_right', '70,155 80,155 80,165 70,165')}
                {renderBodyPart('wrist_left', '120,155 130,155 130,165 120,165')}
                {renderBodyPart('hand_right', '65,165 80,165 80,180 65,180')}
                {renderBodyPart('hand_left', '120,165 135,165 135,180 120,180')}
                {renderBodyPart('abdomen_upper', '90,120 110,120 110,140 90,140')}
                {renderBodyPart('abdomen_lower', '90,140 110,140 110,160 90,160')}
                {renderBodyPart('hip_right', '80,160 95,160 95,180 80,180')}
                {renderBodyPart('hip_left', '105,160 120,160 120,180 105,180')}
                {renderBodyPart('groin', '95,160 105,160 105,180 95,180')}
                {renderBodyPart('thigh_right', '80,180 95,180 95,230 80,230')}
                {renderBodyPart('thigh_left', '105,180 120,180 120,230 105,230')}
                {renderBodyPart('knee_right', '80,230 95,230 95,245 80,245')}
                {renderBodyPart('knee_left', '105,230 120,230 120,245 105,245')}
                {renderBodyPart('leg_lower_right', '80,245 95,245 95,295 80,295')}
                {renderBodyPart('leg_lower_left', '105,245 120,245 120,295 105,295')}
                {renderBodyPart('ankle_right', '80,295 95,295 95,305 80,305')}
                {renderBodyPart('ankle_left', '105,295 120,295 120,305 105,305')}
                {renderBodyPart('foot_right', '75,305 95,305 95,320 75,320')}
                {renderBodyPart('foot_left', '105,305 125,305 125,320 105,320')}
              </>
            )}
            
            {/* Back view body parts */}
            {view === 'back' && (
              <>
                {renderBodyPart('head', '85,40 115,40 115,60 85,60')}
                {renderBodyPart('neck', '90,60 110,60 110,70 90,70')}
                {renderBodyPart('shoulder_right', '70,75 90,75 90,85 70,85')}
                {renderBodyPart('shoulder_left', '110,75 130,75 130,85 110,85')}
                {renderBodyPart('back_upper', '90,85 110,85 110,110 90,110')}
                {renderBodyPart('back_mid', '90,110 110,110 110,135 90,135')}
                {renderBodyPart('back_lower', '90,135 110,135 110,160 90,160')}
                {renderBodyPart('arm_upper_right', '70,85 80,85 80,115 70,115')}
                {renderBodyPart('arm_upper_left', '120,85 130,85 130,115 120,115')}
                {renderBodyPart('elbow_right', '70,115 80,115 80,125 70,125')}
                {renderBodyPart('elbow_left', '120,115 130,115 130,125 120,125')}
                {renderBodyPart('arm_lower_right', '70,125 80,125 80,155 70,155')}
                {renderBodyPart('arm_lower_left', '120,125 130,125 130,155 120,155')}
                {renderBodyPart('wrist_right', '70,155 80,155 80,165 70,165')}
                {renderBodyPart('wrist_left', '120,155 130,155 130,165 120,165')}
                {renderBodyPart('hand_right', '65,165 80,165 80,180 65,180')}
                {renderBodyPart('hand_left', '120,165 135,165 135,180 120,180')}
                {renderBodyPart('buttock_right', '80,160 95,160 95,180 80,180')}
                {renderBodyPart('buttock_left', '105,160 120,160 120,180 105,180')}
                {renderBodyPart('thigh_right', '80,180 95,180 95,230 80,230')}
                {renderBodyPart('thigh_left', '105,180 120,180 120,230 105,230')}
                {renderBodyPart('knee_right', '80,230 95,230 95,245 80,245')}
                {renderBodyPart('knee_left', '105,230 120,230 120,245 105,245')}
                {renderBodyPart('calf_right', '80,245 95,245 95,295 80,295')}
                {renderBodyPart('calf_left', '105,245 120,245 120,295 105,295')}
                {renderBodyPart('ankle_right', '80,295 95,295 95,305 80,305')}
                {renderBodyPart('ankle_left', '105,295 120,295 120,305 105,305')}
                {renderBodyPart('foot_right', '75,305 95,305 95,320 75,320')}
                {renderBodyPart('foot_left', '105,305 125,305 125,320 105,320')}
              </>
            )}
          </svg>
          
          {/* Hover tooltip */}
          {hoveredPart && (
            <div 
              className="absolute text-sm bg-white border border-gray-200 rounded-md px-2 py-1 shadow-sm"
              style={{ 
                top: '10px', 
                left: '50%', 
                transform: 'translateX(-50%)' 
              }}
            >
              {bodyPartMapping[hoveredPart]?.name || hoveredPart}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
        <HelpCircle size={14} className="mr-1" />
        Click on a body part to select it for your symptom description
      </div>
    </div>
  );
};

export default BodyMapSelector;