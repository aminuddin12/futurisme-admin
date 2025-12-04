import { forwardRef, useEffect, useRef, InputHTMLAttributes } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={`
                border-gray-300 text-gray-900 rounded-lg shadow-sm 
                w-full transition-all duration-200 
                focus:border-indigo-500 focus:ring-indigo-500 
                py-[0.6rem] 
                ${className}
            `}
            ref={localRef}
        />
    );
});