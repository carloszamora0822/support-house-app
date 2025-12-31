import React from 'react';
import { DynamicList } from '@/components/forms/DynamicList';
import { FormField } from '@/components/forms/FormField';
import type { Surgery, ChemoCycle, RadiationTreatment } from '../../types';

interface TreatmentHistorySectionProps {
  formData: {
    surgeries?: Surgery[];
    chemo_cycles?: ChemoCycle[];
    radiation_treatments?: RadiationTreatment[];
    treatment_other?: string;
  };
  onChange: (field: string, value: Surgery[] | ChemoCycle[] | RadiationTreatment[] | string) => void;
  errors: Record<string, string>;
}

export const TreatmentHistorySection: React.FC<TreatmentHistorySectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const renderSurgery = (
    surgery: Surgery,
    index: number,
    onSurgeryChange: (index: number, updated: Surgery) => void,
    onRemove: (index: number) => void
  ) => {
    return (
      <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Surgery Date"
            name={`surgeries.${index}.date`}
            type="date"
            value={surgery.date}
            onChange={(e) => onSurgeryChange(index, { ...surgery, date: e.target.value })}
            error={errors[`surgeries.${index}.date`]}
            required
            className="text-base md:text-lg p-4"
          />
          <FormField
            label="Notes (Optional)"
            name={`surgeries.${index}.notes`}
            value={surgery.notes || ''}
            onChange={(e) => onSurgeryChange(index, { ...surgery, notes: e.target.value })}
            error={errors[`surgeries.${index}.notes`]}
            placeholder="e.g., Lumpectomy, Mastectomy"
            className="text-base md:text-lg p-4"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800 text-sm md:text-base font-medium"
        >
          Remove Surgery
        </button>
      </div>
    );
  };

  const renderChemoCycle = (
    cycle: ChemoCycle,
    index: number,
    onCycleChange: (index: number, updated: ChemoCycle) => void,
    onRemove: (index: number) => void
  ) => {
    return (
      <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Start Date"
            name={`chemo_cycles.${index}.start_date`}
            type="date"
            value={cycle.start_date}
            onChange={(e) => onCycleChange(index, { ...cycle, start_date: e.target.value })}
            error={errors[`chemo_cycles.${index}.start_date`]}
            required
            className="text-base md:text-lg p-4"
          />
          <FormField
            label="End Date"
            name={`chemo_cycles.${index}.end_date`}
            type="date"
            value={cycle.end_date}
            onChange={(e) => onCycleChange(index, { ...cycle, end_date: e.target.value })}
            error={errors[`chemo_cycles.${index}.end_date`]}
            required
            className="text-base md:text-lg p-4"
          />
          <FormField
            label="Notes (Optional)"
            name={`chemo_cycles.${index}.notes`}
            value={cycle.notes || ''}
            onChange={(e) => onCycleChange(index, { ...cycle, notes: e.target.value })}
            error={errors[`chemo_cycles.${index}.notes`]}
            placeholder="e.g., AC regimen"
            className="text-base md:text-lg p-4"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800 text-sm md:text-base font-medium"
        >
          Remove Chemo Cycle
        </button>
      </div>
    );
  };

  const renderRadiation = (
    radiation: RadiationTreatment,
    index: number,
    onRadiationChange: (index: number, updated: RadiationTreatment) => void,
    onRemove: (index: number) => void
  ) => {
    return (
      <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Start Date"
            name={`radiation_treatments.${index}.start_date`}
            type="date"
            value={radiation.start_date}
            onChange={(e) => onRadiationChange(index, { ...radiation, start_date: e.target.value })}
            error={errors[`radiation_treatments.${index}.start_date`]}
            required
            className="text-base md:text-lg p-4"
          />
          <FormField
            label="End Date"
            name={`radiation_treatments.${index}.end_date`}
            type="date"
            value={radiation.end_date}
            onChange={(e) => onRadiationChange(index, { ...radiation, end_date: e.target.value })}
            error={errors[`radiation_treatments.${index}.end_date`]}
            required
            className="text-base md:text-lg p-4"
          />
          <FormField
            label="Notes (Optional)"
            name={`radiation_treatments.${index}.notes`}
            value={radiation.notes || ''}
            onChange={(e) => onRadiationChange(index, { ...radiation, notes: e.target.value })}
            error={errors[`radiation_treatments.${index}.notes`]}
            placeholder="e.g., Breast radiation"
            className="text-base md:text-lg p-4"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800 text-sm md:text-base font-medium"
        >
          Remove Radiation Treatment
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Treatment History</h3>

      {/* Surgeries */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">Surgeries (Optional)</h4>
        <DynamicList
          items={formData.surgeries || []}
          onItemsChange={(items) => onChange('surgeries', items)}
          renderItem={renderSurgery}
          addButtonText="+ Add Surgery"
          emptyItem={{ date: '', notes: '' }}
          emptyMessage="No surgeries added yet. Click 'Add Surgery' to add one."
        />
      </div>

      {/* Chemotherapy Cycles */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">Chemotherapy Cycles (Optional)</h4>
        <DynamicList
          items={formData.chemo_cycles || []}
          onItemsChange={(items) => onChange('chemo_cycles', items)}
          renderItem={renderChemoCycle}
          addButtonText="+ Add Chemo Cycle"
          emptyItem={{ start_date: '', end_date: '', notes: '' }}
          emptyMessage="No chemo cycles added yet. Click 'Add Chemo Cycle' to add one."
        />
      </div>

      {/* Radiation Treatments */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">Radiation Treatments (Optional)</h4>
        <DynamicList
          items={formData.radiation_treatments || []}
          onItemsChange={(items) => onChange('radiation_treatments', items)}
          renderItem={renderRadiation}
          addButtonText="+ Add Radiation Treatment"
          emptyItem={{ start_date: '', end_date: '', notes: '' }}
          emptyMessage="No radiation treatments added yet. Click 'Add Radiation Treatment' to add one."
        />
      </div>

      {/* Other Treatment */}
      <div className="border-t-2 border-gray-200 pt-8">
        <FormField
          label="Other Treatment (Optional)"
          name="treatment_other"
          value={formData.treatment_other || ''}
          onChange={(e) => onChange('treatment_other', e.target.value)}
          multiline
          rows={4}
          error={errors.treatment_other}
          helperText="Any other treatments not listed above"
          className="text-base md:text-lg p-4"
        />
      </div>
    </div>
  );
};
