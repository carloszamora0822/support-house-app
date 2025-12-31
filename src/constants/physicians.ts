export interface Physician {
  name: string;
  specialty: 'Oncology' | 'Radiation';
  location: 'Mercy' | 'Baptist';
  phone: string;
  fax: string;
}

export interface PhysicianGroup {
  title: string;
  phone: string;
  fax: string;
  physicians: string[];
}

export const PHYSICIAN_LOCATIONS = [
  'Mercy Oncology',
  'Mercy Radiation',
  'Baptist Oncology',
  'Baptist Radiation',
] as const;

export const PHYSICIANS: Physician[] = [
  // Mercy Oncologists
  {
    name: 'Dr. Samman',
    specialty: 'Oncology',
    location: 'Mercy',
    phone: '4793147494',
    fax: '4793147490',
  },
  {
    name: 'Dr. Reddy',
    specialty: 'Oncology',
    location: 'Mercy',
    phone: '4793147494',
    fax: '4793147490',
  },
  {
    name: 'Dr. Shrestha',
    specialty: 'Oncology',
    location: 'Mercy',
    phone: '4793147494',
    fax: '4793147490',
  },
  {
    name: 'Dr. Mackey',
    specialty: 'Oncology',
    location: 'Mercy',
    phone: '4793147494',
    fax: '4793147490',
  },
  {
    name: 'Dr. Summa',
    specialty: 'Oncology',
    location: 'Mercy',
    phone: '4793147494',
    fax: '4793147490',
  },
  // Mercy Radiation
  {
    name: 'Dr. Smith',
    specialty: 'Radiation',
    location: 'Mercy',
    phone: '4794841640',
    fax: '4797546',
  },
  {
    name: 'Dr. McKeever',
    specialty: 'Radiation',
    location: 'Mercy',
    phone: '4794841640',
    fax: '4793147546',
  },
  // Baptist Oncologists
  {
    name: 'Dr. Arzoumanian',
    specialty: 'Oncology',
    location: 'Baptist',
    phone: '4797097437',
    fax: '4797097190',
  },
  // Baptist Radiation
  {
    name: 'Dr. Schroyer',
    specialty: 'Radiation',
    location: 'Baptist',
    phone: '479709',
    fax: '4797097190',
  },
];

export const getMercyOncologists = () =>
  PHYSICIANS.filter((p) => p.location === 'Mercy' && p.specialty === 'Oncology');

export const getMercyRadiation = () =>
  PHYSICIANS.filter((p) => p.location === 'Mercy' && p.specialty === 'Radiation');

export const getBaptistOncologists = () =>
  PHYSICIANS.filter((p) => p.location === 'Baptist' && p.specialty === 'Oncology');

export const getBaptistRadiation = () =>
  PHYSICIANS.filter((p) => p.location === 'Baptist' && p.specialty === 'Radiation');

// Get group info with contact details
export const PHYSICIAN_GROUPS: PhysicianGroup[] = [
  {
    title: 'Mercy Oncologists',
    phone: '4793147494',
    fax: '4793147490',
    physicians: getMercyOncologists().map((p) => p.name),
  },
  {
    title: 'Mercy Radiation Oncologists',
    phone: '4794841640',
    fax: '4797546',
    physicians: getMercyRadiation().map((p) => p.name),
  },
  {
    title: 'Baptist Oncologists',
    phone: '4797097437',
    fax: '4797097190',
    physicians: getBaptistOncologists().map((p) => p.name),
  },
  {
    title: 'Baptist Radiation Oncologists',
    phone: '479709',
    fax: '4797097190',
    physicians: getBaptistRadiation().map((p) => p.name),
  },
];
