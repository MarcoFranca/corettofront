import React, { SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

interface SelectProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    title?: string;
    options: { value: string; label: string }[];
    required?: boolean;
    className?: string; // Adiciona classes adicionais
    errorMessage?: string; // Mensagem de erro
}

const SelectCustom: React.FC<SelectProps> = ({
                                           label,
                                           value,
                                           onChange,
                                           title,
                                           options,
                                           required = false,
                                           className = '',
                                           errorMessage = '',
                                       }) => {
    return (
        <div className={`${styles.selectWrapper} ${className}`}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <select
                className={`${styles.select} ${errorMessage ? styles.error : ''}`}
                value={value}
                onChange={onChange}
                title={title}
            >
                <option value="" disabled>{title}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        </div>
    );
};

export default SelectCustom;
