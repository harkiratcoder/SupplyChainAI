import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
          selectedValue !== 'ALL' && selectedValue !== ''
            ? 'border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
        } focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-offset-slate-900`}
      >
        {icon || <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />}
        <span>{label}:</span>
        <span className="font-semibold text-slate-900 dark:text-white">
          {selectedOption ? selectedOption.label : 'All'}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-1.5 w-48 origin-top-right rounded-lg bg-white dark:bg-slate-900 p-1 shadow-dropdown dark:shadow-2xl ring-1 ring-black ring-opacity-5 border border-slate-100 dark:border-slate-800 focus:outline-none">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                selectedValue === option.value
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{option.label}</span>
              {selectedValue === option.value && <Check className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
