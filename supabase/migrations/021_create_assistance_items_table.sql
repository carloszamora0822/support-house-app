-- Create assistance_items table for detailed tracking of items provided to patients
-- Works for both intake and check-in visits

CREATE TABLE IF NOT EXISTS assistance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  
  -- Type of assistance
  assistance_type TEXT NOT NULL,
  -- 'food', 'gas_card', 'store_voucher', 'wigs', 'medical_supplies', 
  -- 'liquid_nutrition', 'incontinence', 'clothing', 'support_group', 'other'
  
  -- Item details
  item_name TEXT, -- e.g., "Jello", "Gas Card", "Aldi Voucher"
  quantity INTEGER DEFAULT 1,
  unit TEXT, -- 'items', 'boxes', 'cans', 'bags', 'cards', 'vouchers'
  
  -- Specific identifiers
  card_number TEXT, -- For gas cards, gift cards, vouchers
  amount DECIMAL(10,2), -- Dollar amount for cards/vouchers
  
  -- Additional context
  category TEXT, -- For food: 'canned_goods', 'fresh_produce', etc.
  description TEXT, -- Free text description
  notes TEXT,
  
  -- Tracking
  provided_by UUID REFERENCES users(id),
  provided_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_assistance_items_visit ON assistance_items(visit_id);
CREATE INDEX idx_assistance_items_patient ON assistance_items(patient_id);
CREATE INDEX idx_assistance_items_type ON assistance_items(assistance_type);
CREATE INDEX idx_assistance_items_date ON assistance_items(provided_at);

-- Enable RLS
ALTER TABLE assistance_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all assistance items"
  ON assistance_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert assistance items"
  ON assistance_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update assistance items"
  ON assistance_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete assistance items"
  ON assistance_items FOR DELETE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_assistance_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER assistance_items_updated_at
  BEFORE UPDATE ON assistance_items
  FOR EACH ROW
  EXECUTE FUNCTION update_assistance_items_updated_at();

-- Comments
COMMENT ON TABLE assistance_items IS 'Detailed tracking of assistance items provided to patients during visits';
COMMENT ON COLUMN assistance_items.assistance_type IS 'Type of assistance: food, gas_card, store_voucher, wigs, medical_supplies, etc.';
COMMENT ON COLUMN assistance_items.card_number IS 'Card/voucher number for tracking (e.g., gas card #334, Aldi voucher #A123)';
COMMENT ON COLUMN assistance_items.amount IS 'Dollar amount for cards/vouchers (e.g., $50 Aldi voucher)';
COMMENT ON COLUMN assistance_items.category IS 'Sub-category for items like food (canned_goods, fresh_produce, etc.)';
