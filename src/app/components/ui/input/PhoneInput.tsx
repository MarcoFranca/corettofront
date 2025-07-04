import React from "react";
import { IMaskInput } from "react-imask";
import { Controller } from "react-hook-form";
import { InputContainer, Label, Input, Required, FloatingLabelWrapper } from "./FloatingMaskedInput.styles"; // use seu styled Input!

interface PhoneInputProps {
    name: string;
    label?: string;
    control: any;
    setValue: any;
    required?: boolean;
    errorMessage?: string;
    placeholder?: string;
    className?: string;
    floatLabel?: boolean;
}

const PHONE_MASK = "(00) 00000-0000";

const PhoneInput: React.FC<PhoneInputProps> = ({
                                                   name,
                                                   label = "Telefone",
                                                   control,
                                                   setValue,
                                                   required = false,
                                                   errorMessage = "",
                                                   placeholder = "",
                                                   className = "",
                                                   floatLabel = true,
                                               }) => {
    return (
        <InputContainer className={className}>
            {floatLabel ? (
                <FloatingLabelWrapper>
                    <Controller
                        name={name}
                        control={control}
                        rules={{ required: required ? "Campo obrigatório" : false }}
                        render={({ field: { onChange, value, ref } }) => (
                            <Input
                                as={IMaskInput}
                                mask={PHONE_MASK}
                                value={value || ""}
                                inputRef={ref}
                                onAccept={(val: string) => {
                                    onChange(val);
                                    setValue(name, val, { shouldValidate: true });
                                }}
                                placeholder=" "
                            />
                        )}
                    />
                    <Label htmlFor={name} className="float">
                        {label} {required && <Required>*</Required>}
                    </Label>
                </FloatingLabelWrapper>
            ) : (
                <>
                    <Label htmlFor={name}>
                        {label} {required && <Required>*</Required>}
                    </Label>
                    <Controller
                        name={name}
                        control={control}
                        rules={{ required: required ? "Campo obrigatório" : false }}
                        render={({ field: { onChange, value, ref } }) => (
                            <Input
                                as={IMaskInput}
                                mask={PHONE_MASK}
                                value={value || ""}
                                inputRef={ref}
                                onAccept={(val: string) => {
                                    onChange(val);
                                    setValue(name, val, { shouldValidate: true });
                                }}
                                placeholder={placeholder || ""}
                            />
                        )}
                    />
                </>
            )}
            {errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}
        </InputContainer>
    );
};

export default PhoneInput;
