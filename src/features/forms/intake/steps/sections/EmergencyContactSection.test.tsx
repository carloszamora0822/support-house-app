import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmergencyContactSection } from './EmergencyContactSection';

describe('EmergencyContactSection', () => {
  const mockFormData = {
    emergency_contact: {
      name: '',
      relationship: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
    },
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <EmergencyContactSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /emergency contact/i })).toBeInTheDocument();
  });

  it('renders all emergency contact fields', () => {
    render(
      <EmergencyContactSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/relationship/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('displays field values', () => {
    const dataWithContact = {
      emergency_contact: {
        name: 'John Doe',
        relationship: 'Brother',
        address: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        phone: '555-1234',
      },
    };

    render(
      <EmergencyContactSection
        formData={dataWithContact}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Brother')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Austin')).toBeInTheDocument();
  });

  it('displays errors', () => {
    const errorsWithContact = {
      'emergency_contact.name': 'Name is required',
      'emergency_contact.phone': 'Phone is required',
    };

    render(
      <EmergencyContactSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={errorsWithContact}
      />
    );

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Phone is required')).toBeInTheDocument();
  });
});
