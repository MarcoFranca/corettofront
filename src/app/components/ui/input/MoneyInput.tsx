import React from "react";
import { Controller } from "react-hook-form";
import currency from "currency.js";
import {
    Input,
    FloatingLabelWrapper,
    InputContainer,
    Label,
    Required
} from "./FloatingMaskedInput.styles"; // 🧠 Reutilizando os estilos

interface MoneyInputProps {
    name: string;
    control: any;
    setValue: (field: string, value: any, options?: any) => void;
    label?: string;
    required?: boolean;
    placeholder?: string;
}

const MoneyInput: React.FC<MoneyInputProps> = ({
                                                   name,
                                                   control,
                                                   setValue,
                                                   label,
                                                   required = false,
                                                   placeholder = "",
                                               }) => {
    const formatCurrency = (value: string | number) =>
        currency(value, {
            symbol: "R$ ",
            separator: ".",
            decimal: ",",
            precision: 2,
        }).format();

    const cleanCurrency = (value: string) => value.replace(/[^\d]/g, "");

    return (
        <InputContainer>
            <FloatingLabelWrapper>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => {
                        const formattedValue =
                            field.value !== undefined && field.value !== null
                                ? formatCurrency(field.value)
                                : "";

                        return (
                            <Input
                                id={name}
                                type="text"
                                required={required}
                                value={formattedValue}
                                placeholder=" "
                                onChange={(e) => {
                                    const raw = cleanCurrency(e.target.value);
                                    const numericValue = Number(raw) / 100;

                                    if (field.value !== numericValue) {
                                        field.onChange(numericValue);
                                        setValue(name, numericValue, { shouldValidate: true });
                                    }
                                }}
                                onBlur={field.onBlur}
                                ref={field.ref}
                            />
                        );
                    }}
                />
                <Label htmlFor={name} className="float">
                    {label} {required && <Required>*</Required>}
                </Label>
            </FloatingLabelWrapper>
        </InputContainer>
    );
};

export default MoneyInput;
