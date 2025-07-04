import React from "react";
import { IMaskInput } from "react-imask";
import { InputContainer, Label, Input, Required, FloatingLabelWrapper, StaticLabelWrapper } from "./FloatingMaskedInput.styles";
import { Controller, UseFormRegister, UseFormSetValue } from "react-hook-form";
import currency from "currency.js";

interface FloatingMaskedInputProps {
    label: React.ReactNode;
    name: string;
    type?: string;
    mask?: string;
    maskPlaceholder?: string | null;
    required?: boolean;
    defaultValue?: string;
    className?: string;
    placeholder?: string;
    floatLabel?: boolean;
    errorMessage?: string;
    control: any;
    setValue: UseFormSetValue<any>;
    register: UseFormRegister<any>;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FloatingMaskedInput: React.FC<FloatingMaskedInputProps> = ({
                                                                     label,
                                                                     name,
                                                                     type = "text",
                                                                     mask,
                                                                     required = false,
                                                                     onChange,
                                                                     className = "",
                                                                     placeholder = "",
                                                                     floatLabel = true,
                                                                     errorMessage = "",
                                                                     control,
                                                                     setValue,
                                                                 }) => {
    // Utilitário de formatação
    const formatCurrency = (value: string | number) => {
        return currency(value, {
            symbol: "R$ ",
            separator: ".",
            decimal: ",",
            precision: 2,
        }).format();
    };

    const cleanCurrency = (value: string) => {
        return value.replace(/[^\d]/g, "");
    };

    // Formata para input de data do tipo string/date
    const formatDateToInput = (date: string | Date): string => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        }
        return date;
    };

    // Input com label flutuante
    const renderFloating = () => {
        if (type === "date") {
            return (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id={name}
                            type="date"
                            required={required}
                            placeholder=" "
                            value={formatDateToInput(field.value)}
                            onChange={e => {
                                field.onChange(e.target.value);
                                setValue(name, e.target.value, { shouldValidate: true });
                                if (onChange) onChange(e);
                            }}
                        />
                    )}
                />
            );
        }

        if (mask) {
            // Com máscara usando react-imask
            return (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <IMaskInput
                            {...field}
                            mask={mask}
                            unmask={false}
                            value={field.value || ""}
                            onAccept={(value: any) => {
                                field.onChange(value);
                                setValue(name, value, { shouldValidate: true });
                            }}
                            placeholder=" "
                            required={required}
                            style={{ width: "100%", border: "none", outline: "none", background: "transparent" }}
                        />
                    )}
                />
            );
        }

        // Input monetário (exibe formatado, armazena valor puro)
        if (type === "money") {
            return (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Input
                            id={name}
                            type="text"
                            required={required}
                            placeholder=" "
                            value={
                                field.value !== undefined && field.value !== null && field.value !== ""
                                    ? formatCurrency(field.value)
                                    : ""
                            }
                            onChange={e => {
                                const raw = cleanCurrency(e.target.value);
                                const numericValue = Number(raw) / 100;
                                setValue(name, numericValue, { shouldValidate: true });
                                field.onChange(numericValue);
                            }}
                        />
                    )}
                />
            );
        }

        // Input number simples
        if (type === "number") {
            return (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Input
                            id={name}
                            type="number"
                            required={required}
                            placeholder=" "
                            value={field.value ?? ""}
                            onChange={e => {
                                const numericValue = Number(e.target.value);
                                setValue(name, numericValue, { shouldValidate: true });
                                field.onChange(numericValue);
                            }}
                        />
                    )}
                />
            );
        }

        // Default: texto normal
        return (
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        id={name}
                        type={type}
                        required={required}
                        placeholder=" "
                        onChange={e => {
                            field.onChange(e.target.value);
                            setValue(name, e.target.value, { shouldValidate: true });
                            if (onChange) onChange(e);
                        }}
                    />
                )}
            />
        );
    };

    // Input com label fixo acima
    const renderStatic = () => {
        if (mask) {
            return (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <IMaskInput
                            {...field}
                            mask={mask}
                            unmask={false}
                            value={field.value || ""}
                            onAccept={value => {
                                field.onChange(value);
                                setValue(name, value, { shouldValidate: true });
                            }}
                            placeholder={placeholder}
                            required={required}
                            style={{ width: "100%", border: "none", outline: "none", background: "transparent" }}
                        />
                    )}
                />
            );
        }

        if (type === "money") {
            return (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Input
                            id={name}
                            type="text"
                            required={required}
                            placeholder={placeholder}
                            value={
                                field.value !== undefined && field.value !== null && field.value !== ""
                                    ? formatCurrency(field.value)
                                    : ""
                            }
                            onChange={e => {
                                const raw = cleanCurrency(e.target.value);
                                const numericValue = Number(raw) / 100;
                                setValue(name, numericValue, { shouldValidate: true });
                                field.onChange(numericValue);
                            }}
                        />
                    )}
                />
            );
        }

        if (type === "number") {
            return (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Input
                            id={name}
                            type="number"
                            required={required}
                            placeholder={placeholder}
                            value={field.value ?? ""}
                            onChange={e => {
                                const numericValue = Number(e.target.value);
                                setValue(name, numericValue, { shouldValidate: true });
                                field.onChange(numericValue);
                            }}
                        />
                    )}
                />
            );
        }

        return (
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        id={name}
                        type={type}
                        required={required}
                        placeholder={placeholder}
                        onChange={e => {
                            field.onChange(e.target.value);
                            setValue(name, e.target.value, { shouldValidate: true });
                            if (onChange) onChange(e);
                        }}
                    />
                )}
            />
        );
    };

    return (
        <InputContainer className={className}>
            {floatLabel ? (
                <FloatingLabelWrapper>
                    {renderFloating()}
                    <Label htmlFor={name} className="float">
                        {label} {required && <Required>*</Required>}
                    </Label>
                </FloatingLabelWrapper>
            ) : (
                <StaticLabelWrapper>
                    <Label htmlFor={name} className="static-label">
                        {label} {required && <Required>*</Required>}
                    </Label>
                    {renderStatic()}
                </StaticLabelWrapper>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </InputContainer>
    );
};

export default FloatingMaskedInput;
