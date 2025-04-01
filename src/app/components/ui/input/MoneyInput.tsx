import React from "react";
import { Controller } from "react-hook-form";
import currency from "currency.js";
import { Input } from "./FloatingMaskedInput.styles";

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
                        placeholder={placeholder}
                        required={required}
                        value={formattedValue}
                        onChange={(e) => {
                            const raw = cleanCurrency(e.target.value); // "12300"
                            const numericValue = Number(raw) / 100;

                            // 🛑 Só atualiza se for diferente do que já está salvo
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
    );
};

export default MoneyInput;
