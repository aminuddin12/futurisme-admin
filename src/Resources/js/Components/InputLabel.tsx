import { LabelHTMLAttributes } from 'react';
import styles from './Form.module.css';

export default function InputLabel({ value, className = '', children, ...props }: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label {...props} className={`${styles.label} ${className}`}>
            {value ? value : children}
        </label>
    );
}