import Checkbox from '../Checkbox';

interface CheckboxItemProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
}

export default function CheckboxItem({ label, description, checked, onChange, error }: CheckboxItemProps) {
    return (
        <div className={`flex items-start p-3 rounded-xl border transition-all duration-200 cursor-pointer
            ${checked 
                ? 'bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-800' 
                : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}
        `} onClick={() => onChange(!checked)}>
            <div className="flex items-center h-5">
                <Checkbox
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="mt-0.5"
                />
            </div>
            <div className="ml-3 select-none">
                <label className={`font-medium text-sm cursor-pointer ${checked ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-200'}`}>
                    {label}
                </label>
                {description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {description}
                    </p>
                )}
            </div>
            {error && <p className="w-full text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}