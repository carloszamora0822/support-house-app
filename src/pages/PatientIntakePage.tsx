import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export const PatientIntakePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="border-pink-200 hover:bg-pink-50"
              >
                ← Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-pink-200"></div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                New Patient Intake
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg border border-pink-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Intake Form</h2>
            <p className="text-gray-600">Register a new patient in the system</p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              Sprint 4 Components Built
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <span className="font-medium text-gray-900">9 Form Sections</span>
                  <p className="text-gray-600 text-xs">Identity, Demographics, Insurance, Employment, Marital, Children, Emergency Contact, Referral, Certification</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <span className="font-medium text-gray-900">6 Form Molecules</span>
                  <p className="text-gray-600 text-xs">FormField, ConditionalSection, DynamicList, ProgressIndicator, CheckboxGroup, RadioGroup</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <span className="font-medium text-gray-900">221 Tests Passing</span>
                  <p className="text-gray-600 text-xs">100% test coverage with TDD approach</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <span className="font-medium text-gray-900">Zod Validation</span>
                  <p className="text-gray-600 text-xs">Complete schema validation with 50 test cases</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-2xl">🚧</span>
              Integration In Progress
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              All form components are built and tested. The next step is to compose them into the multi-step form container.
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• <strong>Next:</strong> Build IntakeFormContainer to orchestrate all sections</p>
              <p>• <strong>Then:</strong> Wire up form submission to Supabase</p>
              <p>• <strong>Finally:</strong> Add success/error handling and navigation</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              Back to Dashboard
            </Button>
            <Button 
              variant="primary"
              disabled
              className="flex-1 opacity-50 cursor-not-allowed"
            >
              Start Intake (Coming Soon)
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
