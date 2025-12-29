export const EDUCATION_LEVELS = [
  { value: 'less_than_hs', label: 'Less than High School' },
  { value: 'ged', label: 'GED' },
  { value: 'hs_grad', label: 'High School Graduate' },
  { value: 'some_college', label: 'Some College' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelors', label: 'Bachelor\'s Degree' },
  { value: 'post_grad', label: 'Post-Graduate Degree' },
] as const;

export type EducationLevel = typeof EDUCATION_LEVELS[number]['value'];
