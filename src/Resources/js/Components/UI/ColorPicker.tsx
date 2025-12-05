import { Icon } from '@iconify/react';
import InputLabel from '../InputLabel';
import TextInput from '../TextInput';

interface ColorPickerProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function ColorPicker({ label, value, onChange, error }: ColorPickerProps) {
    return (
        <div className="w-full">
            {label && <InputLabel htmlFor="color-input" value={label} />}
            <div className="flex items-center gap-3 mt-1">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 ring-2 ring-offset-2 ring-transparent focus-within:ring-indigo-500 dark:ring-offset-slate-900 transition-all">
                    <input
                        id="color-input"
                        type="color"
                        value={value || '#6366f1'}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 m-0 border-none cursor-pointer opacity-0"
                    />
                    <div 
                        className="w-full h-full pointer-events-none" 
                        style={{ backgroundColor: value || '#6366f1' }}
                    />
                </div>
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon icon="solar:pallete-2-bold" className="text-slate-400" />
                    </div>
                    <TextInput
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="font-mono uppercase pl-10"
                        placeholder="#000000"
                    />
                </div>
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}