import { forwardRef, useEffect, useRef, InputHTMLAttributes } from 'react';
import styles from './Form.module.css';

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
            className={`${styles.input} ${className}`}
            ref={localRef}
        />
    );
});