import React from 'react';

interface ConditionalSectionProps {
  condition: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ConditionalSection: React.FC<ConditionalSectionProps> = ({
  condition,
  children,
  className = '',
}) => {
  if (!condition) {
    return null;
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
};
