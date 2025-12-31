# Design System v1 - Support House Application

**Last Updated**: December 30, 2025 (8:08 PM)  
**Version**: 1.1.0  
**Status**: Active - Enhanced Forms & Tablet Optimized

---

## 📍 Quick Reference

This document is the **single source of truth** for the Support House design system. All components, patterns, and tokens are documented here with their file paths and usage guidelines.

---

## 🎨 Design Tokens

### Responsive Breakpoints ✨ NEW
**Location**: `tailwind.config.js` (lines 9-13)

- **xs**: 475px - Small phones
- **tablet**: 640px - iPads and tablets (same as sm)
- **laptop**: 1024px - Laptops (same as lg)
- **desktop**: 1280px - Desktop monitors (same as xl)

**Tablet Optimization**: All components are optimized for tablet use with responsive padding, font sizes, and layouts.

### Colors
**Location**: `tailwind.config.js` (lines 15-78)

- **Primary**: Purple scale (#9333ea) - Main brand color
- **Accent**: Pink scale (#d946ef) - Secondary brand color
- **Surface**: White backgrounds (`surface`, `surface-muted`, `surface-subtle`)
- **Border**: Gray borders (`border`, `border-muted`, `border-strong`)
- **Text**: Text colors (`text`, `text-muted`, `text-subtle`, `text-inverse`)
- **Status**: Semantic colors
  - Success: Green (#16a34a)
  - Warning: Yellow (#f59e0b)
  - Error: Red (#dc2626)
  - Info: Blue (#2563eb)
- **Sensitive**: HIPAA-marked fields (yellow tint #fef3c7)

### Typography
**Location**: `tailwind.config.js` (lines 80-90)

- **Display**: `display-lg`, `display-md` - Hero text
- **Heading**: `heading-xl`, `heading-lg`, `heading-md`, `heading-sm` - Section titles
- **Body**: `body-lg`, `body-md`, `body-sm` - Main content
- **Caption**: Small text for hints/metadata

### Spacing
**Location**: `tailwind.config.js` (lines 92-96)

- **section**: 3rem (48px) - Between major sections
- **card**: 1.5rem (24px) - Card padding
- **field**: 1rem (16px) - Between form fields

### Shadows
**Location**: `tailwind.config.js` (lines 104-109)

- `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl` - Elevation system
- `shadow-focus` - Focus ring shadow (primary-600 with opacity)

### Animations
**Location**: `src/lib/tokens/animations.ts`

- `hoverLift` - Card hover effect (shadow + translate)
- `hoverGrow` - Scale on hover
- `fadeIn` - Fade in animation
- `slideIn` - Slide in from bottom

### Token Utilities
**Location**: `src/lib/tokens/design-tokens.ts`

- `focusRing` - Consistent focus state
- `disabled` - Disabled state styling
- `transition` - Standard transition
- `pagePadding` - Responsive page padding
- `cardPadding` - Card padding token
- `sectionGap` - Section spacing

---

## 🧩 Primitives (UI Components)

### Button
**Location**: `src/components/ui/button/`
- **Files**: `button.tsx`, `button.variants.ts`, `index.ts`
- **Variants**: primary, secondary, outline, ghost, danger
- **Sizes**: sm, md, lg
- **Props**: `loading`, `fullWidth`, `disabled`
- **Features**: Loading spinner, type-safe variants via CVA

**Usage**:
```tsx
import { Button } from '@/components/ui/button';
<Button variant="primary" size="md" loading={isSubmitting}>Submit</Button>
```

### Input
**Location**: `src/components/ui/input/`
- **Files**: `input.tsx`, `input.variants.ts`, `index.ts`
- **Variants**: default, error, success
- **Sizes**: sm, md, lg
- **Props**: `error` (boolean), standard HTML input props
- **Features**: Focus states, disabled states, error styling

**Usage**:
```tsx
import { Input } from '@/components/ui/input';
<Input type="email" error={!!errors.email} placeholder="Enter email" />
```

### Alert
**Location**: `src/components/ui/alert/`
- **Files**: `alert.tsx`, `alert.variants.ts`, `index.ts`
- **Variants**: info, success, warning, error
- **Features**: Auto-icons from Lucide, semantic colors, ARIA role="alert"

**Usage**:
```tsx
import { Alert } from '@/components/ui/alert';
<Alert variant="error">Failed to save patient data</Alert>
```

### Badge
**Location**: `src/components/ui/badge/`
- **Files**: `badge.tsx`, `badge.variants.ts`, `index.ts`
- **Variants**: primary, secondary, success, warning, error
- **Features**: Pill-shaped, consistent sizing

**Usage**:
```tsx
import { Badge } from '@/components/ui/badge';
<Badge variant="success">Active</Badge>
```

### Card
**Location**: `src/components/ui/card/`
- **Files**: `card.tsx`, `index.ts`
- **Features**: Standardized padding, border, shadow, hover transitions

**Usage**:
```tsx
import { Card } from '@/components/ui/card';
<Card className="hover:shadow-lg">Content here</Card>
```

### Modal
**Location**: `src/components/ui/modal/`
- **Files**: `modal.tsx`, `index.ts`
- **Sizes**: sm, md, lg, xl
- **Props**: `isOpen`, `onClose`, `title`, `footer`, `size`
- **Features**: Keyboard escape, scroll lock, backdrop click to close

**Usage**:
```tsx
import { Modal } from '@/components/ui/modal';
<Modal isOpen={isOpen} onClose={handleClose} title="Confirm Action" size="md">
  Modal content
</Modal>
```

### Skeleton
**Location**: `src/components/ui/skeleton/`
- **Files**: `skeleton.tsx`, `index.ts`
- **Variants**: text, circular, rectangular
- **Presets**: `SkeletonCard`, `SkeletonTable`
- **Features**: Pulse animation, loading states

**Usage**:
```tsx
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
<Skeleton className="h-4 w-full" />
<SkeletonCard />
```

### Select ✨ NEW
**Location**: `src/components/ui/select/`
- **Files**: `select.tsx`, `index.ts`
- **Features**: Custom styled dropdown, chevron icon, hover effects, shadow transitions
- **Props**: `options`, `placeholder`, `error`, standard HTML select props
- **Visual**: Rounded corners (rounded-lg), shadow-sm hover:shadow-md, purple hover border

**Usage**:
```tsx
import { Select } from '@/components/ui/select';
<Select
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  placeholder="Select an option"
  error={!!errors.field}
/>
```

### Checkbox ✨ NEW
**Location**: `src/components/ui/checkbox/`
- **Files**: `checkbox.tsx`, `index.ts`
- **Features**: Custom styled (no browser default), animated checkmark, hover effects, focus ring
- **Props**: `label`, `description`, standard HTML checkbox props
- **Visual**: Purple accent when checked, smooth transitions, accessible

**Usage**:
```tsx
import { Checkbox } from '@/components/ui/checkbox';
<Checkbox
  label="I agree to terms"
  description="Optional description text"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

### Radio ✨ NEW
**Location**: `src/components/ui/radio/`
- **Files**: `radio.tsx`, `index.ts`
- **Features**: Custom styled (no browser default), animated inner dot, hover effects, focus ring
- **Props**: `label`, `description`, standard HTML radio props
- **Visual**: Circular, purple accent when selected, smooth transitions

**Usage**:
```tsx
import { Radio } from '@/components/ui/radio';
<Radio
  label="Option 1"
  description="Optional description"
  value="option1"
  checked={selected === 'option1'}
  onChange={(e) => setSelected(e.target.value)}
/>
```

### RadioGroup ✨ NEW
**Location**: `src/components/ui/radio-group/`
- **Files**: `radio-group.tsx`, `index.ts`
- **Features**: Group of radio options with two variants - default (radio circles) and button (button-style selectors)
- **Variants**: 
  - `default`: Traditional radio circles with labels
  - `button`: Modern button-style selectors (Male/Female, Yes/No, etc.)
- **Props**: `label`, `options`, `value`, `onChange`, `variant`, `orientation`, `required`, `error`, `hint`
- **Visual**: Button variant has purple background when selected, white when not selected

**Usage (Button Variant)**:
```tsx
import { RadioGroup } from '@/components/ui/radio-group';
<RadioGroup
  label="Status"
  variant="button"
  options={[
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'child', label: 'Child' }
  ]}
  value={formData.status}
  onChange={(value) => setFormData({ ...formData, status: value })}
  required
/>
```

**Usage (Default Variant)**:
```tsx
<RadioGroup
  label="Marital Status"
  variant="default"
  orientation="vertical"
  options={[
    { value: 'single', label: 'Single', description: 'Never married' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' }
  ]}
  value={formData.maritalStatus}
  onChange={(value) => setFormData({ ...formData, maritalStatus: value })}
/>
```

---

## 🏗️ Patterns (Smart Components)

### PageShell
**Location**: `src/components/patterns/page-shell/`
- **Purpose**: Root page wrapper with background
- **Variants**: default, gradient, plain
- **Usage**: Wrap entire page content

**Usage**:
```tsx
import { PageShell } from '@/components/patterns/page-shell';
<PageShell variant="gradient">{children}</PageShell>
```

### AppHeader
**Location**: `src/components/patterns/app-header/`
- **Purpose**: Global navigation bar
- **Features**: Logo, user info, logout button, glassmorphism
- **Auto-includes**: useAuth hook, navigation to dashboard

**Usage**:
```tsx
import { AppHeader } from '@/components/patterns/app-header';
<AppHeader />
```

### PageContent
**Location**: `src/components/patterns/page-content/`
- **Purpose**: Main content wrapper with max-width and padding
- **Max-widths**: sm, md, lg, xl, 2xl, full
- **Default**: lg (max-w-7xl)

**Usage**:
```tsx
import { PageContent } from '@/components/patterns/page-content';
<PageContent maxWidth="lg">{children}</PageContent>
```

### SectionHeader
**Location**: `src/components/patterns/section-header/`
- **Purpose**: Page/section title with optional description and action
- **Props**: `title`, `description`, `action`

**Usage**:
```tsx
import { SectionHeader } from '@/components/patterns/section-header';
<SectionHeader 
  title="Patient Search" 
  description="Search by name, phone, or DOB"
  action={<Button>Add New</Button>}
/>
```

### EmptyState
**Location**: `src/components/patterns/empty-state/`
- **Purpose**: Display when no data/results
- **Props**: `icon` (LucideIcon), `title`, `description`, `action`

**Usage**:
```tsx
import { EmptyState } from '@/components/patterns/empty-state';
import { Users } from 'lucide-react';
<EmptyState 
  icon={Users}
  title="No patients found"
  description="Try a different search term"
  action={{ label: "Add Patient", onClick: handleAdd }}
/>
```

### LoadingState
**Location**: `src/components/patterns/loading-state/`
- **Purpose**: Display during async operations
- **Sizes**: sm, md, lg
- **Props**: `message`, `size`

**Usage**:
```tsx
import { LoadingState } from '@/components/patterns/loading-state';
<LoadingState message="Loading patients..." size="md" />
```

### FormField ✨ ENHANCED
**Location**: `src/components/patterns/form-field/`
- **Purpose**: Unified form field with label, error, hint
- **Props**: `label`, `name`, `value`, `onChange`, `type`, `required`, `disabled`, `error`, `hint`, `sensitive`, `multiline`
- **Features**: HIPAA-sensitive indicator, ARIA attributes, error icons, enhanced styling
- **Visual Improvements**:
  - Bold labels with `font-semibold`
  - Rounded inputs (rounded-lg)
  - Shadow effects (shadow-sm hover:shadow-md)
  - Hover border color (hover:border-primary-300)
  - Better spacing (space-y-2.5)

**Usage**:
```tsx
import { FormField } from '@/components/patterns/form-field';
<FormField
  label="Social Security Number"
  name="ssn"
  value={formData.ssn}
  onChange={handleChange}
  sensitive={true}
  error={errors.ssn}
  hint="Format: XXX-XX-XXXX"
/>
```

### FormSection ✨ NEW
**Location**: `src/components/patterns/form-section/`
- **Purpose**: Group related form fields with visual hierarchy
- **Props**: `title`, `description`, `icon` (LucideIcon), `children`
- **Features**: Icon with purple background, border separator, consistent spacing
- **Visual**: Professional section headers with icons, clear visual separation

**Usage**:
```tsx
import { FormSection } from '@/components/patterns/form-section';
import { User } from 'lucide-react';

<FormSection
  title="Patient Identity"
  description="Basic patient information"
  icon={User}
>
  <FormField label="First Name" ... />
  <FormField label="Last Name" ... />
</FormSection>
```

---

## 🔧 Services

### Toast Service
**Location**: `src/lib/services/toast.service.ts`
- **Export**: `notify` object
- **Methods**:
  - `notify.success(message)` - Green checkmark
  - `notify.error(message)` - Red X (6s duration)
  - `notify.warning(message)` - Yellow alert
  - `notify.info(message)` - Blue info
  - `notify.promise(promise, messages)` - Async operations
  - `notify.hipaaSuccess(action)` - HIPAA-safe success
  - `notify.hipaaError(action)` - HIPAA-safe error

**Setup**: `<Toaster />` mounted once in `App.tsx` (line 19)

**Usage**:
```tsx
import { notify } from '@/lib/services/toast.service';
notify.success('Patient saved successfully');
notify.hipaaSuccess('Patient check-in'); // No sensitive data
```

### Navigation Service
**Location**: `src/lib/services/navigation.service.ts`
- **Export**: `useUnsavedChangesWarning` hook
- **Purpose**: Warn users before leaving page with unsaved changes
- **Features**: Browser beforeunload + React Router blocker

**Usage**:
```tsx
import { useUnsavedChangesWarning } from '@/lib/services/navigation.service';
const [hasChanges, setHasChanges] = useState(false);
useUnsavedChangesWarning(hasChanges);
```

---

## 📐 Layout Patterns

### Standard Page Layout
```tsx
<PageShell variant="gradient">
  <AppHeader />
  <PageContent maxWidth="lg">
    <SectionHeader title="Page Title" description="Description" />
    {/* Page content */}
  </PageContent>
</PageShell>
```

### Form Page Layout
```tsx
<PageShell variant="default">
  <AppHeader />
  <PageContent maxWidth="md">
    <Card>
      <FormField label="Name" name="name" {...props} />
      <FormField label="Email" name="email" {...props} />
      <Button type="submit">Submit</Button>
    </Card>
  </PageContent>
</PageShell>
```

### List/Search Page Layout
```tsx
<PageShell variant="gradient">
  <AppHeader />
  <PageContent>
    <SectionHeader title="Search" />
    <Card>{/* Search input */}</Card>
    {isLoading && <LoadingState />}
    {isEmpty && <EmptyState icon={Users} title="No results" />}
    {results.map(item => <Card key={item.id}>{item}</Card>)}
  </PageContent>
</PageShell>
```

---

## 🎯 Design Principles

### 1. Consistency Over Customization
- Features use primitives + patterns ONLY
- No custom styling in feature components
- Design tokens are the single source of truth

### 2. Accessibility First
- All interactive elements have focus rings
- ARIA attributes on all form fields
- Keyboard navigation support
- Screen reader friendly

### 3. HIPAA Compliance
- Sensitive fields visually marked (`sensitive` prop)
- No sensitive data in toasts (use `notify.hipaaSuccess/Error`)
- Session timeout warnings
- Unsaved data protection

### 4. Type Safety
- CVA for type-safe variants
- TypeScript interfaces for all components
- No runtime variant errors

### 5. Performance
- CVA compiles at build time (no runtime cost)
- Skeleton loaders for perceived performance
- Optimistic UI updates where safe

---

## 🚀 Migration Guide

### Migrating from Old Components

**Old Button** → **New Button**:
```tsx
// OLD
import { Button } from '@/components/common/Button';

// NEW
import { Button } from '@/components/ui/button';
```

**Old Card** → **New Card**:
```tsx
// OLD
import { Card } from '@/components/common/Card';

// NEW
import { Card } from '@/components/ui/card';
```

**Old Toast** → **New Toast Service**:
```tsx
// OLD
import toast from 'react-hot-toast';
toast.success('✅ Success!');

// NEW
import { notify } from '@/lib/services';
notify.success('Success!'); // Icons added automatically
```

**Old Layout** → **New Layout Patterns**:
```tsx
// OLD
<div className="min-h-screen bg-gradient-to-br from-purple-50...">
  <nav className="bg-white/80 backdrop-blur-sm...">...</nav>
  <main className="max-w-7xl mx-auto px-4...">...</main>
</div>

// NEW
<PageShell variant="gradient">
  <AppHeader />
  <PageContent>{/* content */}</PageContent>
</PageShell>
```

---

## 📦 Component Index

### UI Primitives (`src/components/ui/`)
- ✅ Button (responsive sizing)
- ✅ Input (enhanced with shadows & hover)
- ✅ Select ✨ NEW
- ✅ Checkbox ✨ NEW
- ✅ Radio ✨ NEW
- ✅ Alert
- ✅ Badge
- ✅ Card (responsive padding)
- ✅ Modal
- ✅ Skeleton

### Patterns (`src/components/patterns/`)
- ✅ PageShell
- ✅ AppHeader (optimized, no re-renders)
- ✅ PageContent (tablet responsive)
- ✅ SectionHeader (tablet responsive)
- ✅ EmptyState
- ✅ LoadingState
- ✅ FormField (enhanced styling)
- ✅ FormSection ✨ NEW

### Services (`src/lib/services/`)
- ✅ Toast Service (`toast.service.ts`)
- ✅ Navigation Service (`navigation.service.ts`)

### Tokens (`src/lib/tokens/`)
- ✅ Design Tokens (`design-tokens.ts`)
- ✅ Animations (`animations.ts`)

---

## 📝 Maintenance

### Adding New Components
1. Create component in appropriate directory (`ui/` or `patterns/`)
2. Use CVA for variants if applicable
3. Follow existing naming conventions
4. Export from index.ts
5. Update this document with path and usage

### Updating Design Tokens
1. Modify `tailwind.config.js`
2. Update token exports if needed (`src/lib/tokens/`)
3. Test affected components
4. Update this document's "Last Updated" date

### Deprecating Components
1. Add deprecation warning to old component
2. Create migration guide entry
3. Update all imports in features
4. Remove old component after migration complete

---

## 🔗 Related Documentation

- **UI Revamp Plan**: `UI_REVAMP.md` - Original implementation plan
- **Architecture**: `devleopment_management/ARCHITECTURE.md` - App architecture
- **Coding Practices**: `devleopment_management/coding_practices/DEVELOPMENT_PRACTICES.md`

---

## 📞 Support

**Questions about the design system?**
- Check this document first
- Review component source code in `src/components/ui/` or `src/components/patterns/`
- Consult `UI_REVAMP.md` for implementation details

**Need to add a new component?**
- Follow existing patterns in `src/components/ui/`
- Use CVA for variants
- Update this document

---

---

## 🎨 Form Design Enhancements (v1.1.0)

### Visual Improvements

**Input Fields**:
- Rounded corners: `rounded-lg` (8px)
- Enhanced padding: `px-4 py-2.5`
- Font weight: `font-medium` for entered text
- Shadow effects: `shadow-sm hover:shadow-md`
- Hover border: `hover:border-primary-300`
- Smooth transitions: `transition-all duration-normal`

**Labels**:
- Font weight: `font-semibold` (bold)
- Required asterisk: Bold and red
- Sensitive badge: Enhanced with border

**Select Dropdowns**:
- Custom chevron icon
- Matches input styling
- Hover and focus states

**Checkboxes & Radios**:
- Custom styled (no browser defaults)
- Purple accent color
- Animated check/dot
- Hover effects with shadow
- Focus rings for accessibility

**Form Sections**:
- Icon with purple background
- Clear visual hierarchy
- Border separators
- Consistent spacing (space-y-6)

### Responsive Design (Tablet Optimized)

**AppHeader**:
- Sticky positioning (`sticky top-0 z-40`)
- Responsive height: `h-14 sm:h-16`
- Adaptive padding: `px-3 sm:px-4 md:px-6 lg:px-8`
- Text labels hide on small screens
- User info shows only on xl screens
- **Performance**: Wrapped with `React.memo` and `useCallback` to prevent re-renders

**Buttons**:
- Responsive sizing: `px-2.5 sm:px-3` (sm), `px-3 sm:px-4` (md), `px-4 sm:px-6` (lg)
- Responsive text: `text-xs sm:text-sm` (sm), `text-sm sm:text-base` (md)

**Cards**:
- Responsive padding: `p-4 sm:p-5 md:p-card`
- Tighter on mobile, standard on tablet+

**PageContent**:
- Adaptive padding: `px-3 sm:px-4 md:px-6 lg:px-8`
- Adaptive vertical: `py-4 sm:py-6 md:py-8`

**SectionHeader**:
- Stack on mobile: `flex-col sm:flex-row`
- Responsive text: `text-xl sm:text-2xl md:text-heading-lg`
- Truncate long titles

**Dashboard Grid**:
- Mobile: 1 column
- Tablet: 2 columns (`sm:grid-cols-2`)
- Desktop: 3 columns (`lg:grid-cols-3`)
- Responsive gaps: `gap-4 sm:gap-5 md:gap-6`

### Performance Optimizations

**AppHeader Re-render Fix**:
- Wrapped with `React.memo` to prevent unnecessary re-renders
- All navigation handlers use `useCallback` for stable references
- Clicking header buttons no longer causes full component re-render

### Accessibility

All form components include:
- ARIA attributes (`aria-invalid`, `aria-describedby`)
- Focus rings (`focus:ring-2`)
- Keyboard navigation support
- Screen reader friendly labels
- Error announcements with `role="alert"`

---

**End of Design System v1.1.0 Documentation**
