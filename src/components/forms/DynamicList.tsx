import React from 'react';
import { Button } from '../common/Button';

interface DynamicListProps<T> {
  items: T[];
  onItemsChange: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    onChange: (index: number, updatedItem: T) => void,
    onRemove: (index: number) => void
  ) => React.ReactNode;
  addButtonText: string;
  emptyItem?: T;
  maxItems?: number;
  emptyMessage?: string;
  className?: string;
}

export function DynamicList<T>({
  items,
  onItemsChange,
  renderItem,
  addButtonText,
  emptyItem,
  maxItems,
  emptyMessage,
  className = '',
}: DynamicListProps<T>) {
  const handleAdd = () => {
    const newItem = emptyItem ?? ({} as T);
    onItemsChange([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onItemsChange(updatedItems);
  };

  const handleChange = (index: number, updatedItem: T) => {
    const updatedItems = items.map((item, i) => (i === index ? updatedItem : item));
    onItemsChange(updatedItems);
  };

  const showAddButton = maxItems === undefined || items.length < maxItems;

  return (
    <div className={className}>
      {items.length === 0 && emptyMessage && (
        <p className="text-gray-500 text-sm mb-4">{emptyMessage}</p>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            {renderItem(item, index, handleChange, handleRemove)}
          </div>
        ))}
      </div>

      {showAddButton && (
        <Button
          onClick={handleAdd}
          variant="secondary"
          className="mt-4"
          type="button"
        >
          {addButtonText}
        </Button>
      )}
    </div>
  );
}
