import { HTMLAttributes } from 'react';
import styles from './Form.module.css';

export default function InputError({ message, className = '', ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p {...props} className={`${styles.error} ${className}`}>
            {message}
        </p>
    ) : null;
}