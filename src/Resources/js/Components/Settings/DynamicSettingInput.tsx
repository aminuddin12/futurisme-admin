import { Icon } from '@iconify/react';
import TextInput from '../TextInput';
import InputLabel from '../InputLabel';
import { formatSettingKey } from '../../Utils/textFormatter';

// Import New Components
import ImagePickerSmall from '../UI/ImagePickerSmall'; // Updated Import
import ColorPicker from '../UI/ColorPicker';
import RangeSlider from '../UI/RangeSlider';
import RadioGroup from '../UI/RadioGroup';
import CheckboxItem from '../UI/CheckboxItem';
import TimePicker from '../UI/TimePicker';

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

    // --- RENDERER PER TYPE ---

    // 1. Toggle / Switch (Boolean)
    if (setting.form_type === 'toggle' || setting.type === 'boolean') {
        const isChecked = value === true || value === 'true' || value === 1 || value === '1';
        return (
            <div className="flex items-center justify-between py-3 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:shadow-sm">
                <div className="flex flex-col pr-4">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-mono">
                        {setting.key}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => onChange(!isChecked)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:ring-offset-slate-900 ${
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

    // 2. Checkbox
    if (setting.form_type === 'checkbox') {
        const isChecked = value === true || value === 'true' || value === '1' || value === 1;
        return (
            <CheckboxItem 
                label={label} 
                description={`Activate ${label} feature.`}
                checked={isChecked} 
                onChange={onChange} 
                error={error} 
            />
        );
    }

    // 3. Image Picker Small (Updated)
    if (setting.form_type === 'file' || setting.form_type === 'image') {
        return (
            <ImagePickerSmall 
                label={label} 
                value={value} 
                onChange={onChange} 
                error={error}
                accept={setting.form_type === 'image' ? 'image/*' : '*'} 
            />
        );
    }

    // 4. Color Picker
    if (setting.form_type === 'color_picker') {
        return (
            <ColorPicker 
                label={label} 
                value={value} 
                onChange={onChange} 
                error={error} 
            />
        );
    }

    // 5. Range Slider
    if (setting.form_type === 'range') {
        return (
            <RangeSlider 
                label={label} 
                value={value} 
                onChange={onChange} 
                min={0} 
                max={100} 
                unit={setting.key.includes('font') ? 'px' : '%'} 
                error={error} 
            />
        );
    }

    // 6. Radio Box
    if (setting.form_type === 'radio') {
        const options = [
            { label: 'Modern', value: 'modern', description: 'Clean and spacious layout' },
            { label: 'Classic', value: 'classic', description: 'Compact and dense layout' },
        ];
        return (
            <RadioGroup 
                label={label} 
                options={options} 
                value={value} 
                onChange={onChange} 
                error={error} 
                layout="horizontal"
            />
        );
    }

    // 7. Time Picker
    if (setting.form_type === 'time') {
        return (
            <TimePicker 
                label={label} 
                value={value} 
                onChange={onChange} 
                error={error} 
            />
        );
    }

    // 8. Select / Dropdown
    if (setting.form_type === 'select') {
        const options = setting.key === 'locale' ? ['id', 'en'] : ['default', 'custom'];
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={label} />
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <Icon icon="solar:flag-bold-duotone" className="text-slate-400" />
                    </div>
                    <select
                        id={setting.key}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-8 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                    >
                        <option value="" disabled>Select an option</option>
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
                    className="mt-1 block w-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm py-2 px-3 transition-all"
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
                        <span className="text-slate-500 sm:text-sm font-medium">https://</span>
                    </div>
                )}
                {setting.form_type === 'phone' && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon icon="solar:phone-calling-bold-duotone" className="text-slate-400" />
                    </div>
                )}
                <TextInput
                    id={setting.key}
                    type={setting.form_type === 'number' ? 'number' : (setting.form_type === 'phone' ? 'tel' : 'text')}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`${setting.form_type === 'url' ? 'pl-16' : (setting.form_type === 'phone' ? 'pl-10' : '')}`}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                />
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}