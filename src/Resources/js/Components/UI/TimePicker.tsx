import { Icon } from '@iconify/react';
import InputLabel from '../InputLabel';

interface TimePickerProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function TimePicker({ label, value, onChange, error }: TimePickerProps) {
    return (
        <div className="w-full">
            {label && <InputLabel value={label} />}
            <div className="relative mt-1 group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon icon="solar:clock-circle-bold" className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                    type="time"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="
                        block w-full pl-10 pr-4 py-2.5 text-sm 
                        bg-white border border-slate-300 rounded-lg shadow-sm
                        text-slate-900 placeholder-slate-400
                        focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none
                        dark:bg-slate-900 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500
                        transition-all
                        [color-scheme:light] dark:[color-scheme:dark]
                    "
                />
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}