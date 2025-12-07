import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import TextInput from '../TextInput';
import InputLabel from '../InputLabel';
import InputError from '../InputError';
import ImagePickerSmall from '../UI/ImagePickerSmall';
import ColorPicker from '../UI/ColorPicker';

// Interface sesuai dengan data dari seeder/database
interface SettingItem {
    id: number;
    key: string;
    title: string;
    value: any;
    type: string;
    form_type: string; // text, textarea, select, select-search, toggle, url, text-url-full, number-format, image, color_picker, radio
    group: string;
    by_module: string;
    option?: any[] | null; // Untuk select, radio
    is_active?: number;
    add_by?: string;
}

interface DynamicSettingInputProps {
    setting: SettingItem;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

export default function DynamicSettingInput({ setting, value, onChange, error }: DynamicSettingInputProps) {
    const isReadOnly = setting.is_active === 3; // 3 means disabled/readonly

    // Handle Change umum
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    // --- RENDERERS BERDASARKAN FORM_TYPE ---

    // 1. Text & URL & Text-URL-Full & Number-Format
    if (['text', 'url', 'text-url-full', 'number-format'].includes(setting.form_type)) {
        let inputType = 'text';
        let prefix = null;

        if (setting.form_type === 'url') inputType = 'url';
        if (setting.form_type === 'number-format') inputType = 'number';
        if (setting.form_type === 'text-url-full') prefix = 'https://'; // Contoh prefix visual

        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <div className="relative">
                    {prefix && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-500 sm:text-sm">{prefix}</span>
                        </div>
                    )}
                    <TextInput
                        id={setting.key}
                        type={inputType}
                        value={value ?? ''}
                        className={`w-full ${prefix ? 'pl-16' : ''}`}
                        onChange={handleChange}
                        disabled={isReadOnly}
                        placeholder={`Enter ${setting.title.toLowerCase()}...`}
                    />
                </div>
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 2. Textarea
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
                    className="w-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm transition-colors text-sm"
                    placeholder={`Enter ${setting.title.toLowerCase()} description...`}
                />
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 3. Select & Select-Search
    if (['select', 'select-search'].includes(setting.form_type)) {
        // Fallback jika option null
        const options = Array.isArray(setting.option) ? setting.option : [];
        
        return (
            <div className="w-full">
                <InputLabel htmlFor={setting.key} value={setting.title} className="mb-2" />
                <div className="relative">
                    <select
                        id={setting.key}
                        value={value ?? ''}
                        onChange={handleChange}
                        disabled={isReadOnly}
                        className="w-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm appearance-none pr-10 text-sm py-2.5 transition-colors"
                    >
                        <option value="" disabled>Select {setting.title}</option>
                        {options.map((opt, idx) => {
                            // Handle jika option berupa string sederhana atau object {label, value}
                            const optValue = typeof opt === 'object' ? opt.value : opt;
                            const optLabel = typeof opt === 'object' ? opt.label : opt;
                            return (
                                <option key={idx} value={optValue}>
                                    {optLabel}
                                </option>
                            );
                        })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                        <Icon icon="solar:alt-arrow-down-bold" />
                    </div>
                </div>
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 4. Toggle (Boolean)
    if (setting.form_type === 'toggle') {
        const isChecked = value === true || value === 'true' || value === 1 || value === '1';
        
        return (
            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex flex-col">
                    <InputLabel htmlFor={setting.key} value={setting.title} className="mb-1 cursor-pointer" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {isChecked ? 'Enabled' : 'Disabled'}
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
                    <span className="sr-only">Use setting</span>
                    <span
                        aria-hidden="true"
                        className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${isChecked ? 'translate-x-5' : 'translate-x-0'}
                        `}
                    />
                </button>
                {error && <InputError message={error} className="mt-1" />}
            </div>
        );
    }

    // 5. Image Picker
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

    // 6. Color Picker
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

    // 7. Radio Group
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
                                    flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm font-medium
                                    ${isSelected 
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-400 ring-1 ring-indigo-500' 
                                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'}
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
                                    className="text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900 hidden" // Hide native radio
                                />
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-500' : 'border-slate-400'}`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                </div>
                                {typeof optLabel === 'string' ? optLabel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : optLabel}
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