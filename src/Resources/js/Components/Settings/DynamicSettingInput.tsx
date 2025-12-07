import { useState, useEffect, useRef, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import TextInput from '../TextInput';
import InputLabel from '../InputLabel';
import InputError from '../InputError';
import ImagePickerSmall from '../UI/ImagePickerSmall';
import ColorPicker from '../UI/ColorPicker';

// --- Interfaces ---
interface SettingItem {
    id: number;
    key: string;
    title: string;
    value: any;
    type: string;
    form_type: string;
    group: string;
    by_module: string;
    option?: any[] | null;
    is_active?: number;
    add_by?: string;
}

interface DynamicSettingInputProps {
    setting: SettingItem;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

// --- Helper Components ---

// 1. Custom Select / Select Search Component
const CustomSelect = ({ 
    value, 
    onChange, 
    options = [], 
    searchable = false, 
    placeholder = "Select...",
    disabled = false
}: { 
    value: any, 
    onChange: (val: any) => void, 
    options: any[], 
    searchable?: boolean, 
    placeholder?: string,
    disabled?: boolean
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options
    const filteredOptions = useMemo(() => {
        if (!searchable || !searchTerm) return options;
        return options.filter(opt => {
            const label = typeof opt === 'object' ? opt.label : opt;
            return String(label).toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [options, searchTerm, searchable]);

    const selectedLabel = useMemo(() => {
        const found = options.find(opt => (typeof opt === 'object' ? opt.value : opt) == value);
        if (!found) return value || placeholder;
        return typeof found === 'object' ? found.label : found;
    }, [options, value, placeholder]);

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm transition-all duration-200
                    ${disabled ? 'opacity-60 cursor-not-allowed border-slate-200 dark:border-slate-800' : 'cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500'}
                    ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-300 dark:border-slate-700'}
                `}
            >
                <span className={`truncate ${!value ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {selectedLabel}
                </span>
                <Icon 
                    icon="solar:alt-arrow-down-bold" 
                    className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} 
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden"
                    >
                        {searchable && (
                            <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <div className="relative">
                                    <Icon icon="solar:magnifer-linear" className="absolute left-3 top-2.5 text-slate-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:text-slate-200"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}
                        
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt, idx) => {
                                    const val = typeof opt === 'object' ? opt.value : opt;
                                    const label = typeof opt === 'object' ? opt.label : opt;
                                    const isSelected = val == value;
                                    
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                onChange(val);
                                                setIsOpen(false);
                                                setSearchTerm('');
                                            }}
                                            className={`
                                                w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 flex items-center justify-between
                                                ${isSelected 
                                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium' 
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}
                                            `}
                                        >
                                            {label}
                                            {isSelected && <Icon icon="solar:check-circle-bold" />}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-3 text-center text-xs text-slate-400">No options found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Component ---

export default function DynamicSettingInput({ setting, value, onChange, error }: DynamicSettingInputProps) {
    // 3 = disabled/readonly
    const isReadOnly = setting.is_active === 3; 

    // Handle standard text change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    // --- RENDERERS ---

    // 1. Text
    if (setting.form_type === 'text') {
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <TextInput
                    id={setting.key}
                    type="text"
                    value={value ?? ''}
                    className="w-full"
                    onChange={handleChange}
                    disabled={isReadOnly}
                    placeholder={`Enter ${setting.title}...`}
                />
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 2. Textarea (Darkmode supported, thin border)
    if (setting.form_type === 'textarea') {
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <textarea
                    id={setting.key}
                    value={value ?? ''}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    rows={4}
                    className="w-full text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors placeholder-slate-400"
                    placeholder={`Enter description...`}
                />
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 3. App URL (HTTPS Detection)
    if (setting.form_type === 'app-url') {
        const isHttps = typeof value === 'string' && value.startsWith('https://');
        
        // Force http://localhost behavior if not https, unless user manually edits
        const effectiveValue = value ?? '';
        
        // Logic: Jika user mengetik https, enable. Jika http, warn/disable? 
        // Request: "jika https maka gunakan domain asli... dan aktifkan form, jika http maka tulis dengan http://localhost dan disable input"
        // This is tricky for UX. We will allow typing, but check protocol.
        
        const isLocalhost = effectiveValue.includes('localhost') || effectiveValue.startsWith('http://');
        
        // Strict implementation of requirement:
        const displayValue = isHttps ? effectiveValue : 'http://localhost';
        const isDisabled = !isHttps && isReadOnly; // Logic agak konflik, kita buat editable tapi ada toggle

        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <div className="relative">
                    <TextInput
                        id={setting.key}
                        type="url"
                        // Jika bukan https, paksa tampilkan localhost (sesuai req nomor 3 - "nilai form tetap pada http://localhost")
                        value={displayValue} 
                        className={`w-full pr-10 ${!isHttps ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : ''}`}
                        onChange={(e) => {
                            // Izinkan user mengubah, nanti validasi ulang di render berikutnya
                            onChange(e.target.value);
                        }}
                        // Disable jika mode HTTP terdeteksi agar tidak diubah (sesuai req)
                        // Tapi kita butuh cara untuk mengubah ke HTTPS? Kita biarkan enabled jika user menghapus isi.
                        // "disable input agar tidak di ubah" -> Kita kunci readOnly jika http://localhost
                        readOnly={!isHttps && displayValue === 'http://localhost'}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                        {isHttps ? (
                            <Icon icon="solar:shield-check-bold" className="text-green-500" width="20" />
                        ) : (
                            <div className="group relative">
                                <Icon icon="solar:shield-warning-bold" className="text-amber-500 cursor-help" width="20" />
                                <span className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg hidden group-hover:block z-10">
                                    Not secure. Using localhost default.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                {!isHttps && (
                    <button 
                        type="button" 
                        onClick={() => onChange('https://')}
                        className="text-xs text-indigo-500 hover:underline mt-1"
                    >
                        Switch to HTTPS (Production Domain)
                    </button>
                )}
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 4. App URL Full (Prefix + Text Input)
    if (setting.form_type === 'app-url-full') {
        // Kita butuh prefix. Karena tidak ada akses ke setting lain, kita gunakan window.location.origin
        // atau asumsi visual saja.
        const prefix = typeof window !== 'undefined' ? window.location.origin + '/' : 'http://your-domain.com/';
        
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <div className="flex shadow-sm rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                    <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2.5 flex items-center border-r border-slate-300 dark:border-slate-700">
                        <span className="text-slate-500 text-sm whitespace-nowrap">{prefix}</span>
                    </div>
                    <input
                        type="text"
                        id={setting.key}
                        value={value ?? ''}
                        onChange={handleChange}
                        disabled={isReadOnly}
                        className="flex-1 border-none focus:ring-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 text-sm py-2.5 px-3"
                        placeholder="admin"
                    />
                </div>
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 5. Select (Custom Animation) & 6. Select Search
    if (['select', 'select-search'].includes(setting.form_type)) {
        const options = Array.isArray(setting.option) ? setting.option : [];
        const isSearchable = setting.form_type === 'select-search';

        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <CustomSelect 
                    value={value} 
                    onChange={onChange} 
                    options={options} 
                    searchable={isSearchable}
                    placeholder={`Select ${setting.title}...`}
                    disabled={isReadOnly}
                />
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 7. Toggle
    if (setting.form_type === 'toggle') {
        const isChecked = value === true || value === 'true' || value === 1 || value === '1';
        return (
            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex flex-col">
                    <InputLabel htmlFor={setting.key} value={setting.title} className="mb-1 cursor-pointer" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {isChecked ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => !isReadOnly && onChange(!isChecked)}
                    disabled={isReadOnly}
                    className={`
                        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                        ${isChecked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}
                        ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <span
                        aria-hidden="true"
                        className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${isChecked ? 'translate-x-5' : 'translate-x-0'}
                        `}
                    />
                </button>
            </div>
        );
    }

    // 8. URL External (Validation)
    if (setting.form_type === 'url-ext') {
        const isValidHttps = typeof value === 'string' && value.startsWith('https://');
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <div className="relative">
                    <TextInput
                        id={setting.key}
                        type="url"
                        value={value ?? ''}
                        className={`w-full pl-10 ${value && !isValidHttps ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        onChange={handleChange}
                        disabled={isReadOnly}
                        placeholder="https://example.com"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon 
                            icon="solar:link-circle-bold" 
                            className={value && !isValidHttps ? "text-red-500" : "text-slate-400"} 
                            width="20" 
                        />
                    </div>
                </div>
                {value && !isValidHttps && (
                    <p className="text-xs text-red-500 mt-1">Must start with https://</p>
                )}
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 9. Number (Only numbers)
    if (setting.form_type === 'number') {
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <TextInput
                    id={setting.key}
                    type="number"
                    value={value ?? ''}
                    className="w-full"
                    onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
                    disabled={isReadOnly}
                    placeholder="0"
                />
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 10. Number Format (Number - Option)
    // Value stored as: "10-Days"
    if (setting.form_type === 'number-format') {
        const rawValue = value ? String(value) : '';
        const parts = rawValue.split('-'); // ["10", "Days"]
        const numberVal = parts[0] || '';
        const suffixVal = parts.length > 1 ? parts[1] : (setting.option?.[0] || '');

        const handleCompositeChange = (newNum: string, newSuffix: string) => {
            onChange(`${newNum}-${newSuffix}`);
        };

        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <div className="flex gap-2">
                    <TextInput
                        type="number"
                        value={numberVal}
                        className="flex-1 min-w-0"
                        placeholder="0"
                        onChange={(e) => handleCompositeChange(e.target.value, suffixVal)}
                    />
                    <div className="w-1/3">
                        <CustomSelect 
                            value={suffixVal}
                            onChange={(val) => handleCompositeChange(numberVal, val)}
                            options={setting.option || []}
                        />
                    </div>
                </div>
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 11. Format Number (Option - Number)
    // Value stored as: "IDR-10000"
    if (setting.form_type === 'format-number') {
        const rawValue = value ? String(value) : '';
        const parts = rawValue.split('-'); 
        const prefixVal = parts[0] || (setting.option?.[0] || '');
        const numberVal = parts.length > 1 ? parts[1] : '';

        const handleCompositeChange = (newPrefix: string, newNum: string) => {
            onChange(`${newPrefix}-${newNum}`);
        };

        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <div className="flex gap-2">
                    <div className="w-1/3">
                        <CustomSelect 
                            value={prefixVal}
                            onChange={(val) => handleCompositeChange(val, numberVal)}
                            options={setting.option || []}
                        />
                    </div>
                    <TextInput
                        type="number"
                        value={numberVal}
                        className="flex-1 min-w-0"
                        placeholder="0"
                        onChange={(e) => handleCompositeChange(prefixVal, e.target.value)}
                    />
                </div>
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 12. Image
    if (setting.form_type === 'image') {
        return (
            <div className="w-full">
                <ImagePickerSmall
                    label={setting.title}
                    value={value}
                    onChange={(file) => onChange(file)}
                    error={error}
                />
            </div>
        );
    }

    // 13. Color Picker
    if (setting.form_type === 'color_picker') {
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <ColorPicker
                    value={value ?? '#000000'}
                    onChange={(color) => onChange(color)}
                />
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 14. Radio
    if (setting.form_type === 'radio') {
        const options = Array.isArray(setting.option) ? setting.option : [];
        
        return (
            <div className="w-full">
                <InputLabel className="mb-3" value={setting.title} />
                <div className="flex flex-wrap gap-3">
                    {options.map((opt, idx) => {
                        const optValue = typeof opt === 'object' ? opt.value : opt;
                        const optLabel = typeof opt === 'object' ? opt.label : opt;
                        const isSelected = value === optValue;

                        return (
                            <label 
                                key={idx}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-medium
                                    ${isSelected 
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400'}
                                    ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <input
                                    type="radio"
                                    name={setting.key}
                                    value={optValue}
                                    checked={isSelected}
                                    onChange={() => onChange(optValue)}
                                    disabled={isReadOnly}
                                    className="hidden" // Custom UI
                                />
                                {isSelected ? (
                                    <Icon icon="solar:check-circle-bold" className="text-white" />
                                ) : (
                                    <Icon icon="solar:circle-linear" className="text-slate-400" />
                                )}
                                {typeof optLabel === 'string' ? optLabel : String(optLabel)}
                            </label>
                        );
                    })}
                </div>
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // Default Fallback
    return (
        <div className="w-full">
            <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
            <TextInput
                id={setting.key}
                type="text"
                value={value ?? ''}
                className="w-full"
                onChange={handleChange}
                disabled={isReadOnly}
            />
            {error && <InputError message={error} className="mt-1" />}
        </div>
    );
}