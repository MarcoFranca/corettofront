import React from "react";
import { IMaskInput } from "react-imask";
import { Controller } from "react-hook-form";
import { InputContainer, Label, Required, FloatingLabelWrapper } from "./FloatingMaskedInput.styles";

interface PhoneInputProps {
    name?: string;
    value?: string;
    onChange?: (e: any) => void;
    control?: any;
    setValue?: any;
    required?: boolean;
    errorMessage?: string;
    placeholder?: string;
    className?: string;
    floatLabel?: boolean;
    mask?: string;
    label?: string;
}

const DEFAULT_PHONE_MASK = "(00) 00000-0000";

const PhoneInput: React.FC<PhoneInputProps> = ({
                                                   name = "",
                                                   value = "",
                                                   onChange,
                                                   control,
                                                   setValue,
                                                   required = false,
                                                   errorMessage = "",
                                                   placeholder = "",
                                                   className = "",
                                                   floatLabel = true,
                                                   mask,
                                                   label = "Telefone"
                                               }) => {
    // Com react-hook-form
    if (control && name) {
        return (
            <InputContainer className={className}>
                <FloatingLabelWrapper>
                    <Controller
                        name={name}
                        control={control}
                        rules={{ required: required ? "Campo obrigatório" : false }}
                        render={({ field: { onChange: rhfOnChange, value, ref } }) => (
                            <IMaskInput
                                mask={mask || DEFAULT_PHONE_MASK}
                                value={value || ""}
                                inputRef={ref}
                                onAccept={(val: string) => {
                                    rhfOnChange(val);
                                    if (setValue) setValue(name, val, { shouldValidate: true });
                                }}
                                placeholder=" "
                                className="input"
                                style={{
                                    width: "100%",
                                    border: "none",
                                    background: "transparent",
                                    fontWeight: 500,
                                    color: "#333",
                                    padding: 0,
                                }}
                            />
                        )}
                    />
                    <Label htmlFor={name} className="float">
                        {label} {required && <Required>*</Required>}
                    </Label>
                </FloatingLabelWrapper>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </InputContainer>
        );
    }
    // Sem react-hook-form, modo controlado direto (contatos adicionais)
    return (
        <InputContainer className={className}>
            <IMaskInput
                mask={mask || DEFAULT_PHONE_MASK}
                value={value || ""}
                onAccept={(val: string, maskRef, e) => {
                    if (onChange) onChange({ target: { value: val } });
                }}
                placeholder={placeholder}
                className="input"
                style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    fontWeight: 500,
                    color: "#333",
                    padding: 0,
                }}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </InputContainer>
    );
};

export default PhoneInput;
