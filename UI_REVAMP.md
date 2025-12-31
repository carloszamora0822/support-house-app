# UI Revamp Action Plan
**Support House Application - Design System Modernization**

---

## 🎯 Executive Summary

**Current State**: Functional but inconsistent design system with scattered styling, manual variant maps, duplicated toast implementations, and ad-hoc page layouts.

**Target State**: Professional, scalable design system with:
- Single source of truth for all design tokens
- CVA-based variant system for type-safe, consistent components
- Centralized services (toast, layout)
- Accessibility-first approach
- HIPAA-compliant UI patterns (security-focused)
- Zero breaking changes to existing features

**Approach**: Modular, iterative migration with parallel systems during transition.

---

## 📊 Current System Analysis

### ✅ Strengths
- **Good foundation**: Tailwind + clsx + tailwind-merge via `cn()` utility
- **Component library exists**: Button, Input, Alert, Badge, Modal, Card
- **Accessibility awareness**: ARIA attributes in FormField, Modal keyboard handling
- **React Hook Form integration**: Validation patterns established
- **Lucide icons available**: Modern icon system already in place

### ⚠️ Critical Issues

#### 1. **Inconsistent Design Tokens**
- Colors defined in Tailwind (primary/accent) but not semantic tokens
- No standardized: radius, shadows, spacing scales, typography
- Components hand-roll classes instead of referencing tokens
- Badge uses `@/lib/utils` while others use `@/utils/cn` (path inconsistency)

#### 2. **Manual Variant Systems**
```tsx
// Current: Manual string maps in every component
const variantStyles = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700...',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700...',
}
```
**Problems**: 
- Not type-safe
- Duplicated logic across components
- Hard to audit/maintain
- No compound variants (e.g., `variant + size + state`)

#### 3. **Toast Chaos**
- `<Toaster />` mounted in multiple pages (PatientDetailPage, etc.)
- Direct `toast.*` calls scattered across 9+ files
- Inconsistent positioning, duration, styling
- Emoji usage (🔍, 📝, ✅) hardcoded in features

#### 4. **Layout Duplication**
```tsx
// Repeated in every page:
<div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
  <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-purple-100">
    {/* Logo + nav */}
  </nav>
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
```
**Impact**: 
- Hard to maintain consistent spacing
- Difficult to update global layout
- No responsive breakpoint consistency

#### 5. **Form System Fragmentation**
- `FormField.tsx` uses inline class strings (not `cn()` utility)
- Focus ring color hardcoded to `blue-500` (should be `primary-600`)
- Input/FormField don't share consistent error/disabled states
- No unified field wrapper for Select/Checkbox/Radio groups

#### 6. **Security/HIPAA UX Gaps**
- No visual indicators for sensitive data fields
- Session timeout modal exists but not integrated into layout
- No "data entered" warnings before navigation
- Missing empty states for sensitive screens

---

## 🏗️ New Architecture

### Layer 1: Design Tokens (Foundation)
```
tailwind.config.js
├── Semantic Colors (surface, border, text, status)
├── Typography Scale (display, heading, body, caption)
├── Spacing Scale (standardized px values)
├── Radius Scale (sm, md, lg, xl, full)
├── Shadow Scale (sm, md, lg, xl)
└── Animation Tokens (duration, easing)
```

### Layer 2: Primitives (Dumb Components)
```
src/components/ui/
├── button/
│   ├── button.tsx (component)
│   └── button.variants.ts (CVA config)
├── input/
├── badge/
├── alert/
├── card/
├── modal/
└── ... (all base components)
```

### Layer 3: Patterns (Smart Compositions)
```
src/components/patterns/
├── form-field/ (wraps any input type)
├── page-shell/ (layout wrapper)
├── app-header/ (nav bar)
├── section-header/
├── empty-state/
└── skeleton-loader/
```

### Layer 4: Services (Centralized Logic)
```
src/lib/services/
├── toast.service.ts (notify.success, notify.error, etc.)
├── navigation.service.ts (with unsaved data warnings)
└── session.service.ts (timeout handling)
```

