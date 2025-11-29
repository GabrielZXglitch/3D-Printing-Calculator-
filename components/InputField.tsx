import React from 'react';
import { Info } from 'lucide-react';

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  suffix?: string;
  tooltip?: string;
  step?: string;
  min?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  suffix,
  tooltip,
  step = "any",
  min = "0"
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
          {label}
        </label>
        {tooltip && (
          <div className="group relative">
            <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
            </div>
          </div>
        )}
      </div>
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          min={min}
          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-600 placeholder-slate-400 dark:placeholder-slate-600"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 font-medium pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};