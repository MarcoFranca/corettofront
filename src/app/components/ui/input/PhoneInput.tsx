import React, { useState } from "react";
import { IMaskInput } from "react-imask";
import { Controller } from "react-hook-form";
import { InputContainer, Label, Required, FloatingLabelWrapper } from "./FloatingMaskedInput.styles";

interface PhoneInputProps {
    name: string;
    control: any;
    setValue: any;
    required?: boolean;
    errorMessage?: string;
    mask?: string;
    label?: string;
    className?: string;
}

const DEFAULT_PHONE_MASK = "(00) 00000-0000";
const LABEL_FLOAT_SIZE = "16px"; // Ou 14px se for seu padrão global
const LABEL_DEFAULT_SIZE = "16px";
const LABEL_FLOAT_TOP = "-9px";
const LABEL_DEFAULT_TOP = "11px";
const LABEL_FLOAT_COLOR = "#007bff"; // Azul CorretorLab
const LABEL_DEFAULT_COLOR = "#888";

const PhoneInput: React.FC<PhoneInputProps> = ({
                                                   name,
                                                   control,
                                                   setValue,
                                                   required = false,
                                                   errorMessage = "",
                                                   mask,
                                                   label = "Telefone",
                                                   className = ""
                                               }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <InputContainer className={className}>
            <Controller
                name={name}
                control={control}
                rules={{ required: required ? "Campo obrigatório" : false }}
                render={({ field: { onChange, value, ref } }) => {
                    const isFloating = isFocused || !!value;
                    return (
                        <FloatingLabelWrapper>
                            <IMaskInput
                                mask={mask || DEFAULT_PHONE_MASK}
                                value={value || ""}
                                inputRef={ref}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onAccept={(val: string) => {
                                    onChange(val);
                                    if (setValue) setValue(name, val, { shouldValidate: true });
                                }}
                                placeholder=" "
                                className="input"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: isFocused ? "1.5px solid #007bff" : "1px solid #ccc",
                                    borderRadius: "5px",
                                    fontSize: "16px",
                                    color: "#333",
                                    background: "#fff",
                                    outline: "none", // Remove a borda preta
                                    transition: "border-color 0.3s"
                                }}
                            />
                            <Label
                                htmlFor={name}
                                className="float"
                                style={{
                                    position: "absolute",
                                    top: isFloating ? LABEL_FLOAT_TOP : LABEL_DEFAULT_TOP,
                                    left: "12px",
                                    fontSize: isFloating ? LABEL_FLOAT_SIZE : LABEL_DEFAULT_SIZE,
                                    color: isFloating ? LABEL_FLOAT_COLOR : LABEL_DEFAULT_COLOR,
                                    background: "#fff",
                                    padding: "0 4px",
                                    pointerEvents: "none",
                                    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)"
                                }}
                            >
                                {label} {required && <Required>*</Required>}
                            </Label>
                        </FloatingLabelWrapper>
                    );
                }}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </InputContainer>
    );
};

export default PhoneInput;
