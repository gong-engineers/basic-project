'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

function QuantitySelector(props: Props) {
  const { value, min = 1, max = 99, onChange } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === '') {
      onChange(min);
      return;
    }

    const parsed = parseInt(rawValue, 10);
    if (isNaN(parsed)) {
      return;
    }

    onChange(Math.max(min, Math.min(max, parsed)));
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={() => onChange(Math.max(value - 1, min))}
        disabled={value === min}
      >
        -
      </Button>
      <Input
        type="number"
        value={String(value)}
        onChange={handleChange}
        className="w-16 text-center"
      />
      <Button
        size="sm"
        onClick={() => onChange(Math.min(value + 1, max))}
        disabled={value === max}
      >
        +
      </Button>
    </div>
  );
}

export default QuantitySelector;
