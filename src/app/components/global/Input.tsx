import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({ label, required, ...props }) => {
    return (
        <div className={styles.inputContainer}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <input className={styles.input} {...props} />
        </div>
    );
};

export default Input;
