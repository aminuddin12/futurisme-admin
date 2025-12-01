import { ButtonHTMLAttributes } from 'react';
import styles from './Form.module.css';

export default function PrimaryButton({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`${styles.btnPrimary} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}