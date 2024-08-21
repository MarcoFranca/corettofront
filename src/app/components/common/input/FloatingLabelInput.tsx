import React from 'react';
import styles from './FloatingLabelInput.module.css';

interface FloatingLabelInputProps {
    id: string;
    type: string;
    placeholder: string;
    register: any; // A função `register` do react-hook-form
    required?: boolean;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ id, type, placeholder, register, required }) => {
    return (
        <div className={styles.inputWrapper}>
            <input
                id={id}
                className={styles.floatingInput}
                type={type}
                {...register(id, { required })}
                placeholder=" " // Placeholder vazio para manter o espaço
            />
            <label htmlFor={id} className={styles.floatingLabel}>
                {placeholder}
            </label>
        </div>
    );
};

export default FloatingLabelInput;
