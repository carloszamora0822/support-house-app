export const ETHNICITIES = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black or African American' },
  { value: 'hispanic_latino', label: 'Hispanic or Latino' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'american_indian', label: 'American Indian or Alaska Native' },
  { value: 'asian', label: 'Asian' },
  { value: 'pacific_islander', label: 'Native Hawaiian or Pacific Islander' },
  { value: 'other', label: 'Other' },
] as const;

export type Ethnicity = typeof ETHNICITIES[number]['value'];
