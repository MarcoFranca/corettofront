// components/ui/input/PhoneInputBase.tsx
import React from "react";
import { IMaskInput } from "react-imask";
import { InputContainer, Label, Required } from "./FloatingMaskedInput.styles";

interface PhoneInputBaseProps {
    value?: string;
    onChange?: (e: { target: { value: string } }) => void;
    mask?: string;
    required?: boolean;
    errorMessage?: string;
    placeholder?: string;
    className?: string;
    label?: string;
}

const PhoneInputBase: React.FC<PhoneInputBaseProps> = ({
                                                           value = "",
                                                           onChange,
                                                           mask = "(00) 00000-0000",
                                                           required = false,
                                                           errorMessage,
                                                           placeholder = "",
                                                           className = "",
                                                           label = "Telefone",
                                                       }) => (
    <InputContainer className={className}>
        <IMaskInput
            mask={mask}
            value={value}
            onAccept={(val: string) => {
                if (onChange) onChange({ target: { value: val } });
            }}
            placeholder={placeholder}
            className="input"
        />
        {label && (
            <Label>
                {label} {required && <Required>*</Required>}
            </Label>
        )}
        {errorMessage && (
            <p className="error-message">{errorMessage}</p>
        )}
    </InputContainer>
);

export default PhoneInputBase;
