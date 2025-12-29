import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConditionalSection } from './ConditionalSection';

describe('ConditionalSection', () => {
  describe('Show/Hide Logic', () => {
    it('renders children when condition is true', () => {
      render(
        <ConditionalSection condition={true}>
          <div>Conditional Content</div>
        </ConditionalSection>
      );

      expect(screen.getByText('Conditional Content')).toBeInTheDocument();
    });

    it('does not render children when condition is false', () => {
      render(
        <ConditionalSection condition={false}>
          <div>Conditional Content</div>
        </ConditionalSection>
      );

      expect(screen.queryByText('Conditional Content')).not.toBeInTheDocument();
    });

    it('updates visibility when condition changes', () => {
      const { rerender } = render(
        <ConditionalSection condition={false}>
          <div>Conditional Content</div>
        </ConditionalSection>
      );

      expect(screen.queryByText('Conditional Content')).not.toBeInTheDocument();

      rerender(
        <ConditionalSection condition={true}>
          <div>Conditional Content</div>
        </ConditionalSection>
      );

      expect(screen.getByText('Conditional Content')).toBeInTheDocument();
    });
  });

  describe('Multiple Children', () => {
    it('renders multiple children when condition is true', () => {
      render(
        <ConditionalSection condition={true}>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </ConditionalSection>
      );

      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
      expect(screen.getByText('Third Child')).toBeInTheDocument();
    });

    it('does not render any children when condition is false', () => {
      render(
        <ConditionalSection condition={false}>
          <div>First Child</div>
          <div>Second Child</div>
        </ConditionalSection>
      );

      expect(screen.queryByText('First Child')).not.toBeInTheDocument();
      expect(screen.queryByText('Second Child')).not.toBeInTheDocument();
    });
  });

  describe('Nested Components', () => {
    it('renders nested form fields when condition is true', () => {
      render(
        <ConditionalSection condition={true}>
          <input type="text" placeholder="Guardian Name" />
          <input type="text" placeholder="Guardian Relationship" />
        </ConditionalSection>
      );

      expect(screen.getByPlaceholderText('Guardian Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Guardian Relationship')).toBeInTheDocument();
    });

    it('renders nested ConditionalSections', () => {
      render(
        <ConditionalSection condition={true}>
          <div>Outer Content</div>
          <ConditionalSection condition={true}>
            <div>Inner Content</div>
          </ConditionalSection>
        </ConditionalSection>
      );

      expect(screen.getByText('Outer Content')).toBeInTheDocument();
      expect(screen.getByText('Inner Content')).toBeInTheDocument();
    });

    it('hides nested content when outer condition is false', () => {
      render(
        <ConditionalSection condition={false}>
          <div>Outer Content</div>
          <ConditionalSection condition={true}>
            <div>Inner Content</div>
          </ConditionalSection>
        </ConditionalSection>
      );

      expect(screen.queryByText('Outer Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Inner Content')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null children gracefully', () => {
      render(
        <ConditionalSection condition={true}>
          {null}
        </ConditionalSection>
      );

      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('handles undefined children gracefully', () => {
      render(
        <ConditionalSection condition={true}>
          {undefined}
        </ConditionalSection>
      );

      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('handles empty fragment', () => {
      render(
        <ConditionalSection condition={true}>
          <></>
        </ConditionalSection>
      );

      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('applies custom className when provided', () => {
      const { container } = render(
        <ConditionalSection condition={true} className="custom-wrapper">
          <div>Content</div>
        </ConditionalSection>
      );

      expect(container.firstChild).toHaveClass('custom-wrapper');
    });

    it('does not render className when condition is false', () => {
      const { container } = render(
        <ConditionalSection condition={false} className="custom-wrapper">
          <div>Content</div>
        </ConditionalSection>
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
