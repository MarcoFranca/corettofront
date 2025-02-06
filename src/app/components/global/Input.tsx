import React from "react";
import InputMask from "react-input-mask";
import styles from "./Input.module.css";

interface InputProps {
    label?: string;
    type: string;
    name?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string; // Adicionar classes extras
    errorMessage?: string; // Mensagem de erro
    placeholder?: string;
    accept?: string; // 🔥 Adicionando 'accept' para inputs de arquivo
    mask?: string; // ✅ Adicionando suporte a máscaras
    maskPlaceholder?: string | null; // ✅ Placeholder para a máscara
}

const Input: React.FC<InputProps> = ({
                                         label,
                                         type,
                                         value,
                                         onChange,
                                         required = false,
                                         placeholder = "",
                                         className = "",
                                         errorMessage = "",
                                         mask, // ✅ Nova prop para máscara
                                         maskPlaceholder, // ✅ Placeholder para máscara
                                     }) => {
    return (
        <div className={`${styles.inputContainer} ${className}`}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            {mask ? (
                <InputMask
                    mask={mask}
                    value={value}
                    onChange={onChange}
                    maskPlaceholder={maskPlaceholder}
                >
                    {(inputProps) => (
                        <input
                            {...inputProps}
                            className={`${styles.input} ${errorMessage ? styles.error : ""}`}
                            type={type}
                            required={required}
                            placeholder={placeholder}
                        />
                    )}
                </InputMask>
            ) : (
                <input
                    className={`${styles.input} ${errorMessage ? styles.error : ""}`}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                />
            )}
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        </div>
    );
};

export default Input;
