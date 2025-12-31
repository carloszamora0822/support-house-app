import { useState } from 'react';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Plus, Trash2 } from 'lucide-react';
import type { AssistanceItemInput } from '@/services/assistanceItemService';

interface AssistanceTrackingSectionProps {
  items: AssistanceItemInput[];
  onChange: (items: AssistanceItemInput[]) => void;
  title?: string;
  description?: string;
}

const ASSISTANCE_TYPES = [
  { value: 'food', label: '🍎 Food', needsDetails: true },
  { value: 'gas_card', label: '⛽ Gas Card', needsDetails: true },
  { value: 'store_voucher', label: '🎫 Store Voucher', needsDetails: true },
  { value: 'wigs', label: '💇 Wigs/Salon', needsDetails: true },
  { value: 'medical_supplies', label: '🏥 Medical Supplies', needsDetails: true },
  { value: 'liquid_nutrition', label: '🥤 Liquid Nutrition', needsDetails: true },
  { value: 'incontinence', label: '🧻 Incontinence Supplies', needsDetails: true },
  { value: 'clothing', label: '👕 Clothing', needsDetails: true },
  { value: 'support_group', label: '🤝 Support Group', needsDetails: false },
  { value: 'other', label: '📦 Other', needsDetails: true },
];

const FOOD_CATEGORIES = [
  { value: 'canned_goods', label: 'Canned Goods' },
  { value: 'fresh_produce', label: 'Fresh Produce' },
  { value: 'frozen_meals', label: 'Frozen Meals' },
  { value: 'dry_goods', label: 'Dry Goods (Rice, Pasta)' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'dairy', label: 'Dairy Products' },
  { value: 'meat', label: 'Meat/Protein' },
  { value: 'bakery', label: 'Bakery Items' },
  { value: 'other', label: 'Other' },
];

const UNITS = [
  { value: 'items', label: 'Items' },
  { value: 'boxes', label: 'Boxes' },
  { value: 'cans', label: 'Cans' },
  { value: 'bags', label: 'Bags' },
  { value: 'bottles', label: 'Bottles' },
  { value: 'lbs', label: 'Pounds' },
  { value: 'cards', label: 'Cards' },
  { value: 'vouchers', label: 'Vouchers' },
];

export function AssistanceTrackingSection({
  items = [],
  onChange,
  title = 'Assistance Provided',
  description = 'Track items and services provided to the patient',
}: AssistanceTrackingSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<AssistanceItemInput>({
    assistance_type: 'food',
    item_name: '',
    quantity: 1,
    unit: 'items',
  });

  const handleAddItem = () => {
    if (!newItem.item_name && newItem.assistance_type !== 'support_group') {
      return; // Require item name for most types
    }

    onChange([...items, { ...newItem }]);
    
    // Reset form
    setNewItem({
      assistance_type: 'food',
      item_name: '',
      quantity: 1,
      unit: 'items',
    });
    setShowAddForm(false);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleUpdateNewItem = (field: keyof AssistanceItemInput, value: string | number | undefined) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const selectedType = ASSISTANCE_TYPES.find(t => t.value === newItem.assistance_type);
  const needsDetails = selectedType?.needsDetails ?? true;

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>

        {/* List of added items */}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item, index) => {
              const type = ASSISTANCE_TYPES.find(t => t.value === item.assistance_type);
              return (
                <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{type?.label || item.assistance_type}</span>
                      {item.item_name && <span className="text-gray-600">- {item.item_name}</span>}
                    </div>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      {item.quantity && item.quantity > 1 && (
                        <div>Quantity: {item.quantity} {item.unit || 'items'}</div>
                      )}
                      {item.card_number && (
                        <div>Card/Voucher #: {item.card_number}</div>
                      )}
                      {item.amount && (
                        <div>Amount: ${item.amount.toFixed(2)}</div>
                      )}
                      {item.category && (
                        <div>Category: {FOOD_CATEGORIES.find(c => c.value === item.category)?.label || item.category}</div>
                      )}
                      {item.description && (
                        <div>Details: {item.description}</div>
                      )}
                      {item.notes && (
                        <div>Notes: {item.notes}</div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add new item form */}
        {showAddForm ? (
          <div className="border border-gray-300 rounded-lg p-4 bg-white space-y-4">
            {/* Type selector */}
            <Select
              label="Type of Assistance"
              value={newItem.assistance_type}
              onChange={(e) => handleUpdateNewItem('assistance_type', e.target.value)}
              required
              placeholder="Select Type"
              options={ASSISTANCE_TYPES.map(type => ({ value: type.value, label: type.label }))}
            />

            {needsDetails && (
              <>
                {/* Item name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItem.item_name || ''}
                    onChange={(e) => handleUpdateNewItem('item_name', e.target.value)}
                    placeholder={
                      newItem.assistance_type === 'food' ? 'e.g., Jello, Soup, Bread' :
                      newItem.assistance_type === 'gas_card' ? 'e.g., Shell Gas Card' :
                      newItem.assistance_type === 'store_voucher' ? 'e.g., Aldi Voucher' :
                      'Item name'
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Quantity and Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.quantity || 1}
                      onChange={(e) => handleUpdateNewItem('quantity', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={newItem.unit || 'items'}
                      onChange={(e) => handleUpdateNewItem('unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {UNITS.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gas Card / Voucher specific fields */}
                {(newItem.assistance_type === 'gas_card' || newItem.assistance_type === 'store_voucher') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card/Voucher Number
                      </label>
                      <input
                        type="text"
                        value={newItem.card_number || ''}
                        onChange={(e) => handleUpdateNewItem('card_number', e.target.value)}
                        placeholder="e.g., #334, GC-2025-001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.amount || ''}
                        onChange={(e) => handleUpdateNewItem('amount', parseFloat(e.target.value))}
                        placeholder="50.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </>
                )}

                {/* Food category */}
                {newItem.assistance_type === 'food' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Food Category
                    </label>
                    <select
                      value={newItem.category || ''}
                      onChange={(e) => handleUpdateNewItem('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select category...</option>
                      {FOOD_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newItem.description || ''}
                    onChange={(e) => handleUpdateNewItem('description', e.target.value)}
                    placeholder="Additional details..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newItem.notes || ''}
                    onChange={(e) => handleUpdateNewItem('notes', e.target.value)}
                    placeholder="Any additional notes..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setNewItem({
                    assistance_type: 'food',
                    item_name: '',
                    quantity: 1,
                    unit: 'items',
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddItem}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Add Item
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Assistance Item
          </Button>
        )}

        {items.length === 0 && !showAddForm && (
          <p className="text-sm text-gray-500 text-center py-4">
            No assistance items added yet. Click "Add Assistance Item" to track what was provided.
          </p>
        )}
      </div>
    </Card>
  );
}