### Layer 5: Feature Components
```
Features consume only:
- Primitives (ui/)
- Patterns (patterns/)
- Services (lib/services/)
NO custom styling allowed
```

---

## 📋 Implementation Phases

### **Phase 0: Foundation Setup** (No Breaking Changes)
**Goal**: Install dependencies, create new folder structure alongside existing system

#### Tasks:
1. **Install CVA**
   ```bash
   npm install class-variance-authority
   ```

2. **Create new folder structure** (parallel to existing)
   ```
   src/
   ├── components/
   │   ├── common/ (KEEP - existing components)
   │   ├── forms/ (KEEP - existing components)
   │   ├── ui/ (NEW - CVA-based primitives)
   │   └── patterns/ (NEW - smart compositions)
   ├── lib/
   │   ├── services/ (NEW - centralized services)
   │   └── tokens/ (NEW - design token exports)
   ```

3. **Fix path inconsistency**
   - Audit all imports: `@/lib/utils` vs `@/utils/cn`
   - Standardize to `@/lib/utils/cn`

**Deliverables**:
- ✅ CVA installed
- ✅ New folders created
- ✅ Path aliases consistent
- ✅ Zero breaking changes

**Time**: 30 minutes

---

### **Phase 1: Design Token System** (Foundation Layer)
**Goal**: Single source of truth for all visual properties

#### 1.1 Expand Tailwind Config
**File**: `tailwind.config.js`

```js
export default {
  theme: {
    extend: {
      colors: {
        // Existing
        primary: { /* purple scale */ },
        accent: { /* pink scale */ },
        
        // NEW: Semantic tokens
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f9fafb',
          subtle: '#f3f4f6',
        },
        border: {
          DEFAULT: '#e5e7eb',
          muted: '#f3f4f6',
          strong: '#d1d5db',
        },
        text: {
          DEFAULT: '#111827',
          muted: '#6b7280',
          subtle: '#9ca3af',
          inverse: '#ffffff',
        },
        status: {
          success: { light: '#dcfce7', DEFAULT: '#16a34a', dark: '#15803d' },
          warning: { light: '#fef3c7', DEFAULT: '#f59e0b', dark: '#d97706' },
          error: { light: '#fee2e2', DEFAULT: '#dc2626', dark: '#b91c1c' },
          info: { light: '#dbeafe', DEFAULT: '#2563eb', dark: '#1d4ed8' },
        },
        // HIPAA/Security
        sensitive: {
          bg: '#fef3c7',
          border: '#fbbf24',
          text: '#92400e',
        },
      },
      
      // Typography
      fontSize: {
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-xl': ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-lg': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      
      // Spacing (standardized)
      spacing: {
        'section': '3rem', // 48px - between major sections
        'card': '1.5rem',  // 24px - card padding
        'field': '1rem',   // 16px - between form fields
      },
      
      // Border Radius
      borderRadius: {
        'sm': '0.25rem',   // 4px
        'md': '0.375rem',  // 6px
        'lg': '0.5rem',    // 8px
        'xl': '0.75rem',   // 12px
        '2xl': '1rem',     // 16px
      },
      
      // Shadows (consistent elevation)
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        'focus': '0 0 0 3px rgb(147 51 234 / 0.3)', // primary-600 with opacity
      },
      
      // Animation
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
    },
  },
}
```

#### 1.2 Create Token Export File
**File**: `src/lib/tokens/design-tokens.ts`

```ts
/**
 * Design Tokens - Single Source of Truth
 * Import these instead of hardcoding Tailwind classes
 */

export const tokens = {
  // Focus ring (consistent across all interactive elements)
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
  
  // Disabled state
  disabled: 'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Transitions
  transition: 'transition-colors duration-normal',
  
  // Page padding (responsive)
  pagePadding: 'px-4 sm:px-6 lg:px-8',
  
  // Card padding
  cardPadding: 'p-card',
  
  // Section spacing
  sectionGap: 'space-y-section',
} as const;
```

**Deliverables**:
- ✅ Tailwind config expanded with semantic tokens
- ✅ Token export file created
- ✅ Documentation of token usage

**Time**: 2 hours

---

### **Phase 2: CVA Variant System** (Primitives Layer)
**Goal**: Replace manual variant maps with type-safe CVA system

