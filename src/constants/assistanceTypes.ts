export const ASSISTANCE_TYPES = [
  { value: 'wigs_salon', label: 'Wigs/Salon' },
  { value: 'food', label: 'Food' },
  { value: 'medical_supplies', label: 'Medical Supplies' },
  { value: 'liquid_nutrition', label: 'Liquid Nutrition' },
  { value: 'incontinence_supplies', label: 'Incontinence Supplies' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'gas_card', label: 'Gas Card' },
  { value: 'support_group', label: 'Support Group' },
  { value: 'other', label: 'Other' },
] as const;

export type AssistanceType = typeof ASSISTANCE_TYPES[number]['value'];
