export const REFERRAL_SOURCES = [
  { value: 'hospital_clinic_staff', label: 'Hospital/Clinic Staff' },
  { value: 'friend_family', label: 'Friend/Family' },
  { value: 'newspaper', label: 'Newspaper' },
  { value: 'clinic_gift_bags', label: 'Clinic Gift Bags' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'other', label: 'Other' },
] as const;

export type ReferralSource = typeof REFERRAL_SOURCES[number]['value'];