#### 2.1 Create Button with CVA
**File**: `src/components/ui/button/button.variants.ts`

```ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  // Base styles (always applied)
  [
    'inline-flex items-center justify-center',
    'rounded-md font-medium',
    'transition-colors duration-normal',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary-600 text-white',
          'hover:bg-primary-700',
          'focus-visible:ring-primary-600',
        ],
        secondary: [
          'bg-surface text-text',
          'border border-border',
          'hover:bg-surface-muted',
          'focus-visible:ring-primary-600',
        ],
        outline: [
          'border border-border bg-surface text-text',
          'hover:bg-surface-muted',
          'focus-visible:ring-primary-600',
        ],
        ghost: [
          'text-text',
          'hover:bg-surface-muted',
          'focus-visible:ring-primary-600',
        ],
        danger: [
          'bg-status-error text-white',
          'hover:bg-status-error-dark',
          'focus-visible:ring-status-error',
        ],
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
```

**File**: `src/components/ui/button/button.tsx`

```tsx
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { buttonVariants, type ButtonVariants } from './button.variants';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**File**: `src/components/ui/button/index.ts`

```ts
export { Button, type ButtonProps } from './button';
export { buttonVariants, type ButtonVariants } from './button.variants';
```

#### 2.2 Create Input with CVA
**File**: `src/components/ui/input/input.variants.ts`

```ts
import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariants = cva(
  [
    'flex w-full rounded-md border bg-surface',
    'px-3 py-2 text-sm',
    'placeholder:text-text-subtle',
    'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted',
    'transition-colors duration-normal',
  ],
  {
    variants: {
      variant: {
        default: 'border-border',
        error: 'border-status-error focus:ring-status-error',
        success: 'border-status-success focus:ring-status-success',
      },
      inputSize: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export type InputVariants = VariantProps<typeof inputVariants>;
```

#### 2.3 Create Alert with CVA
**File**: `src/components/ui/alert/alert.variants.ts`

```ts
import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(
  ['rounded-md border p-4', 'flex items-start gap-3'],
  {
    variants: {
      variant: {
        info: 'bg-status-info-light text-status-info-dark border-status-info',
        success: 'bg-status-success-light text-status-success-dark border-status-success',
        warning: 'bg-status-warning-light text-status-warning-dark border-status-warning',
        error: 'bg-status-error-light text-status-error-dark border-status-error',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export type AlertVariants = VariantProps<typeof alertVariants>;
```

#### 2.4 Create Badge with CVA
**File**: `src/components/ui/badge/badge.variants.ts`

```ts
import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  ['inline-flex items-center rounded-full border', 'px-2.5 py-0.5 text-xs font-medium'],
  {
    variants: {
      variant: {
        primary: 'bg-primary-100 text-primary-800 border-primary-200',
        secondary: 'bg-surface-muted text-text-muted border-border',
        success: 'bg-status-success-light text-status-success-dark border-status-success',
        warning: 'bg-status-warning-light text-status-warning-dark border-status-warning',
        error: 'bg-status-error-light text-status-error-dark border-status-error',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
```

**Deliverables**:
- ✅ Button, Input, Alert, Badge migrated to CVA
- ✅ Type-safe variant props
- ✅ Consistent with design tokens
- ✅ Old components still work (parallel system)

**Time**: 4 hours

---

### **Phase 3: Centralized Toast Service** (Service Layer)
**Goal**: One toast implementation, consistent behavior

#### 3.1 Create Toast Service
**File**: `src/lib/services/toast.service.ts`

```ts
import toast, { type ToastOptions } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    borderRadius: '0.5rem',
    padding: '1rem',
    fontSize: '0.875rem',
  },
};

export const notify = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      ...defaultOptions,
      ...options,
      icon: <CheckCircle2 className="h-5 w-5 text-status-success" />,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      ...defaultOptions,
      duration: 6000, // Errors stay longer
      ...options,
      icon: <XCircle className="h-5 w-5 text-status-error" />,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: <AlertCircle className="h-5 w-5 text-status-warning" />,
      style: {
        ...defaultOptions.style,
        backgroundColor: '#fef3c7',
        color: '#92400e',
      },
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: <Info className="h-5 w-5 text-status-info" />,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, messages, {
      ...defaultOptions,
      ...options,
    });
  },

  // HIPAA-specific: Don't show sensitive data in toasts
  hipaaSuccess: (action: string) => {
    return notify.success(`${action} completed successfully`);
  },

  hipaaError: (action: string) => {
    return notify.error(`Failed to ${action}. Please try again or contact support.`);
  },
};
```

#### 3.2 Mount Toaster Once in App
**File**: `src/App.tsx` (modify)

```tsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Mount toast container once at root */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '0.5rem',
            padding: '1rem',
          },
        }}
      />
      
      <BrowserRouter>
        {/* routes */}
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

#### 3.3 Migration Guide
**File**: `src/lib/services/TOAST_MIGRATION.md`

```md
# Toast Migration Guide

## Old Pattern (DEPRECATED)
```tsx
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

// In component
<Toaster position="top-right" />

toast.success('✅ Task completed successfully!');
toast.error('Failed to save');
```

## New Pattern
```tsx
import { notify } from '@/lib/services/toast.service';

// No Toaster needed in component!

notify.success('Task completed successfully'); // Icons added automatically
notify.error('Failed to save');
notify.hipaaSuccess('Patient check-in'); // HIPAA-safe messages
```

## Migration Checklist
1. Remove all `<Toaster />` from pages/components
2. Replace `toast.*` with `notify.*`
3. Remove emoji from messages (icons added automatically)
4. Use `notify.hipaaSuccess/Error` for sensitive operations
```

**Deliverables**:
- ✅ Centralized toast service with icons
- ✅ HIPAA-safe toast methods
- ✅ Single Toaster mount in App.tsx
- ✅ Migration guide for team

**Time**: 2 hours

---

### **Phase 4: Layout Pattern System** (Patterns Layer)
**Goal**: Eliminate layout duplication, consistent page structure

#### 4.1 Create PageShell Component
**File**: `src/components/patterns/page-shell/page-shell.tsx`

```tsx
import { cn } from '@/lib/utils/cn';

interface PageShellProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'plain';
  className?: string;
}

const variants = {
  default: 'bg-surface-muted',
  gradient: 'bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100',
  plain: 'bg-surface',
};

export const PageShell = ({ children, variant = 'default', className }: PageShellProps) => {
  return (
    <div className={cn('min-h-screen', variants[variant], className)}>
      {children}
    </div>
  );
};
```

#### 4.2 Create AppHeader Component
**File**: `src/components/patterns/app-header/app-header.tsx`

```tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AppHeaderProps {
  className?: string;
}

export const AppHeader = ({ className }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className={cn(
      'bg-white/80 backdrop-blur-sm shadow-sm border-b border-purple-100',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Support House
            </h1>
          </button>

          {/* User Info + Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
              <p className="text-xs text-purple-600 capitalize">{user?.role}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-purple-200 hover:bg-purple-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
```

#### 4.3 Create PageContent Component
**File**: `src/components/patterns/page-content/page-content.tsx`

```tsx
import { cn } from '@/lib/utils/cn';

interface PageContentProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const maxWidths = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1400px]',
  '2xl': 'max-w-[1600px]',
  full: 'max-w-full',
};

export const PageContent = ({ 
  children, 
  maxWidth = 'lg', 
  className 
}: PageContentProps) => {
  return (
    <main className={cn(
      maxWidths[maxWidth],
      'mx-auto px-4 sm:px-6 lg:px-8 py-8',
      className
    )}>
      {children}
    </main>
  );
};
```

#### 4.4 Create SectionHeader Component
**File**: `src/components/patterns/section-header/section-header.tsx`

```tsx
import { cn } from '@/lib/utils/cn';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader = ({ 
  title, 
  description, 
  action,
  className 
}: SectionHeaderProps) => {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading-lg text-text">{title}</h2>
          {description && (
            <p className="text-body-sm text-text-muted mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};
```

#### 4.5 Create EmptyState Component
**File**: `src/components/patterns/empty-state/empty-state.tsx`

```tsx
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className
    )}>
      <div className="p-4 bg-surface-muted rounded-full mb-4">
        <Icon className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="text-heading-sm text-text mb-2">{title}</h3>
      <p className="text-body-sm text-text-muted max-w-md mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
```

#### 4.6 Example: Refactored DashboardPage
**File**: `src/pages/DashboardPage.tsx` (NEW VERSION)

```tsx
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/patterns/page-shell';
import { AppHeader } from '@/components/patterns/app-header';
import { PageContent } from '@/components/patterns/page-content';
import { SectionHeader } from '@/components/patterns/section-header';
import { Card } from '@/components/ui/card';
import { Search, FileText, CheckCircle } from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Patient Search',
      description: 'Search for existing patients by name, phone, or DOB',
      icon: Search,
      color: 'from-purple-500 to-purple-600',
      route: '/search'
    },
    {
      title: 'New Patient Intake',
      description: 'Complete multi-step patient registration form',
      icon: FileText,
      color: 'from-pink-500 to-pink-600',
      route: '/intake/new'
    },
    {
      title: 'Check-In Patient',
      description: 'Record patient visit with assistance tracking',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      route: '/search'
    },
  ];

  return (
    <PageShell variant="gradient">
      <AppHeader />
      
      <PageContent>
        <SectionHeader 
          title="Welcome back! 👋"
          description="What would you like to do today?"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                onClick={() => navigate(action.route)}
                className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className={`p-3 bg-gradient-to-br ${action.color} rounded-xl shadow-md inline-flex mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-heading-sm text-text mb-2">{action.title}</h3>
                <p className="text-body-sm text-text-muted">{action.description}</p>
              </Card>
            );
          })}
        </div>
      </PageContent>
    </PageShell>
  );
};
```

**Deliverables**:
- ✅ PageShell, AppHeader, PageContent, SectionHeader, EmptyState
- ✅ Consistent layout patterns
- ✅ Example refactored page
- ✅ 80% less layout code per page

**Time**: 4 hours

---

### **Phase 5: Unified Form System** (Patterns Layer)
**Goal**: One way to build forms, consistent validation UI

#### 5.1 Create FormField Pattern
**File**: `src/components/patterns/form-field/form-field.tsx`

```tsx
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'password';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  sensitive?: boolean; // HIPAA flag
  className?: string;
}

