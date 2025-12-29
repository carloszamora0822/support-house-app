import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynamicList } from './DynamicList';

describe('DynamicList', () => {
  const mockRenderItem = vi.fn((item, index, onChange, onRemove) => (
    <div key={index}>
      <input
        type="text"
        value={item.name || ''}
        onChange={(e) => onChange(index, { ...item, name: e.target.value })}
        placeholder="Item name"
      />
      <button onClick={() => onRemove(index)}>Remove</button>
    </div>
  ));

  describe('Initial Rendering', () => {
    it('renders empty list when items array is empty', () => {
      render(
        <DynamicList
          items={[]}
          onItemsChange={() => {}}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
        />
      );

      expect(screen.getByText('Add Item')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Item name')).not.toBeInTheDocument();
    });

    it('renders existing items', () => {
      const items = [
        { name: 'Item 1' },
        { name: 'Item 2' },
      ];

      render(
        <DynamicList
          items={items}
          onItemsChange={() => {}}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
        />
      );

      expect(screen.getByDisplayValue('Item 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Item 2')).toBeInTheDocument();
    });

    it('renders add button with custom text', () => {
      render(
        <DynamicList
          items={[]}
          onItemsChange={() => {}}
          renderItem={mockRenderItem}
          addButtonText="Add Minor Child"
        />
      );

      expect(screen.getByText('Add Minor Child')).toBeInTheDocument();
    });
  });

  describe('Adding Items', () => {
    it('calls onItemsChange with new item when add button clicked', async () => {
      const user = userEvent.setup();
      const onItemsChange = vi.fn();
      const emptyItem = { name: '' };

      render(
        <DynamicList
          items={[]}
          onItemsChange={onItemsChange}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
          emptyItem={emptyItem}
        />
      );

      await user.click(screen.getByText('Add Item'));

      expect(onItemsChange).toHaveBeenCalledWith([emptyItem]);
    });

    it('adds item to existing list', async () => {
      const user = userEvent.setup();
      const onItemsChange = vi.fn();
      const existingItems = [{ name: 'Item 1' }];
      const emptyItem = { name: '' };

      render(
        <DynamicList
          items={existingItems}
          onItemsChange={onItemsChange}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
          emptyItem={emptyItem}
        />
      );

      await user.click(screen.getByText('Add Item'));

      expect(onItemsChange).toHaveBeenCalledWith([
        { name: 'Item 1' },
        { name: '' },
      ]);
    });

    it('uses default empty object when emptyItem not provided', async () => {
      const user = userEvent.setup();
      const onItemsChange = vi.fn();

      render(
        <DynamicList
          items={[]}
          onItemsChange={onItemsChange}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
        />
      );

      await user.click(screen.getByText('Add Item'));

      expect(onItemsChange).toHaveBeenCalledWith([{}]);
    });
  });

  describe('Removing Items', () => {
    it('calls onItemsChange with item removed', async () => {
      const user = userEvent.setup();
      const onItemsChange = vi.fn();
      const items = [
        { name: 'Item 1' },
        { name: 'Item 2' },
        { name: 'Item 3' },
      ];

      render(
        <DynamicList
          items={items}
          onItemsChange={onItemsChange}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
        />
      );

      const removeButtons = screen.getAllByText('Remove');
      await user.click(removeButtons[1]); // Remove second item

      expect(onItemsChange).toHaveBeenCalledWith([
        { name: 'Item 1' },
        { name: 'Item 3' },
      ]);
    });

    it('removes last item from list', async () => {
      const user = userEvent.setup();
      const onItemsChange = vi.fn();
      const items = [{ name: 'Only Item' }];

      render(
        <DynamicList
          items={items}
          onItemsChange={onItemsChange}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
        />
      );

      await user.click(screen.getByText('Remove'));

      expect(onItemsChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Updating Items', () => {
    it('calls onItemsChange when item is modified', async () => {
      const user = userEvent.setup();
      const onItemsChange = vi.fn();
      const items = [{ name: '' }];

      render(
        <DynamicList
          items={items}
          onItemsChange={onItemsChange}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
        />
      );

      const input = screen.getByPlaceholderText('Item name');
      await user.type(input, 'X');

      expect(onItemsChange).toHaveBeenCalledWith([{ name: 'X' }]);
    });

    it('updates correct item in list', async () => {
      const user = userEvent.setup();
      const onItemsChange = vi.fn();
      const items = [
        { name: 'Item 1' },
        { name: '' },
        { name: 'Item 3' },
      ];

      render(
        <DynamicList
          items={items}
          onItemsChange={onItemsChange}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
        />
      );

      const inputs = screen.getAllByPlaceholderText('Item name');
      await user.type(inputs[1], 'X');

      expect(onItemsChange).toHaveBeenCalledWith([
        { name: 'Item 1' },
        { name: 'X' },
        { name: 'Item 3' },
      ]);
    });
  });

  describe('Maximum Items', () => {
    it('hides add button when max items reached', () => {
      const items = [
        { name: 'Item 1' },
        { name: 'Item 2' },
        { name: 'Item 3' },
      ];

      render(
        <DynamicList
          items={items}
          onItemsChange={() => {}}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
          maxItems={3}
        />
      );

      expect(screen.queryByText('Add Item')).not.toBeInTheDocument();
    });

    it('shows add button when below max items', () => {
      const items = [{ name: 'Item 1' }];

      render(
        <DynamicList
          items={items}
          onItemsChange={() => {}}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
          maxItems={3}
        />
      );

      expect(screen.getByText('Add Item')).toBeInTheDocument();
    });

    it('shows add button when maxItems not specified', () => {
      const items = [
        { name: 'Item 1' },
        { name: 'Item 2' },
        { name: 'Item 3' },
        { name: 'Item 4' },
        { name: 'Item 5' },
      ];

      render(
        <DynamicList
          items={items}
          onItemsChange={() => {}}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
        />
      );

      expect(screen.getByText('Add Item')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <DynamicList
          items={[]}
          onItemsChange={() => {}}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
          className="custom-list"
        />
      );

      expect(container.firstChild).toHaveClass('custom-list');
    });
  });

  describe('Empty State', () => {
    it('renders empty state message when provided and list is empty', () => {
      render(
        <DynamicList
          items={[]}
          onItemsChange={() => {}}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
          emptyMessage="No items added yet"
        />
      );

      expect(screen.getByText('No items added yet')).toBeInTheDocument();
    });

    it('does not render empty state when items exist', () => {
      render(
        <DynamicList
          items={[{ name: 'Item 1' }]}
          onItemsChange={() => {}}
          renderItem={mockRenderItem}
          addButtonText="Add Item"
          emptyMessage="No items added yet"
        />
      );

      expect(screen.queryByText('No items added yet')).not.toBeInTheDocument();
    });
  });
});
