import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { SelectField } from '@/components/forms/SelectField';
import { STATES } from '@/constants/states';
import { RELATIONSHIPS } from '@/constants/relationships';
import type { EmergencyContact } from '../../types';

interface EmergencyContactSectionProps {
  formData: {
    emergency_contact: EmergencyContact;
  };
  onChange: (field: string, value: EmergencyContact) => void;
  errors: Record<string, string>;
}

export const EmergencyContactSection: React.FC<EmergencyContactSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleFieldChange = (field: keyof EmergencyContact, value: string) => {
    onChange('emergency_contact', {
      ...formData.emergency_contact,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Emergency Contact</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Name"
          name="emergency_contact.name"
          value={formData.emergency_contact.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          required
          error={errors['emergency_contact.name']}
          className="text-base md:text-lg p-4"
        />
        <SelectField
          label="Relationship"
          name="emergency_contact.relationship"
          value={formData.emergency_contact.relationship}
          onChange={(e) => handleFieldChange('relationship', e.target.value)}
          options={RELATIONSHIPS}
          placeholder="Select Relationship"
          required
          error={errors['emergency_contact.relationship']}
          className="text-base md:text-lg p-4"
        />
      </div>

      <FormField
        label="Address"
        name="emergency_contact.address"
        value={formData.emergency_contact.address}
        onChange={(e) => handleFieldChange('address', e.target.value)}
        required
        error={errors['emergency_contact.address']}
        className="text-base md:text-lg p-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FormField
          label="City"
          name="emergency_contact.city"
          value={formData.emergency_contact.city}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          required
          error={errors['emergency_contact.city']}
          className="text-base md:text-lg p-4"
        />
        <SelectField
          label="State"
          name="emergency_contact.state"
          value={formData.emergency_contact.state}
          onChange={(e) => handleFieldChange('state', e.target.value)}
          options={STATES}
          placeholder="Select State"
          required
          error={errors['emergency_contact.state']}
          className="text-base md:text-lg p-4"
        />
        <FormField
          label="ZIP"
          name="emergency_contact.zip"
          value={formData.emergency_contact.zip}
          onChange={(e) => handleFieldChange('zip', e.target.value)}
          required
          error={errors['emergency_contact.zip']}
          className="text-base md:text-lg p-4"
        />
        <FormField
          label="Phone"
          name="emergency_contact.phone"
          type="tel"
          value={formData.emergency_contact.phone}
          onChange={(e) => handleFieldChange('phone', e.target.value)}
          required
          error={errors['emergency_contact.phone']}
          placeholder="555-123-4567"
          className="text-base md:text-lg p-4"
        />
      </div>
    </div>
  );
};
