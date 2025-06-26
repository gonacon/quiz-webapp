import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    className?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, onChange, options, className }) => {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border rounded bg-white"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectInput;