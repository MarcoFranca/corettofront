import React, { useState } from "react";
import InputMask from "react-input-mask";
import { InputContainer, Label, Input, Required, FloatingLabelWrapper } from "./FloatingMaskedInput.styles";

interface FloatingMaskedInputProps {
    label: string;
    name: string;
    type?: string;
    value?: string;
    mask?: string;
    maskPlaceholder?: string | null;
    required?: boolean;
    defaultValue?: string;
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const FloatingMaskedInput: React.FC<FloatingMaskedInputProps> = ({
                                                                     label,
                                                                     name,
                                                                     type = "text",
                                                                     value = "", // ✅ Garante que `value` sempre tenha um valor padrão
                                                                     mask,
                                                                     maskPlaceholder,
                                                                     required = false,
                                                                     onChange,
                                                                     className = "",
                                                                     placeholder = "", // ✅ Se houver placeholder, o rótulo flutuante não é necessário
                                                                 }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    // 🔥 Define se o rótulo deve flutuar com base no foco ou no valor preenchido
    const shouldFloatLabel = !placeholder && (isFocused || value.length > 0);

    return (
        <InputContainer className={className}>
            <FloatingLabelWrapper>
                {mask ? (
                    <InputMask
                        mask={mask}
                        value={value}
                        onChange={onChange}
                        maskPlaceholder={maskPlaceholder}
                        onFocus={handleFocus} // ✅ Agora passa o `onFocus` diretamente
                        onBlur={handleBlur}   // ✅ Agora passa o `onBlur` diretamente
                    >
                        {(inputProps) => (
                            <Input
                                {...inputProps}
                                id={name}
                                type={type}
                                required={required}
                                placeholder=" "
                            />
                        )}
                    </InputMask>
                ) : (
                    <Input
                        id={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        required={required}
                        placeholder=" "
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                )}
                <Label htmlFor={name} className={shouldFloatLabel ? "float" : ""}>
                    {label} {required && <Required>*</Required>}
                </Label>
            </FloatingLabelWrapper>
        </InputContainer>
    );
};

export default FloatingMaskedInput;
