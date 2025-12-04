import { InputHTMLAttributes, forwardRef, useRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    className?: string;
}

const FloatingLabelTextInput = forwardRef<HTMLInputElement, Props>(
    ({ label, error, className = '', ...props }, ref) => {
        // Fallback ref jika tidak disediakan dari parent
        const inputRef = useRef<HTMLInputElement>(null);
        // @ts-ignore
        const resolvedRef = ref || inputRef;

        return (
            <div className={`relative w-full ${className}`}>
                <input
                    {...props}
                    ref={resolvedRef}
                    placeholder=" "
                    className={`
                        block px-4 pb-2.5 pt-4 w-full text-sm text-slate-900 bg-transparent rounded-lg border-1 
                        border-slate-300 appearance-none dark:text-white dark:border-slate-600 dark:focus:border-indigo-500 
                        focus:outline-none focus:ring-0 focus:border-indigo-600 peer
                        ${error ? 'border-red-500 focus:border-red-500 dark:border-red-500' : ''}
                    `}
                />
                <label
                    className={`
                        absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-slate-900 px-2 
                        peer-focus:px-2 peer-focus:text-indigo-600 peer-focus:dark:text-indigo-500 peer-placeholder-shown:scale-100 
                        peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 
                        left-2 pointer-events-none select-none
                        ${error ? 'text-red-500 peer-focus:text-red-500' : 'text-slate-500 dark:text-slate-400'}
                    `}
                >
                    {label}
                </label>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

export default FloatingLabelTextInput;