/**
 * Mock user data for testing authentication and authorization
 * Covers all 3 user roles: admin, staff, viewer
 */

export const mockUsers = [
  {
    id: 'staff-001',
    email: 'sarah.johnson@supporthouse.org',
    role: 'staff',
    full_name: 'Sarah Johnson',
    is_active: true,
    created_at: new Date('2023-01-15T08:00:00'),
    last_login: new Date('2024-12-28T08:30:00'),
  },
  {
    id: 'staff-002',
    email: 'mike.davis@supporthouse.org',
    role: 'staff',
    full_name: 'Mike Davis',
    is_active: true,
    created_at: new Date('2023-02-01T08:00:00'),
    last_login: new Date('2024-12-27T09:00:00'),
  },
  {
    id: 'admin-001',
    email: 'admin@supporthouse.org',
    role: 'admin',
    full_name: 'Admin User',
    is_active: true,
    created_at: new Date('2023-01-01T08:00:00'),
    last_login: new Date('2024-12-28T07:45:00'),
  },
  {
    id: 'viewer-001',
    email: 'viewer@supporthouse.org',
    role: 'viewer',
    full_name: 'Viewer User',
    is_active: true,
    created_at: new Date('2023-03-01T08:00:00'),
    last_login: new Date('2024-12-26T10:00:00'),
  },
  {
    id: 'staff-003',
    email: 'inactive.staff@supporthouse.org',
    role: 'staff',
    full_name: 'Inactive Staff',
    is_active: false,
    created_at: new Date('2023-01-20T08:00:00'),
    last_login: new Date('2024-06-15T14:00:00'),
  },
];

export default mockUsers;