export const FormField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  hint,
  multiline = false,
  rows = 3,
  sensitive = false,
  className,
}: FormFieldProps) => {
  const inputId = `field-${name}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <label 
        htmlFor={inputId} 
        className="block text-sm font-medium text-text"
      >
        {label}
        {required && <span className="text-status-error ml-1">*</span>}
        {sensitive && (
          <span className="ml-2 text-xs text-sensitive-text bg-sensitive-bg px-2 py-0.5 rounded">
            Sensitive
          </span>
        )}
      </label>

      {/* Input */}
      {multiline ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={cn(
            'flex w-full rounded-md border bg-surface',
            'px-3 py-2 text-sm',
            'placeholder:text-text-subtle',
            'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted',
            error && 'border-status-error focus:ring-status-error',
            sensitive && 'border-sensitive-border bg-sensitive-bg'
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(
            error && errorId,
            hint && hintId
          )}
        />
      ) : (
        <Input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          variant={error ? 'error' : 'default'}
          className={cn(
            sensitive && 'border-sensitive-border bg-sensitive-bg'
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(
            error && errorId,
            hint && hintId
          )}
        />
      )}

      {/* Error Message */}
      {error && (
        <div id={errorId} className="flex items-start gap-2 text-status-error" role="alert">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Hint Text */}
      {!error && hint && (
        <p id={hintId} className="text-sm text-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
};
```

#### 5.2 Create SelectField Pattern
**File**: `src/components/patterns/form-field/select-field.tsx`

```tsx
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils/cn';
import { AlertCircle } from 'lucide-react';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  className?: string;
}

export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  hint,
  placeholder = 'Select an option',
  className,
}: SelectFieldProps) => {
  const inputId = `field-${name}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={inputId} className="block text-sm font-medium text-text">
        {label}
        {required && <span className="text-status-error ml-1">*</span>}
      </label>

      <Select
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        options={options}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        error={!!error}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={cn(error && errorId, hint && hintId)}
      />

      {error && (
        <div id={errorId} className="flex items-start gap-2 text-status-error" role="alert">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!error && hint && (
        <p id={hintId} className="text-sm text-text-muted">{hint}</p>
      )}
    </div>
  );
};
```

**Deliverables**:
- ✅ Unified FormField with HIPAA-sensitive flag
- ✅ SelectField pattern
- ✅ Consistent error/hint display
- ✅ Full accessibility (ARIA)

**Time**: 3 hours

---

### **Phase 6: Component Migration** (Incremental Rollout)
**Goal**: Replace old components with new system, feature by feature

#### Migration Strategy:
1. **Start with new features** (no breaking changes)
2. **Migrate high-traffic pages** (Dashboard, Search, PatientDetail)
3. **Migrate forms** (Intake, Check-in)
4. **Deprecate old components** (add console warnings)
5. **Remove old components** (final cleanup)

#### 6.1 Migration Checklist Template

**File**: `COMPONENT_MIGRATION_CHECKLIST.md`

```md
# Component Migration Checklist

