export const INSURANCE_TYPES = [
  { value: 'private', label: 'Private Insurance' },
  { value: 'medicaid', label: 'Medicaid' },
  { value: 'medicare', label: 'Medicare' },
] as const;

export type InsuranceType = typeof INSURANCE_TYPES[number]['value'];
