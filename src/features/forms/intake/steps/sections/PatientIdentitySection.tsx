import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { Select } from '@/components/ui/select';
import { STATES } from '@/constants/states';

interface PatientIdentitySectionProps {
  formData: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    goes_by?: string;
    dob: string;
    email?: string;
    phone_primary?: string;
    phone_second?: string;
    phone_other?: string;
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Patient Identity</h3>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          error={errors.first_name}
          className="text-base md:text-lg p-4"
        />
        <FormField
          label="Middle Name"
          name="middle_name"
          value={formData.middle_name || ''}
          onChange={handleChange}
          error={errors.middle_name}
          className="text-base md:text-lg p-4"
        />
        <FormField
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          error={errors.last_name}
          className="text-base md:text-lg p-4"
        />
      </div>

      {/* Goes By & DOB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Goes By"
          name="goes_by"
          value={formData.goes_by || ''}
          onChange={handleChange}
          error={errors.goes_by}
          helperText="Preferred name or nickname"
          className="text-base md:text-lg p-4"
        />
        <FormField
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          required
          error={errors.dob}
          className="text-base md:text-lg p-4"
        />
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Primary Phone"
            name="phone_primary"
            type="tel"
            value={formData.phone_primary || ''}
            onChange={handleChange}
            required
            error={errors.phone_primary}
            helperText="555-123-4567"
          />
          <FormField
            label="Secondary Phone"
            name="phone_second"
            type="tel"
            value={formData.phone_second || ''}
            onChange={handleChange}
            error={errors.phone_second}
          />
          <FormField
            label="Other Phone"
            name="phone_other"
            type="tel"
            value={formData.phone_other || ''}
            onChange={handleChange}
            error={errors.phone_other}
          />
        </div>
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email || ''}
          onChange={handleChange}
          error={errors.email}
        />
      </div>

      {/* Address */}
      <div className="grid grid-cols-1 gap-6">
        <FormField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          error={errors.address}
          className="text-base md:text-lg p-4"
        />
      </div>

      {/* City, County, State, ZIP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FormField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          error={errors.city}
          className="text-base md:text-lg p-4"
        />
        <FormField
          label="County"
          name="county"
          value={formData.county}
          onChange={handleChange}
          required
          error={errors.county}
          className="text-base md:text-lg p-4"
        />
        <Select
          label="State"
          id="state"
          name="state"
          value={formData.state}
          onChange={onChange}
          required
          selectSize="lg"
          placeholder="Select State"
          error={!!errors.state}
          hint={errors.state}
          options={STATES.map((state) => ({ value: state.value, label: state.label }))}
        />
          </select>
          {errors.state && (
            <p id="state-error" className="mt-2 text-sm md:text-base text-red-600" role="alert">
              {errors.state}
            </p>
          )}
        </div>
        <FormField
          label="ZIP"
          name="zip"
          value={formData.zip}
          onChange={handleChange}
          required
          error={errors.zip}
          className="text-base md:text-lg p-4"
        />
      </div>
    </div>
  );
};
