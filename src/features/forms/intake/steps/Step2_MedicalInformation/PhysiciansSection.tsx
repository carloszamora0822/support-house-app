import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/ui/select';
import { FormField } from '@/components/forms/FormField';
import {
  PHYSICIANS,
  PHYSICIAN_GROUPS,
  PHYSICIAN_LOCATIONS,
  getMercyOncologists,
  getMercyRadiation,
  getBaptistOncologists,
  getBaptistRadiation,
} from '@/constants/physicians';
import type { SelectedPhysician, CustomPhysician } from '../../types';
import type { MedicalInformationInput } from '../../schemas/medicalSchema';

interface PhysiciansSectionProps {
  formData: MedicalInformationInput;
  onChange: (field: string, value: SelectedPhysician[] | CustomPhysician[]) => void;
  errors: Record<string, string>;
}

const CustomPhysicianForm: React.FC<{
  physician: CustomPhysician;
  index: number;
  customLocations: string[];
  onCustomLocationsChange: (locations: string[]) => void;
  onChange: (index: number, updatedItem: CustomPhysician) => void;
  onRemove: (index: number) => void;
  errors: Record<string, string>;
}> = ({ physician, index, customLocations, onCustomLocationsChange, onChange, onRemove, errors }) => {
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [newLocation, setNewLocation] = useState('');

  const handleLocationChange = (value: string) => {
    if (value === 'other') {
      setShowCustomLocation(true);
    } else {
      setShowCustomLocation(false);
      onChange(index, { ...physician, location: value });
    }
  };

  const handleAddCustomLocation = () => {
    if (newLocation.trim()) {
      onCustomLocationsChange([...customLocations, newLocation.trim()]);
      onChange(index, { ...physician, location: newLocation.trim() });
      setNewLocation('');
      setShowCustomLocation(false);
    }
  };

  const allLocations = [...PHYSICIAN_LOCATIONS, ...customLocations];
  const isStandardLocation = physician.location && PHYSICIAN_LOCATIONS.includes(physician.location as any);

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Physician Name"
          name="name"
          value={physician.name || ''}
          onChange={(e) => onChange(index, { ...physician, name: e.target.value })}
          error={errors[`custom_physicians.${index}.name`]}
          required
          className="text-base md:text-lg"
        />
        
        <div>
          {!showCustomLocation ? (
            <Select
              label="Location"
              value={physician.location || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
              required
              placeholder="Select Location"
              options={[
                ...PHYSICIAN_LOCATIONS.map(loc => ({ value: loc, label: loc })),
                { value: 'other', label: 'Other (Specify)' }
              ]}
            />
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter new location"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={handleAddCustomLocation}
                className="px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowCustomLocation(false)}
                className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
          {errors[`custom_physicians.${index}.location`] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[`custom_physicians.${index}.location`]}
            </p>
          )}
        </div>

        {!isStandardLocation && physician.location && (
          <>
            <FormField
              label="Phone Number (Optional)"
              name="phone"
              value={physician.phone || ''}
              onChange={(e) => onChange(index, { ...physician, phone: e.target.value })}
              error={errors[`custom_physicians.${index}.phone`]}
              className="text-base md:text-lg"
            />
            <FormField
              label="Fax Number (Optional)"
              name="fax"
              value={physician.fax || ''}
              onChange={(e) => onChange(index, { ...physician, fax: e.target.value })}
              error={errors[`custom_physicians.${index}.fax`]}
              className="text-base md:text-lg"
            />
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Remove Physician
      </button>
    </div>
  );
};

export const PhysiciansSection: React.FC<PhysiciansSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const [customLocations, setCustomLocations] = useState<string[]>([]);

  // Reset custom locations when component unmounts or form is cleared
  React.useEffect(() => {
    return () => {
      setCustomLocations([]);
    };
  }, []);

  const handlePhysicianSelect = (
    category: keyof Pick<MedicalInformationInput, 'mercy_oncologists' | 'mercy_radiation' | 'baptist_oncologists' | 'baptist_radiation'>,
    physicianName: string
  ) => {
    const currentList = formData[category] || [];
    const physician = PHYSICIANS.find((p) => p.name === physicianName);
    
    if (!physician) return;

    const isSelected = currentList.some((p) => p.name === physicianName);
    
    if (isSelected) {
      onChange(
        category,
        currentList.filter((p) => p.name !== physicianName)
      );
    } else {
      onChange(category, [
        ...currentList,
        {
          name: physician.name,
          location: `${physician.location} - ${physician.specialty}`,
          phone: physician.phone,
          fax: physician.fax,
        },
      ]);
    }
  };

  const renderPhysicianGroup = (
    groupIndex: number,
    category: keyof Pick<MedicalInformationInput, 'mercy_oncologists' | 'mercy_radiation' | 'baptist_oncologists' | 'baptist_radiation'>
  ) => {
    const group = PHYSICIAN_GROUPS[groupIndex];
    const selectedList = formData[category] || [];
    const physicians = [
      getMercyOncologists(),
      getMercyRadiation(),
      getBaptistOncologists(),
      getBaptistRadiation(),
    ][groupIndex];
    
    return (
      <div className="space-y-3">
        <div>
          <h4 className="text-lg md:text-xl font-semibold text-gray-800">{group.title}</h4>
          <div className="text-sm text-gray-600 mt-1">
            Phone: {group.phone} | Fax: {group.fax}
          </div>
        </div>
        <div className="space-y-2 pl-2">
          {physicians.map((physician) => {
            const isChecked = selectedList.some((p) => p.name === physician.name);
            
            return (
              <div key={physician.name} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`${category}-${physician.name}`}
                  checked={isChecked}
                  onChange={() => handlePhysicianSelect(category, physician.name)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                />
                <label
                  htmlFor={`${category}-${physician.name}`}
                  className="text-gray-900 cursor-pointer"
                >
                  {physician.name}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleCustomPhysicianChange = (index: number, updatedPhysician: CustomPhysician) => {
    const updatedList = (formData.custom_physicians || []).map((p, i) =>
      i === index ? updatedPhysician : p
    );
    onChange('custom_physicians', updatedList);
  };

  const handleRemoveCustomPhysician = (index: number) => {
    const updatedList = (formData.custom_physicians || []).filter((_, i) => i !== index);
    onChange('custom_physicians', updatedList);
  };

  const handleAddCustomPhysician = () => {
    const newPhysician: CustomPhysician = {
      name: '',
      location: '',
      phone: '',
      fax: '',
    };
    onChange('custom_physicians', [...(formData.custom_physicians || []), newPhysician]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          Physicians
        </h3>
        <p className="text-gray-600 text-sm md:text-base">
          Select all physicians involved in patient care. You can also add custom physicians not listed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderPhysicianGroup(0, 'mercy_oncologists')}
        {renderPhysicianGroup(1, 'mercy_radiation')}
        {renderPhysicianGroup(2, 'baptist_oncologists')}
        {renderPhysicianGroup(3, 'baptist_radiation')}
      </div>

      <div className="border-t-2 border-gray-200 pt-6">
        <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Other Physicians</h4>
        <p className="text-gray-600 text-sm mb-4">
          Add physicians from the 4 locations above who aren't listed, or physicians from other locations.
          <span className="block mt-1 text-xs text-gray-500">
            Note: Phone/fax only required for custom locations outside the 4 standard locations.
          </span>
        </p>
        
        <div className="space-y-4">
          {(formData.custom_physicians || []).map((physician, index) => (
            <CustomPhysicianForm
              key={index}
              physician={physician}
              index={index}
              customLocations={customLocations}
              onCustomLocationsChange={setCustomLocations}
              onChange={handleCustomPhysicianChange}
              onRemove={handleRemoveCustomPhysician}
              errors={errors}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddCustomPhysician}
          className="mt-4 px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          + Add Other Physician
        </button>
      </div>
    </div>
  );
};
