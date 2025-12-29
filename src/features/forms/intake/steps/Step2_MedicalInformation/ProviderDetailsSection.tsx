import React from 'react';
import { FormField } from '@/components/forms/FormField';

interface ProviderDetailsSectionProps {
  formData: {
    provider_other_role?: string;
    provider_other_location?: string;
    provider_other_city?: string;
    provider_other_state?: string;
    surgeon_name?: string;
    surgeon_location?: string;
    surgeon_city?: string;
    surgeon_state?: string;
    general_doctor?: string;
    general_location?: string;
    general_city?: string;
    general_state?: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const ProviderDetailsSection: React.FC<ProviderDetailsSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Provider Details</h3>

      {/* Other Provider */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">Other Provider</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            label="Other Provider Role"
            name="provider_other_role"
            value={formData.provider_other_role || ''}
            onChange={handleInputChange}
            error={errors.provider_other_role}
          />
          <FormField
            label="Other Provider Location"
            name="provider_other_location"
            value={formData.provider_other_location || ''}
            onChange={handleInputChange}
            error={errors.provider_other_location}
          />
          <FormField
            label="City"
            name="provider_other_city"
            value={formData.provider_other_city || ''}
            onChange={handleInputChange}
            error={errors.provider_other_city}
          />
          <FormField
            label="State"
            name="provider_other_state"
            value={formData.provider_other_state || ''}
            onChange={handleInputChange}
            error={errors.provider_other_state}
          />
        </div>
      </div>

      {/* Surgeon */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">Surgeon</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            label="Surgeon Name"
            name="surgeon_name"
            value={formData.surgeon_name || ''}
            onChange={handleInputChange}
            error={errors.surgeon_name}
          />
          <FormField
            label="Surgeon Location"
            name="surgeon_location"
            value={formData.surgeon_location || ''}
            onChange={handleInputChange}
            error={errors.surgeon_location}
          />
          <FormField
            label="City"
            name="surgeon_city"
            value={formData.surgeon_city || ''}
            onChange={handleInputChange}
            error={errors.surgeon_city}
          />
          <FormField
            label="State"
            name="surgeon_state"
            value={formData.surgeon_state || ''}
            onChange={handleInputChange}
            error={errors.surgeon_state}
          />
        </div>
      </div>

      {/* General Doctor */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">General Doctor</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            label="General Doctor"
            name="general_doctor"
            value={formData.general_doctor || ''}
            onChange={handleInputChange}
            error={errors.general_doctor}
          />
          <FormField
            label="General Location"
            name="general_location"
            value={formData.general_location || ''}
            onChange={handleInputChange}
            error={errors.general_location}
          />
          <FormField
            label="City"
            name="general_city"
            value={formData.general_city || ''}
            onChange={handleInputChange}
            error={errors.general_city}
          />
          <FormField
            label="State"
            name="general_state"
            value={formData.general_state || ''}
            onChange={handleInputChange}
            error={errors.general_state}
          />
        </div>
      </div>
    </div>
  );
};
