import React from 'react';
import styles from './Input.module.css';

interface InputProps {
    label: string;
    type: string;
    name?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string; // Adicionar classes extras
    errorMessage?: string; // Mensagem de erro
    placeholder?: string;
    accept?: string; // 🔥 Adicionando 'accept' para inputs de arquivo
}

const Input: React.FC<InputProps> = ({
                                         label,
                                         type,
                                         value,
                                         onChange,
                                         required = false,
                                         className = '',
                                         errorMessage = '',
                                         placeholder ,
                                     }) => {
    return (
        <div className={`${styles.inputWrapper} ${className}`}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <input
                className={`${styles.input} ${errorMessage ? styles.error : ''}`}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
            />
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        </div>
    );
};

export default Input;
