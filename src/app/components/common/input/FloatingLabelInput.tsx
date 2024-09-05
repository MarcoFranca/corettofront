import React from 'react';
import styles from './FloatingLabelInput.module.css';

interface FloatingLabelInputProps {
    id: string;
    type: string;
    placeholder: string;
    register?: any; // A função `register` do react-hook-form é opcional
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    defaultValue?: string;
    value?: string; // Adicionando prop value para inputs controlados
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
                                                                   id,
                                                                   type,
                                                                   placeholder,
                                                                   register,
                                                                   required,
                                                                   onChange,
                                                                   onBlur,
                                                                   defaultValue,
                                                                   value, // Usando value para inputs controlados
                                                               }) => {
    return (
        <div className={styles.inputWrapper}>
            <input
                id={id}
                className={styles.floatingInput}
                type={type}
                placeholder=" "
                defaultValue={defaultValue}
                value={value} // Usando value para inputs controlados
                onChange={onChange} // Usando onChange diretamente, se fornecido
                onBlur={onBlur} // Usando onBlur diretamente, se fornecido
                {...(register ? register(id, { required }) : {})} // Usando register apenas se fornecido
            />
            <label htmlFor={id} className={styles.floatingLabel}>
                {placeholder}
            </label>
        </div>
    );
};

export default FloatingLabelInput;
