import React from 'react';
import { FormField } from '@/components/forms/FormField';

interface FaxHeaderSectionProps {
  formData: {
    fax_form_date: string;
    fax_to_office: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const FaxHeaderSection: React.FC<FaxHeaderSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Fax Header</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Fax Form Date"
          name="fax_form_date"
          type="date"
          value={formData.fax_form_date}
          onChange={handleInputChange}
          required
          error={errors.fax_form_date}
        />
        <FormField
          label="Fax To Office"
          name="fax_to_office"
          value={formData.fax_to_office}
          onChange={handleInputChange}
          required
          error={errors.fax_to_office}
          helperText="Name of medical office receiving this fax"
        />
      </div>
    </div>
  );
};
