export const EMPLOYMENT_STATUSES = [
  { value: 'employed', label: 'Employed' },
  { value: 'retired', label: 'Retired' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'other', label: 'Other' },
] as const;

export type EmploymentStatus = typeof EMPLOYMENT_STATUSES[number]['value'];
