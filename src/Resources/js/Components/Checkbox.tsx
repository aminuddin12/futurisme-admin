import { InputHTMLAttributes } from 'react';
import styles from './Form.module.css';

export default function Checkbox({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={`${styles.checkbox} ${className}`}
        />
    );
}