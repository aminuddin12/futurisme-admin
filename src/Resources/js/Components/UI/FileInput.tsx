import { ChangeEvent, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import InputLabel from '../InputLabel';

interface FileInputProps {
    label?: string;
    value?: string | File | null;
    onChange: (file: File) => void;
    error?: string;
    accept?: string;
}

export default function FileInput({ label, value, onChange, error, accept = "image/*" }: FileInputProps) {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        // Case 1: Value adalah String (URL dari Database)
        if (typeof value === 'string' && value.length > 0) {
            setPreview(value);
            return;
        }

        // Case 2: Value adalah File Object (Baru dipilih user)
        if (value instanceof File) {
            // Cek apakah file adalah gambar
            if (value.type.startsWith('image/')) {
                const objectUrl = URL.createObjectURL(value);
                setPreview(objectUrl);
                
                // Cleanup memory
                return () => URL.revokeObjectURL(objectUrl);
            } else {
                // File bukan gambar, tidak ada preview visual
                setPreview(null); 
            }
            return;
        }

        // Case 3: Value kosong/null, reset preview
        if (!value) {
            // Opsional: Jika Anda ingin mempertahankan preview lama saat form error,
            // Anda bisa menambahkan logika di sini. Tapi default behavior:
            setPreview(null);
        }

    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // Kirim File object ke parent
            onChange(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            {label && <InputLabel className="mb-2">{label}</InputLabel>}
            
            <div className={`
                relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-all
                ${error 
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-700' 
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-600'}
            `}>
                {/* Preview Area */}
                <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm group relative">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <Icon icon="solar:camera-add-bold-duotone" className="w-8 h-8 text-slate-400" />
                    )}
                </div>

                {/* Input Area */}
                <div className="flex-1 min-w-0 w-full">
                    <label className="block w-full cursor-pointer group">
                        <span className="sr-only">Choose file</span>
                        <input 
                            type="file" 
                            className="block w-full text-sm text-slate-500 dark:text-slate-400
                                file:mr-4 file:py-2.5 file:px-4
                                file:rounded-lg file:border-0
                                file:text-xs file:font-bold file:uppercase
                                file:bg-indigo-600 file:text-white
                                hover:file:bg-indigo-700 dark:hover:file:bg-indigo-500
                                cursor-pointer transition-all
                            "
                            onChange={handleChange}
                            accept={accept}
                        />
                    </label>
                    <div className="mt-2 flex flex-col gap-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                            {value instanceof File ? `New: ${value.name}` : (typeof value === 'string' ? 'Current image stored' : 'No file selected')}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                            SVG, PNG, JPG or WebP (Max. 2MB)
                        </p>
                    </div>
                </div>
            </div>
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}