## Phase 6.1: Dashboard & Navigation (Week 1)
- [ ] DashboardPage → Use PageShell + AppHeader + patterns
- [ ] SearchPage → Use PageShell + AppHeader + EmptyState
- [ ] Replace all `toast.*` with `notify.*`
- [ ] Remove `<Toaster />` from pages

## Phase 6.2: Patient Features (Week 2)
- [ ] PatientDetailPage → Use new layout patterns
- [ ] PatientCard → Use new Card + Badge
- [ ] CheckInModal → Use new Button + FormField
- [ ] CheckOutModal → Use new Button + FormField

## Phase 6.3: Forms (Week 3)
- [ ] IntakeFormContainer → Use new FormField pattern
- [ ] Step1_PatientInformation → Replace FormField imports
- [ ] Step2_MedicalInformation → Replace FormField imports
- [ ] Step3_DisclosureAuthorization → Replace FormField imports

## Phase 6.4: Admin & Auth (Week 4)
- [ ] AdminPage → Use new layout patterns
- [ ] UserApprovalDashboard → Use new Alert + Badge
- [ ] LoginForm → Use new FormField + Button
- [ ] RegisterForm → Use new FormField + Button

## Phase 6.5: Deprecation (Week 5)
- [ ] Add deprecation warnings to old components
- [ ] Update all imports to new paths
- [ ] Remove unused old components
- [ ] Update tests

