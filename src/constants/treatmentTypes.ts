export const TREATMENT_TYPES = [
  { value: 'iv', label: 'IV' },
  { value: 'oral', label: 'Oral' },
  { value: 'pump_bag', label: 'Pump/Bag' },
] as const;

export type TreatmentType = typeof TREATMENT_TYPES[number]['value'];
