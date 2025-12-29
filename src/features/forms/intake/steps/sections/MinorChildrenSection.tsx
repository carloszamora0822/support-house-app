import React from 'react';
import { DynamicList } from '@/components/forms/DynamicList';
import { FormField } from '@/components/forms/FormField';
import { RadioGroup } from '@/components/forms/RadioGroup';
import type { MinorChild } from '../../types';

const SEX_OPTIONS = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
];

interface MinorChildrenSectionProps {
  formData: {
    minor_children: MinorChild[];
  };
  onChange: (field: string, value: MinorChild[]) => void;
  errors: Record<string, string>;
}

export const MinorChildrenSection: React.FC<MinorChildrenSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const renderChild = (
    child: MinorChild,
    index: number,
    onChildChange: (index: number, updatedChild: MinorChild) => void,
    onRemove: (index: number) => void
  ) => {
    return (
      <div className="border border-gray-200 rounded-md p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Name"
            name={`minor_children.${index}.name`}
            value={child.name || ''}
            onChange={(e) => onChildChange(index, { ...child, name: e.target.value })}
            error={errors[`minor_children.${index}.name`]}
          />
          <FormField
            label="Date of Birth"
            name={`minor_children.${index}.dob`}
            type="date"
            value={child.dob}
            onChange={(e) => onChildChange(index, { ...child, dob: e.target.value })}
            error={errors[`minor_children.${index}.dob`]}
          />
          <RadioGroup
            label="Sex"
            name={`minor_children.${index}.sex`}
            options={SEX_OPTIONS}
            value={child.sex}
            onChange={(value) => onChildChange(index, { ...child, sex: value as 'M' | 'F' })}
            error={errors[`minor_children.${index}.sex`]}
            horizontal
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Remove Child
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Minor Children</h3>

      <DynamicList
        items={formData.minor_children}
        onItemsChange={(items) => onChange('minor_children', items)}
        renderItem={renderChild}
        addButtonText="Add Child"
        emptyItem={{ name: '', dob: '', sex: 'M' }}
        emptyMessage="No minor children added yet"
      />
    </div>
  );
};
