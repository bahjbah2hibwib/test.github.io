import React from 'react';

interface InputGroupProps {
  label: string;
  icon: React.ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  list?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, icon, name, value, onChange, placeholder, list, onFocus, onBlur }) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
        {icon}
        {label}:
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        list={list}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete="off"
        className="w-full px-3 py-2 text-gray-700 bg-white/80 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
    </div>
  );
};

export default InputGroup;
