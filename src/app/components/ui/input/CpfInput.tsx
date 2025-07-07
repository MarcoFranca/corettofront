import React, { useState } from "react";
import { IMaskInput } from "react-imask";
import { Controller } from "react-hook-form";
import { InputContainer, Label, Required, FloatingLabelWrapper } from "./FloatingMaskedInput.styles";

interface CPFInputProps {
    name: string;
    control: any;
    setValue: any;
    required?: boolean;
    errorMessage?: string;
    label?: string;
    className?: string;
}

const DEFAULT_CPF_MASK = "000.000.000-00";

const CPFInput: React.FC<CPFInputProps> = ({
                                               name,
                                               control,
                                               setValue,
                                               required = false,
                                               errorMessage = "",
                                               label = "CPF",
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
                                mask={DEFAULT_CPF_MASK}
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
                                    outline: "none",
                                    transition: "border-color 0.3s"
                                }}
                            />
                            <Label
                                htmlFor={name}
                                className="float"
                                style={{
                                    position: "absolute",
                                    top: isFloating ? "-9px" : "11px",
                                    left: "12px",
                                    fontSize: isFloating ? "16px" : "16px",
                                    color: isFloating ? "#007bff" : "#888",
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

export default CPFInput;
