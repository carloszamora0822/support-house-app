import { ASSISTANCE_TYPES } from '@/constants/assistanceTypes';
import { Checkbox } from '@/components/common/Checkbox';
import { Input } from '@/components/common/Input';

interface AssistanceSelectorProps {
  selected: string[];
  onChange: (selected: string[], otherText?: string) => void;
  otherText?: string;
}

export const AssistanceSelector = ({
  selected,
  onChange,
  otherText = '',
}: AssistanceSelectorProps) => {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    const newSelected = checked
      ? [...selected, value]
      : selected.filter((item) => item !== value);
    
    onChange(newSelected, otherText);
  };

  const handleOtherTextChange = (text: string) => {
    onChange(selected, text);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {ASSISTANCE_TYPES.map((type) => (
          <div key={type.value} className="flex items-center">
            <Checkbox
              id={type.value}
              checked={selected.includes(type.value)}
              onChange={(e) => handleCheckboxChange(type.value, e.target.checked)}
            />
            <label htmlFor={type.value} className="ml-2 text-sm text-gray-700 cursor-pointer">
              {type.label}
            </label>
          </div>
        ))}
      </div>

      {selected.includes('other') && (
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Please specify other assistance needed"
            value={otherText}
            onChange={(e) => handleOtherTextChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
