import React from 'react';
import { FormField } from '@/components/forms/FormField';

interface PatientIdentitySectionProps {
  formData: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    goes_by?: string;
    dob: string;
    address: string;
    city: string;
    county: string;
    state: string;
    zip: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const PatientIdentitySection: React.FC<PatientIdentitySectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Patient Identity</h3>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          error={errors.first_name}
        />
        <FormField
          label="Middle Name"
          name="middle_name"
          value={formData.middle_name || ''}
          onChange={handleChange}
          error={errors.middle_name}
        />
        <FormField
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          error={errors.last_name}
        />
      </div>

      {/* Goes By & DOB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Goes By"
          name="goes_by"
          value={formData.goes_by || ''}
          onChange={handleChange}
          error={errors.goes_by}
          helperText="Preferred name or nickname"
        />
        <FormField
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          required
          error={errors.dob}
        />
      </div>

      {/* Address */}
      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          error={errors.address}
        />
      </div>

      {/* City, County, State, ZIP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          error={errors.city}
        />
        <FormField
          label="County"
          name="county"
          value={formData.county}
          onChange={handleChange}
          required
          error={errors.county}
        />
        <FormField
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
          error={errors.state}
        />
        <FormField
          label="ZIP"
          name="zip"
          value={formData.zip}
          onChange={handleChange}
          required
          error={errors.zip}
        />
      </div>
    </div>
  );
};
