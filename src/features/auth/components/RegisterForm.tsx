import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Select } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { emailService } from '@/services/emailService';

// Strong password validation
const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Full name is required'),
  role: z.enum(['staff', 'volunteer'], { errorMap: () => ({ message: 'Please select a role' }) }),
  phone: z.string().optional(),
  volunteerStartDate: z.string().optional(),
  notes: z.string().optional(),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    fullName: '',
    role: 'volunteer',
    phone: '',
    volunteerStartDate: '',
    notes: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // DEV TOOL: Auto-fill function for testing (accessible from console)
  useEffect(() => {
    (window as Window & { fillRegisterForm?: () => void }).fillRegisterForm = () => {
      const testData = {
        email: 'adanzamora2005@gmail.com',
        fullName: 'Adan Zamora',
        role: 'staff' as const,
        phone: '479-555-0123',
        volunteerStartDate: new Date().toISOString().split('T')[0],
        notes: 'Test registration for development',
        password: 'TestPassword123!@#',
        confirmPassword: 'TestPassword123!@#',
      };
      setFormData(testData);
      console.log('✅ Registration form auto-filled!', testData);
    };

    return () => {
      delete (window as Window & { fillRegisterForm?: () => void }).fillRegisterForm;
    };
  }, []);

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form
      const validated = registerSchema.parse(formData);

      // Register with Supabase Auth (automatically sends verification email)
      const result = await emailService.registerUserWithEmail(
        validated.email,
        validated.password,
        {
          full_name: validated.fullName,
          role: validated.role,
          phone: validated.phone,
          volunteer_start_date: validated.volunteerStartDate,
          notes: validated.notes,
        }
      );

      if (!result.success) {
        toast.error('Registration failed. Please try again.');
        return;
      }

      // Create pending user record in database
      const { error: pendingError } = await supabase.rpc('register_user', {
        user_email: validated.email,
        user_full_name: validated.fullName,
        user_role: validated.role,
        user_phone: validated.phone || null,
        user_notes: validated.notes || null,
        start_date: validated.volunteerStartDate || null,
      });

      if (pendingError) {
        console.error('Error creating pending user:', pendingError);
        // Continue anyway - auth user is created
      }

      // Show success message
      setRegistrationComplete(true);
      toast.success('Verification email sent! Please check your inbox.');

    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please fix the errors in the form');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Support House
            </h1>
            <p className="mt-2 text-sm text-purple-600 font-medium">Patient Management System</p>
          </div>
          
          <Card className="shadow-xl border-purple-100">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
              <p className="text-gray-600 mb-4">
                Please check your email to verify your address. Once verified, your registration will be reviewed by an administrator.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                You'll receive an email notification once your account is approved.
              </p>
              <a
                href="/login"
                className="inline-block text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Back to Login
              </a>
            </div>
          </Card>
          
          <p className="mt-6 text-center text-sm text-purple-600">
            💜 Caring for those who need it most
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Support House
          </h1>
          <p className="mt-2 text-sm text-purple-600 font-medium">Patient Management System</p>
        </div>
        
        <Card className="shadow-xl border-purple-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Request Access 🔐</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Submit your registration request. An administrator will review and approve your account.
          </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="volunteer">Volunteer</option>
            <option value="staff">Staff</option>
          </select>
          {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
          <p className="text-sm text-gray-500 mt-1">
            Staff: Primary users with full access. Volunteer: Intake and check-in access.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="555-123-4567"
          />
        </div>

        {/* Volunteer Start Date */}
        {formData.role === 'volunteer' && (
          <div>
            <label htmlFor="volunteerStartDate" className="block text-sm font-medium text-gray-700 mb-1">
              Volunteer Start Date
            </label>
            <input
              id="volunteerStartDate"
              type="date"
              value={formData.volunteerStartDate}
              onChange={(e) => handleChange('volunteerStartDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Why do you need access?
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Briefly explain why you need access to the system..."
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          <p className="text-sm text-gray-500 mt-1">
            Must be 12+ characters with uppercase, lowercase, number, and special character
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password *
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </div>

        <p className="text-sm text-gray-500 text-center">
          Already have an account? <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium">Sign in</a>
        </p>
      </form>
    </Card>
    
    <p className="mt-6 text-center text-sm text-purple-600">
      💜 Caring for those who need it most
    </p>
      </div>
    </div>
  );
}