## Testing After Each Phase
- [ ] Visual regression testing
- [ ] Accessibility audit (WAVE, axe)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile responsiveness check
- [ ] HIPAA compliance review (no sensitive data in toasts/logs)
```

**Deliverables**:
- ✅ Migration checklist
- ✅ Phased rollout plan
- ✅ Testing protocol

**Time**: 4-6 weeks (incremental)

---

### **Phase 7: Visual Enhancements** (Polish Layer)
**Goal**: Premium UI feel without breaking functionality

#### 7.1 Add Skeleton Loaders
**File**: `src/components/ui/skeleton/skeleton.tsx`

```tsx
import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = ({ className, variant = 'rectangular' }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-muted',
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-md',
        className
      )}
    />
  );
};

// Preset patterns
export const SkeletonCard = () => (
  <div className="p-6 border border-border rounded-lg space-y-4">
    <Skeleton className="h-12 w-12" variant="circular" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
);
```

#### 7.2 Enhance Focus Rings
**File**: `tailwind.config.js` (add to theme)

```js
theme: {
  extend: {
    ringWidth: {
      'focus': '2px',
    },
    ringOffsetWidth: {
      'focus': '2px',
    },
  }
}
```

#### 7.3 Add Hover Elevation
**File**: `src/lib/tokens/animations.ts`

```ts
export const animations = {
  hoverLift: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-normal',
  hoverGrow: 'hover:scale-105 transition-transform duration-normal',
  fadeIn: 'animate-in fade-in duration-normal',
  slideIn: 'animate-in slide-in-from-bottom-4 duration-normal',
} as const;
```

#### 7.4 Add Loading States
**File**: `src/components/patterns/loading-state/loading-state.tsx`

```tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const LoadingState = ({ 
  message = 'Loading...', 
  size = 'md',
  className 
}: LoadingStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <Loader2 className={cn('animate-spin text-primary-600', sizes[size])} />
      <p className="text-text-muted text-sm mt-4">{message}</p>
    </div>
  );
};
```

**Deliverables**:
- ✅ Skeleton loaders for async content
- ✅ Enhanced focus rings
- ✅ Hover animations
- ✅ Loading states

**Time**: 3 hours

---

### **Phase 8: HIPAA/Security UX** (Compliance Layer)
**Goal**: Visual indicators for sensitive data, security-first UX

#### 8.1 Sensitive Field Indicator
Already implemented in FormField with `sensitive` prop:
```tsx
<FormField
  label="Social Security Number"
  name="ssn"
  sensitive={true} // Adds visual indicator
  {...props}
