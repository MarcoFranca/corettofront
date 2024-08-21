import React from 'react';
import styles from './FloatingLabelInput.module.css';

interface FloatingLabelInputProps {
    id: string;
    type: string;
    placeholder: string;
    register: any; // A função `register` do react-hook-form
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Adicionando a prop onChange
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Adicionando a prop onBlur
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ id, type, placeholder, register, required, onChange }) => {
    return (
        <div className={styles.inputWrapper}>
            <input
                id={id}
                className={styles.floatingInput}
                type={type}
                placeholder=" " // Placeholder vazio para manter o espaço
                {...register(id, { required, onChange })} // Adicionando onChange e onBlur ao register
            />
            <label htmlFor={id} className={styles.floatingLabel}>
                {placeholder}
            </label>
        </div>
    );
};

export default FloatingLabelInput;
