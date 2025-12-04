import { Icon } from '@iconify/react';
import { useState, useEffect, ChangeEvent } from 'react';
import TextInput from '../TextInput';
import InputLabel from '../InputLabel';
import { formatSettingKey } from '../../Utils/textFormatter';

interface SettingItem {
    id: number;
    key: string;
    value: any;
    form_type: string;
    type: string;
    group: string;
    by_module: string;
}

interface Props {
    setting: SettingItem;
    value: any;
    onChange: (newValue: any) => void;
    error?: string;
}

export default function DynamicSettingInput({ setting, value, onChange, error }: Props) {
    const label = formatSettingKey(setting.key);

    // --- HELPER FOR FILE PREVIEW ---
    const [filePreview, setFilePreview] = useState<string | null>(null);

    useEffect(() => {
        // Jika value awal adalah string (URL dari DB), jadikan preview
        if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('/'))) {
            setFilePreview(value);
        }
    }, [value]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Generate local preview URL
            const objectUrl = URL.createObjectURL(file);
            setFilePreview(objectUrl);
            // Pass file object to parent form handler (Inertia useForm)
            onChange(file);
        }
    };

    // --- RENDERER PER TYPE ---

    // 1. Toggle / Switch (Boolean)
    if (setting.form_type === 'toggle' || setting.type === 'boolean') {
        const isChecked = value === true || value === 'true' || value === 1;
        return (
            <div className="flex items-center justify-between py-3 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50 transition-colors hover:border-indigo-200 dark:hover:border-indigo-900/50">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{setting.key}</span>
                </div>
                <button
                    type="button"
                    onClick={() => onChange(!isChecked)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                        isChecked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                    role="switch"
                    aria-checked={isChecked}
                >
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isChecked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
        );
    }

    // 2. File Input (Image/Document)
    if (setting.form_type === 'file' || setting.form_type === 'image') {
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={label} />
                <div className="mt-2 flex items-center gap-4">
                    {/* Preview Box */}
                    <div className="relative shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 w-20 h-20 flex items-center justify-center">
                        {filePreview ? (
                            <img src={filePreview} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                            <Icon icon="heroicons:photo" className="text-slate-400 w-8 h-8" />
                        )}
                    </div>
                    
                    {/* Input Action */}
                    <div className="flex-1">
                        <label className="block w-full">
                            <span className="sr-only">Choose profile photo</span>
                            <input 
                                type="file" 
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml, image/webp"
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-300
                                cursor-pointer
                            "/>
                        </label>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            SVG, PNG, JPG or GIF (MAX. 2MB)
                        </p>
                        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
                    </div>
                </div>
            </div>
        );
    }

    // 3. Color Picker
    if (setting.form_type === 'color_picker') {
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={label} />
                <div className="flex items-center gap-3 mt-1">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                        <input
                            type="color"
                            value={value || '#6366f1'}
                            onChange={(e) => onChange(e.target.value)}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 m-0 border-none cursor-pointer"
                        />
                    </div>
                    <TextInput
                        id={setting.key}
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="font-mono uppercase"
                        placeholder="#000000"
                    />
                </div>
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
        );
    }

    // 4. Range Slider
    if (setting.form_type === 'range') {
        return (
            <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                    <InputLabel htmlFor={setting.key} value={label} />
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                        {value || 0}
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value || 0}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
        );
    }

    // 5. Radio Options (Example value: "option1,option2,option3" or handled via separate meta)
    // Asumsi: value opsi disimpan sebagai string comma-separated di deskripsi atau kita hardcode sementara untuk demo
    if (setting.form_type === 'radio') {
        const options = ['Option A', 'Option B', 'Option C']; // Ini idealnya dinamis dari DB
        return (
            <div className="w-full">
                <InputLabel value={label} />
                <div className="mt-2 space-y-2">
                    {options.map((opt) => (
                        <label key={opt} className="flex items-center cursor-pointer group">
                            <input
                                type="radio"
                                name={setting.key}
                                value={opt}
                                checked={value === opt}
                                onChange={(e) => onChange(e.target.value)}
                                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600"
                            />
                            <span className="ml-2 text-sm text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {opt}
                            </span>
                        </label>
                    ))}
                </div>
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
        );
    }

    // 6. Checkbox Group (Multi Select) - Simplified for Single Checkbox logic
    if (setting.form_type === 'checkbox') {
        const isChecked = value === true || value === 'true' || value === '1';
        return (
             <div className="flex items-start py-2">
                <div className="flex items-center h-5">
                    <input
                        id={setting.key}
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => onChange(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor={setting.key} className="font-medium text-slate-700 dark:text-slate-200">
                        {label}
                    </label>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Enable or disable this feature.</p>
                </div>
            </div>
        );
    }

    // 7. Time Picker
    if (setting.form_type === 'time') {
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={label} />
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Icon icon="heroicons:clock" className="text-slate-400" />
                    </div>
                    <input
                        type="time"
                        id={setting.key}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 dark:bg-slate-900 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                    />
                </div>
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
        );
    }

    // 8. Select / Dropdown
    if (setting.form_type === 'select') {
        const options = setting.key === 'locale' ? ['id', 'en'] : ['default', 'custom'];

        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={label} />
                <div className="relative mt-1">
                    <select
                        id={setting.key}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 px-3 pr-8 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <Icon icon="heroicons:chevron-up-down" className="h-4 w-4" />
                    </div>
                </div>
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
        );
    }

    // 9. Text Area
    if (setting.form_type === 'textarea') {
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={label} />
                <textarea
                    id={setting.key}
                    className="mt-1 block w-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                    rows={3}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                />
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
        );
    }

    // 10. Default: Text Input / URL / Number / Phone
    return (
        <div className="w-full">
            <InputLabel htmlFor={setting.key} value={label} />
            <div className="relative mt-1">
                {setting.form_type === 'url' && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-slate-500 sm:text-sm">https://</span>
                    </div>
                )}
                {setting.form_type === 'phone' && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon icon="heroicons:phone" className="text-slate-400" />
                    </div>
                )}
                <TextInput
                    id={setting.key}
                    type={setting.form_type === 'number' ? 'number' : (setting.form_type === 'phone' ? 'tel' : 'text')}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`${setting.form_type === 'url' ? 'pl-16' : (setting.form_type === 'phone' ? 'pl-10' : '')}`}
                    placeholder={`Enter ${label.toLowerCase()}`}
                />
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}