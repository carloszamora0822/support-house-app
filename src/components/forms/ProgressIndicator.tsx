import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  isComplete: boolean;
  isActive: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  className = '',
}) => {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <li key={step.id} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  data-step={step.id}
                  aria-current={step.isActive ? 'step' : undefined}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full
                    font-semibold text-white transition-colors
                    ${step.isComplete ? 'bg-green-600' : ''}
                    ${step.isActive && !step.isComplete ? 'bg-blue-600' : ''}
                    ${!step.isActive && !step.isComplete ? 'bg-gray-300' : ''}
                  `.trim().replace(/\s+/g, ' ')}
                >
                  {step.isComplete ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`
                    text-sm font-medium
                    ${step.isActive ? 'text-blue-600' : ''}
                    ${step.isComplete ? 'text-green-600' : ''}
                    ${!step.isActive && !step.isComplete ? 'text-gray-500' : ''}
                  `.trim().replace(/\s+/g, ' ')}>
                    {step.title}
                  </p>
                </div>
              </div>
              
              {!isLast && (
                <div
                  data-connector
                  className={`
                    flex-1 h-1 mx-4
                    ${step.isComplete ? 'bg-green-600' : 'bg-gray-300'}
                  `.trim().replace(/\s+/g, ' ')}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
