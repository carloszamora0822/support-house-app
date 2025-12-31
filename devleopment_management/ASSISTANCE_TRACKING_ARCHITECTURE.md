# Assistance Tracking System Architecture

## Overview
Enhanced assistance tracking system that captures detailed information about items provided to patients, including quantities, types, and specific identifiers (e.g., gas card numbers).

## Database Schema

### New Table: `assistance_items`
```sql
CREATE TABLE assistance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  assistance_type TEXT NOT NULL, -- 'food', 'gas_card', 'wigs', 'medical_supplies', etc.
  
  -- Food-specific fields
  food_category TEXT, -- 'canned_goods', 'fresh_produce', 'frozen_meals', 'snacks', 'beverages'
  food_items JSONB, -- [{ name: 'Canned Soup', quantity: 5, unit: 'cans' }]
  
  -- Gas card-specific fields
  gas_card_number TEXT,
  gas_card_amount DECIMAL(10,2),
  
  -- General fields
  item_description TEXT,
  quantity INTEGER,
  unit TEXT, -- 'items', 'bags', 'boxes', 'cards'
  
  -- Metadata
  notes TEXT,
  provided_by UUID REFERENCES users(id),
  provided_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assistance_items_visit ON assistance_items(visit_id);
CREATE INDEX idx_assistance_items_patient ON assistance_items(patient_id);
CREATE INDEX idx_assistance_items_type ON assistance_items(assistance_type);
```

## Data Structure

### Assistance Type Configurations
```typescript
interface AssistanceTypeConfig {
  value: string;
  label: string;
  requiresDetails: boolean;
  detailType: 'food' | 'gas_card' | 'quantity' | 'none';
  icon: string;
}

const ASSISTANCE_TYPE_CONFIGS: AssistanceTypeConfig[] = [
  {
    value: 'food',
    label: 'Food',
    requiresDetails: true,
    detailType: 'food',
    icon: '🍎'
  },
  {
    value: 'gas_card',
    label: 'Gas Card',
    requiresDetails: true,
    detailType: 'gas_card',
    icon: '⛽'
  },
  {
    value: 'wigs',
    label: 'Wigs/Salon',
    requiresDetails: true,
    detailType: 'quantity',
    icon: '💇'
  },
  {
    value: 'medical_supplies',
    label: 'Medical Supplies',
    requiresDetails: true,
    detailType: 'quantity',
    icon: '🏥'
  },
  {
    value: 'liquid_nutrition',
    label: 'Liquid Nutrition',
    requiresDetails: true,
    detailType: 'quantity',
    icon: '🥤'
  },
  {
    value: 'incontinence',
    label: 'Incontinence Supplies',
    requiresDetails: true,
    detailType: 'quantity',
    icon: '🧻'
  },
  {
    value: 'clothing',
    label: 'Clothing',
    requiresDetails: true,
    detailType: 'quantity',
    icon: '👕'
  },
  {
    value: 'support_group',
    label: 'Support Group',
    requiresDetails: false,
    detailType: 'none',
    icon: '🤝'
  },
  {
    value: 'other',
    label: 'Other',
    requiresDetails: true,
    detailType: 'quantity',
    icon: '📦'
  }
];
```

### Food Categories
```typescript
const FOOD_CATEGORIES = [
  { value: 'canned_goods', label: 'Canned Goods' },
  { value: 'fresh_produce', label: 'Fresh Produce' },
  { value: 'frozen_meals', label: 'Frozen Meals' },
  { value: 'dry_goods', label: 'Dry Goods (Rice, Pasta, etc.)' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'dairy', label: 'Dairy Products' },
  { value: 'meat', label: 'Meat/Protein' },
  { value: 'bakery', label: 'Bakery Items' },
  { value: 'other', label: 'Other' }
];

interface FoodItem {
  name: string;
  quantity: number;
  unit: string; // 'cans', 'boxes', 'bags', 'items', 'lbs'
  category: string;
}
```

## UI Components

### 1. Dynamic Assistance Detail Collector
Component that renders different input forms based on assistance type selected.

**Location:** `/src/features/checkin/components/AssistanceDetailCollector.tsx`

