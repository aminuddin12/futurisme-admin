import { Icon } from '@iconify/react';
import InputLabel from '../InputLabel';

interface Option {
    label: string;
    value: string | number;
    description?: string;
}

interface RadioGroupProps {
    label?: string;
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    error?: string;
    layout?: 'vertical' | 'horizontal';
}

export default function RadioGroup({ label, options, value, onChange, error, layout = 'vertical' }: RadioGroupProps) {
    return (
        <div className="w-full">
            {label && <InputLabel value={label} className="mb-3" />}
            <div className={`gap-3 ${layout === 'horizontal' ? 'grid grid-cols-1 sm:grid-cols-2' : 'space-y-2'}`}>
                {options.map((opt) => {
                    const isSelected = value === opt.value;
                    return (
                        <label 
                            key={String(opt.value)} 
                            className={`
                                relative flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                                ${isSelected 
                                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 dark:border-indigo-500' 
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'}
                            `}
                        >
                            <div className="flex items-center h-5">
                                <input
                                    type="radio"
                                    name={label} // Sebaiknya unique ID
                                    value={opt.value}
                                    checked={isSelected}
                                    onChange={() => onChange(opt.value)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"
                                />
                            </div>
                            <div className="ml-3">
                                <span className={`block text-sm font-medium ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-900 dark:text-slate-200'}`}>
                                    {opt.label}
                                </span>
                                {opt.description && (
                                    <span className={`block text-xs mt-0.5 ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {opt.description}
                                    </span>
                                )}
                            </div>
                            {isSelected && (
                                <Icon icon="heroicons:check-circle-solid" className="absolute top-3 right-3 w-5 h-5 text-indigo-600 dark:text-indigo-500" />
                            )}
                        </label>
                    );
                })}
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}