/>
```

#### 8.2 Unsaved Data Warning
**File**: `src/lib/services/navigation.service.ts`

```ts
import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

export const useUnsavedChangesWarning = (hasUnsavedChanges: boolean) => {
  // Browser navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // React Router navigation warning
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  return blocker;
};
```

#### 8.3 Session Timeout Integration
**File**: `src/components/patterns/app-shell/app-shell.tsx`

```tsx
import { SessionTimeoutModal } from '@/components/common/SessionTimeoutModal';
import { PageShell } from '@/components/patterns/page-shell';
import { AppHeader } from '@/components/patterns/app-header';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageShell variant="gradient">
      <AppHeader />
      <SessionTimeoutModal /> {/* Mounted once at app level */}
      {children}
    </PageShell>
  );
};
```

#### 8.4 Audit Log Toast (No Sensitive Data)
Already implemented in toast.service.ts:
```ts
notify.hipaaSuccess('Patient check-in'); // ✅ Safe
// NOT: notify.success('Checked in John Doe, SSN: 123-45-6789'); // ❌ Unsafe
```

**Deliverables**:
- ✅ Sensitive field visual indicators
- ✅ Unsaved changes warning
- ✅ Session timeout integrated
- ✅ HIPAA-safe toast messages

**Time**: 2 hours

---

## 📦 Deliverables Summary

### New File Structure
```
src/
├── components/
│   ├── common/ (DEPRECATED - keep during migration)
│   ├── forms/ (DEPRECATED - keep during migration)
│   ├── ui/ (NEW - CVA primitives)
│   │   ├── button/
│   │   ├── input/
│   │   ├── alert/
│   │   ├── badge/
│   │   ├── card/
│   │   ├── modal/
│   │   ├── skeleton/
│   │   └── index.ts
│   └── patterns/ (NEW - smart compositions)
│       ├── page-shell/
│       ├── app-header/
│       ├── page-content/
│       ├── section-header/
│       ├── form-field/
│       ├── empty-state/
│       ├── loading-state/
│       └── index.ts
├── lib/
│   ├── services/ (NEW)
│   │   ├── toast.service.ts
│   │   ├── navigation.service.ts
│   │   └── session.service.ts
│   ├── tokens/ (NEW)
│   │   ├── design-tokens.ts
│   │   └── animations.ts
│   └── utils/
│       └── cn.ts (existing)
└── App.tsx (modified - mount Toaster once)
```

### Documentation Files
- `UI_REVAMP.md` (this file)
- `COMPONENT_MIGRATION_CHECKLIST.md`
- `src/lib/services/TOAST_MIGRATION.md`
- `src/components/ui/README.md` (component usage guide)
- `src/components/patterns/README.md` (pattern usage guide)

---

## 🎨 Design Principles

### 1. **Consistency Over Customization**
- Features use primitives + patterns ONLY
- No custom styling in feature components
- Design tokens are the single source of truth

### 2. **Accessibility First**
- All interactive elements have focus rings
- ARIA attributes on all form fields
- Keyboard navigation support
- Screen reader friendly

### 3. **HIPAA Compliance**
- Sensitive fields visually marked
- No sensitive data in toasts/logs
- Session timeout warnings
- Unsaved data protection

### 4. **Performance**
- CVA compiles at build time (no runtime cost)
- Skeleton loaders for perceived performance
- Optimistic UI updates where safe

### 5. **Developer Experience**
- Type-safe variant props
- Auto-complete for design tokens
- Clear migration guides
- Parallel systems during transition

---

## 📅 Timeline

| Phase | Duration | Effort | Dependencies |
|-------|----------|--------|--------------|
| Phase 0: Foundation Setup | 30 min | Low | None |
| Phase 1: Design Tokens | 2 hours | Medium | Phase 0 |
| Phase 2: CVA Variants | 4 hours | Medium | Phase 1 |
| Phase 3: Toast Service | 2 hours | Low | Phase 0 |
| Phase 4: Layout Patterns | 4 hours | Medium | Phase 1, 2 |
| Phase 5: Form System | 3 hours | Medium | Phase 2, 4 |
| Phase 6: Migration | 4-6 weeks | High | All previous |
| Phase 7: Visual Polish | 3 hours | Low | Phase 2, 4 |
| Phase 8: HIPAA/Security | 2 hours | Medium | Phase 4, 5 |

**Total Setup Time**: ~20 hours (Phases 0-5, 7-8)  
**Migration Time**: 4-6 weeks (Phase 6, incremental)

---

## ✅ Success Metrics

### Quantitative
- **Code Reduction**: 40-60% less styling code per page
- **Consistency**: 100% of components use design tokens
- **Type Safety**: 0 runtime variant errors
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: No regression in bundle size

### Qualitative
- **Developer Velocity**: New features ship faster (reuse patterns)
- **Design Consistency**: "Feels like one app" across all pages
- **Maintainability**: Design changes update globally
- **Onboarding**: New devs understand system in <1 day

---

## 🚨 Risk Mitigation

### Risk 1: Breaking Changes During Migration
**Mitigation**: 
- Parallel systems (old + new coexist)
- Feature flags for gradual rollout
- Comprehensive testing after each phase

### Risk 2: Team Adoption Resistance
**Mitigation**:
- Clear migration guides
- Pair programming sessions
- Show before/after code comparisons
- Highlight DX improvements

### Risk 3: Scope Creep
**Mitigation**:
- Strict phase boundaries
- No new features during migration
- Focus on 1:1 replacements first
- Enhancements come after migration complete

### Risk 4: Accessibility Regressions
**Mitigation**:
- Automated testing (axe, WAVE)
- Manual keyboard navigation testing
- Screen reader testing
- Accessibility checklist per phase

---

## 🎓 Learning Resources

### For Team
- **CVA Documentation**: https://cva.style/docs
- **Tailwind Best Practices**: https://tailwindcss.com/docs/reusing-styles
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **HIPAA UI Patterns**: (internal security guidelines)

### Code Examples
- See `src/components/ui/button/` for CVA pattern
- See `src/components/patterns/page-shell/` for composition pattern
- See `src/lib/services/toast.service.ts` for service pattern

---

## 🔄 Maintenance Plan

### Weekly
- Review new components for token compliance
- Update migration checklist progress

### Monthly
- Audit for deprecated component usage
- Review accessibility reports
- Update design token documentation

### Quarterly
- Design system retrospective
- Evaluate new Tailwind/CVA features
- Plan next iteration improvements

---

## 📞 Support

### Questions?
- **Design System Lead**: [Your Name]
- **Slack Channel**: #design-system
- **Office Hours**: Tuesdays 2-3pm

### Reporting Issues
- **Bug**: "Component doesn't match design tokens"
- **Enhancement**: "New variant needed for X use case"
- **Question**: "How do I implement Y pattern?"

---

## 🎉 Next Steps

1. **Review this plan** with team (30 min meeting)
2. **Get approval** for Phase 0-5 (setup phases)
3. **Create Jira tickets** for each phase
4. **Assign Phase 0** to start immediately
5. **Schedule weekly check-ins** during migration

**Let's build a design system that scales! 🚀**
