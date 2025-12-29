export const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'every', label: 'Every X Weeks' },
  { value: 'monthly', label: 'Monthly' },
] as const;

export type Frequency = typeof FREQUENCIES[number]['value'];
