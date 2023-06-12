import { useState } from "react";

type Option = {
  value: string,
  label: string
};

type Props = {
  options: Option[]
};

const MultiSelect: React.FC<Props> = ({ options }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const toggleOption = (optionValue: string): void => {
    if (selectedOptions.includes(optionValue)) {
      setSelectedOptions(selectedOptions.filter((value) => value !== optionValue));
    } else {
      setSelectedOptions([...selectedOptions, optionValue]);
    }
  };

  const toggleSelectAll = ():void => {
    if (selectedOptions.length === options.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(options.map((option) => option.value));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>):void => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>):void => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      setSelectedOptions([...selectedOptions, inputValue.trim()]);
      setInputValue("");
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <button
          className="bg-gray-200 py-1 px-3 rounded-md border border-gray-300 flex items-center space-x-2"
          onClick={toggleSelectAll}
        >
          <input
            type="checkbox"
            checked={selectedOptions.length === options.length}
            readOnly
            className="form-checkbox rounded-md border-gray-400"
          />
          <span>Select all</span>
        </button>
        <div className="absolute w-full mt-1 rounded-md bg-white border border-gray-300 shadow-md">
          {options.map((option) => (
            <label key={option.value} className="flex items-center p-2">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.value)}
                onChange={() => toggleOption(option.value)}
                className="form-checkbox rounded-md border-gray-400"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
          <div className="border-t border-gray-300 p-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="Type to add..."
              className="w-full p-1 rounded-md border border-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const options: Option[] = [
  { value: "Chinese", label: "Chinese" },
  { value: "English", label: "English" },
  { value: "Japanese", label: "Japanese" },
];

const MultipleSelect = (): JSX.Element => {
  return (
    <div className="p-4">
      <MultiSelect options={options} />
    </div>
  );
};

export { MultipleSelect };