```typescript
interface AssistanceDetailCollectorProps {
  assistanceType: string;
  value: AssistanceDetail;
  onChange: (detail: AssistanceDetail) => void;
}

// Renders:
// - FoodDetailForm for 'food'
// - GasCardDetailForm for 'gas_card'
// - QuantityDetailForm for quantity-based items
// - Nothing for 'none' types
```

### 2. Food Detail Form
**Location:** `/src/features/checkin/components/FoodDetailForm.tsx`

Features:
- Category selector (dropdown)
- Dynamic item list with add/remove
- Each item: name, quantity, unit
- Total items count display

### 3. Gas Card Detail Form
**Location:** `/src/features/checkin/components/GasCardDetailForm.tsx`

Features:
- Card number input (text)
- Amount input (currency)
- Validation for card number format

### 4. Quantity Detail Form
**Location:** `/src/features/checkin/components/QuantityDetailForm.tsx`

Features:
- Item description (text)
- Quantity (number)
- Unit selector (dropdown: items, bags, boxes, etc.)
- Notes (textarea)

## Workflow

### Check-In Flow
1. Staff selects assistance types (checkboxes)
2. For each selected type with `requiresDetails: true`:
   - Show detail collector component
   - Collect specific information
3. On submit:
   - Create visit record
   - Create assistance_items records for each item
   - Link to visit and patient

### Intake Form Flow
1. Patient/staff fills out intake form
2. Assistance section shows checkboxes
3. For each selected type:
   - Show detail collector
   - Collect information
4. On submit:
   - Save patient
   - Create initial visit
   - Create assistance_items records

## Services

### assistanceItemService.ts
```typescript
export const assistanceItemService = {
  async createAssistanceItems(
    visitId: string,
    patientId: string,
    items: AssistanceItemInput[]
  ): Promise<{ success: boolean; error?: string }>,
  
  async getAssistanceItemsForVisit(
    visitId: string
  ): Promise<AssistanceItem[]>,
  
  async getAssistanceItemsForPatient(
    patientId: string,
    limit?: number
  ): Promise<AssistanceItem[]>,
  
  async updateAssistanceItem(
    itemId: string,
    updates: Partial<AssistanceItem>
  ): Promise<{ success: boolean; error?: string }>,
  
  async deleteAssistanceItem(
    itemId: string
  ): Promise<{ success: boolean; error?: string }>
};
```

## Display/Reporting

### Visit History Display
Show detailed assistance items for each visit:
```
Visit: December 30, 2025
Assistance Provided:
  🍎 Food:
    - Canned Goods: 12 cans (Soup, Vegetables, Beans)
    - Fresh Produce: 5 lbs (Apples, Carrots)
    - Frozen Meals: 8 boxes
  ⛽ Gas Card:
    - Card #: GC-2025-001234
    - Amount: $50.00
  💇 Wigs/Salon: 1 wig
  🏥 Medical Supplies: 2 boxes (Gauze, bandages)
```

### Analytics/Reporting
- Total items provided per type
- Most requested assistance types
- Gas card tracking and totals
- Food category distribution
- Monthly/yearly summaries

## Migration Steps

1. Create `assistance_items` table
2. Migrate existing `assistance_types` array data to new table
3. Update CheckInModal component
4. Update intake form components
5. Create detail collector components
6. Update visit history display
7. Add reporting/analytics views

## Benefits

1. **Detailed Tracking:** Know exactly what was provided
2. **Inventory Management:** Track quantities of items given
3. **Gas Card Accountability:** Track card numbers and amounts
4. **Better Reporting:** Detailed analytics on assistance provided
5. **Audit Trail:** Complete history of what was given to whom
6. **Compliance:** Better documentation for grants/funding

## Implementation Priority

**Phase 1 (Core):**
- Database migration
- assistanceItemService
- Basic detail collectors (food, gas card, quantity)
- CheckInModal integration

**Phase 2 (Enhanced):**
- Intake form integration
- Visit history display updates
- Analytics dashboard

**Phase 3 (Advanced):**
- Inventory tracking
- Low stock alerts
- Automated reporting
- Export functionality
