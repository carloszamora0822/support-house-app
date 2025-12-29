export const ONCOLOGISTS_MERCY = [
  { value: 'reddy', label: 'Dr. Reddy' },
  { value: 'mackey', label: 'Dr. Mackey' },
  { value: 'samman', label: 'Dr. Samman' },
  { value: 'shrestha', label: 'Dr. Shrestha' },
] as const;

export const ONCOLOGISTS_BAPTIST = [
  { value: 'arzoumanian', label: 'Dr. Arzoumanian' },
] as const;

export type OncologistMercy = typeof ONCOLOGISTS_MERCY[number]['value'];
export type OncologistBaptist = typeof ONCOLOGISTS_BAPTIST[number]['value'];
