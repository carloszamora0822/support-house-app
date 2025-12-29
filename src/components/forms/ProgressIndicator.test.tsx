import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressIndicator } from './ProgressIndicator';

describe('ProgressIndicator', () => {
  describe('Rendering Steps', () => {
    it('renders all steps', () => {
      const steps = [
        { id: 1, title: 'Patient Info', isComplete: false, isActive: true },
        { id: 2, title: 'Medical Info', isComplete: false, isActive: false },
        { id: 3, title: 'Disclosure', isComplete: false, isActive: false },
      ];

      render(<ProgressIndicator steps={steps} />);

      expect(screen.getByText('Patient Info')).toBeInTheDocument();
      expect(screen.getByText('Medical Info')).toBeInTheDocument();
      expect(screen.getByText('Disclosure')).toBeInTheDocument();
    });

    it('renders step numbers', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: false, isActive: true },
        { id: 2, title: 'Step 2', isComplete: false, isActive: false },
      ];

      render(<ProgressIndicator steps={steps} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Active Step', () => {
    it('highlights active step', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: false, isActive: false },
        { id: 2, title: 'Step 2', isComplete: false, isActive: true },
        { id: 3, title: 'Step 3', isComplete: false, isActive: false },
      ];

      const { container } = render(<ProgressIndicator steps={steps} />);
      
      const stepCircles = container.querySelectorAll('[data-step]');
      expect(stepCircles[1]).toHaveClass('bg-blue-600');
    });

    it('shows only one active step', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: false, isActive: true },
        { id: 2, title: 'Step 2', isComplete: false, isActive: false },
      ];

      const { container } = render(<ProgressIndicator steps={steps} />);
      
      const activeSteps = container.querySelectorAll('.bg-blue-600');
      expect(activeSteps).toHaveLength(1);
    });
  });

  describe('Completed Steps', () => {
    it('shows checkmark for completed steps', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: true, isActive: false },
        { id: 2, title: 'Step 2', isComplete: false, isActive: true },
      ];

      const { container } = render(<ProgressIndicator steps={steps} />);
      
      const completedSteps = container.querySelectorAll('[data-step="1"]');
      expect(completedSteps[0]).toHaveClass('bg-green-600');
    });

    it('applies completed styling to multiple completed steps', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: true, isActive: false },
        { id: 2, title: 'Step 2', isComplete: true, isActive: false },
        { id: 3, title: 'Step 3', isComplete: false, isActive: true },
      ];

      const { container } = render(<ProgressIndicator steps={steps} />);
      
      const completedSteps = container.querySelectorAll('.bg-green-600');
      expect(completedSteps.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Incomplete Steps', () => {
    it('shows gray styling for incomplete steps', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: false, isActive: true },
        { id: 2, title: 'Step 2', isComplete: false, isActive: false },
        { id: 3, title: 'Step 3', isComplete: false, isActive: false },
      ];

      const { container } = render(<ProgressIndicator steps={steps} />);
      
      const incompleteSteps = container.querySelectorAll('[data-step="2"], [data-step="3"]');
      incompleteSteps.forEach(step => {
        expect(step).toHaveClass('bg-gray-300');
      });
    });
  });

  describe('Connector Lines', () => {
    it('renders connector lines between steps', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: false, isActive: true },
        { id: 2, title: 'Step 2', isComplete: false, isActive: false },
        { id: 3, title: 'Step 3', isComplete: false, isActive: false },
      ];

      const { container } = render(<ProgressIndicator steps={steps} />);
      
      const connectors = container.querySelectorAll('[data-connector]');
      expect(connectors.length).toBe(2); // 3 steps = 2 connectors
    });

    it('highlights connector for completed steps', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: true, isActive: false },
        { id: 2, title: 'Step 2', isComplete: false, isActive: true },
      ];

      const { container } = render(<ProgressIndicator steps={steps} />);
      
      const connectors = container.querySelectorAll('[data-connector]');
      expect(connectors[0]).toHaveClass('bg-green-600');
    });
  });

  describe('Step States', () => {
    it('handles all steps incomplete', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: false, isActive: true },
        { id: 2, title: 'Step 2', isComplete: false, isActive: false },
      ];

      const { container } = render(<ProgressIndicator steps={steps} />);
      
      const completedSteps = container.querySelectorAll('.bg-green-600');
      expect(completedSteps).toHaveLength(0);
    });

    it('handles all steps complete', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: true, isActive: false },
        { id: 2, title: 'Step 2', isComplete: true, isActive: false },
        { id: 3, title: 'Step 3', isComplete: true, isActive: false },
      ];

      const { container } = render(<ProgressIndicator steps={steps} />);
      
      const completedSteps = container.querySelectorAll('.bg-green-600');
      expect(completedSteps.length).toBeGreaterThanOrEqual(3);
    });

    it('handles mixed completion states', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: true, isActive: false },
        { id: 2, title: 'Step 2', isComplete: false, isActive: true },
        { id: 3, title: 'Step 3', isComplete: false, isActive: false },
      ];

      render(<ProgressIndicator steps={steps} />);

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic list structure', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: false, isActive: true },
        { id: 2, title: 'Step 2', isComplete: false, isActive: false },
      ];

      const { container } = render(<ProgressIndicator steps={steps} />);
      
      expect(container.querySelector('ol')).toBeInTheDocument();
    });

    it('marks active step with aria-current', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: false, isActive: false },
        { id: 2, title: 'Step 2', isComplete: false, isActive: true },
      ];

      const { container } = render(<ProgressIndicator steps={steps} />);
      
      const activeStep = container.querySelector('[aria-current="step"]');
      expect(activeStep).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single step', () => {
      const steps = [
        { id: 1, title: 'Only Step', isComplete: false, isActive: true },
      ];

      render(<ProgressIndicator steps={steps} />);

      expect(screen.getByText('Only Step')).toBeInTheDocument();
    });

    it('handles many steps', () => {
      const steps = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Step ${i + 1}`,
        isComplete: i < 5,
        isActive: i === 5,
      }));

      render(<ProgressIndicator steps={steps} />);

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 10')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('applies custom className to container', () => {
      const steps = [
        { id: 1, title: 'Step 1', isComplete: false, isActive: true },
      ];

      const { container } = render(
        <ProgressIndicator steps={steps} className="custom-progress" />
      );

      expect(container.firstChild).toHaveClass('custom-progress');
    });
  });
});
