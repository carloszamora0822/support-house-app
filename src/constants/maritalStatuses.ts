export const MARITAL_STATUSES = [
  { value: 'married', label: 'Married' },
  { value: 'single', label: 'Single' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
  { value: 'divorced', label: 'Divorced' },
] as const;

export type MaritalStatus = typeof MARITAL_STATUSES[number]['value'];
