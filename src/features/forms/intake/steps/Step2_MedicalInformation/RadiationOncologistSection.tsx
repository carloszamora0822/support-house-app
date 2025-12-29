import React from 'react';
import { FormField } from '@/components/forms/FormField';

interface RadiationOncologistSectionProps {
  formData: {
    rad_oncologist_mercy?: string;
    rad_oncologist_baptist?: string;
    rad_oncologist_other?: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const RadiationOncologistSection: React.FC<RadiationOncologistSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Radiation Oncologists</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Mercy Radiation Oncologist"
          name="rad_oncologist_mercy"
          value={formData.rad_oncologist_mercy || ''}
          onChange={handleInputChange}
          error={errors.rad_oncologist_mercy}
        />
        <FormField
          label="Baptist Radiation Oncologist"
          name="rad_oncologist_baptist"
          value={formData.rad_oncologist_baptist || ''}
          onChange={handleInputChange}
          error={errors.rad_oncologist_baptist}
        />
        <FormField
          label="Other Radiation Oncologist"
          name="rad_oncologist_other"
          value={formData.rad_oncologist_other || ''}
          onChange={handleInputChange}
          error={errors.rad_oncologist_other}
        />
      </div>
    </div>
  );
};
