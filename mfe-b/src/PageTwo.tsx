import React from 'react';
import Select from 'react-select';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

export default function PageTwo() {
  const [selected, setSelected] = React.useState<typeof fruitOptions[number] | null>(null);

  return (
    <div>
      <div>Second page inside MFE B</div>
      <Select
        options={fruitOptions}
        value={selected}
        onChange={(option: any) => setSelected(option)}
        placeholder="Select a fruit"
        isClearable
      />
    </div>
  );
}
