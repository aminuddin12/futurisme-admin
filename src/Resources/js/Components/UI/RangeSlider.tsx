import InputLabel from '../InputLabel';

interface RangeSliderProps {
    label?: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    error?: string;
}

export default function RangeSlider({ label, value, onChange, min = 0, max = 100, step = 1, unit = '', error }: RangeSliderProps) {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                {label && <InputLabel value={label} className="mb-0" />}
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800">
                    {value}{unit}
                </span>
            </div>
            <div className="relative w-full h-6 flex items-center">
                <div className="absolute w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value || 0}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
                />
                <div 
                    className="absolute h-4 w-4 bg-white border-2 border-indigo-600 rounded-full shadow-md pointer-events-none transition-all"
                    style={{ left: `calc(${percentage}% - 8px)` }}
                />
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}