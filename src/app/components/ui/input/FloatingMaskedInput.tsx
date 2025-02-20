import React from "react";
import InputMask from "react-input-mask";
import { InputContainer, Label, Input, Required, FloatingLabelWrapper, StaticLabelWrapper } from "./FloatingMaskedInput.styles";
import {Controller, UseFormRegister, UseFormSetValue} from "react-hook-form";
import currency from "currency.js";

interface FloatingMaskedInputProps {
    label: React.ReactNode; // ✅ Aceita `JSX.Element` ou `string`
    name: string;
    type?: string;
    value?: string;
    mask?: string;
    maskPlaceholder?: string | null;
    required?: boolean;
    defaultValue?: string;
    className?: string;
    placeholder?: string;
    floatLabel?: boolean;
    errorMessage?: string;
    control: any; // ✅ Agora `control` é obrigatório
    setValue: UseFormSetValue<any>; // ✅ Agora aceita qualquer campo
    register: UseFormRegister<any>; // ✅ Agora register está tipado corretamente
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}



const FloatingMaskedInput: React.FC<FloatingMaskedInputProps> =
    ({
         label,
         name,
         type = "text",
         value = "",
         mask,
         maskPlaceholder,
         required = false,
         onChange,
         className = "",
         placeholder = "",
         floatLabel = true,
         errorMessage = "",
         control,
         setValue,
         register, // ✅ Adicionado suporte ao `register`
     }) => {

        const inputProps = register
            ? register(name, {
                required: { value: true, message: "Campo obrigatório" },
            })
            : {};
        console.log(name)

        const formatDateToInput = (date: string | Date): string => {
            if (!date) return "";
            if (date instanceof Date) {
                return date.toISOString().split("T")[0];
            }
            return date;
        };

        // 🏦 Formata valor em moeda corretamente para exibição
        const formatCurrency = (value: string | number) => {
            return currency(value, {
                symbol: "R$ ",
                separator: ".",
                decimal: ",",
                precision: 2,
            }).format();
        };

        // 🔥 Remove qualquer caractere não numérico
        const cleanCurrency = (value: string) => {
            return value.replace(/\D/g, ""); // Mantém apenas números
        };

        // 🏦 Manipula mudanças no input garantindo que o backend receba o valor correto
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange?: (value: any) => void) => {
            let value = e.target.value;

            if (type === "money") {
                const cleanValue = cleanCurrency(value);
                const numericValue = Number(cleanValue) / 100; // Converte para decimal
                setValue(name, numericValue, { shouldValidate: true }); // 🔥 Salva internamente sem máscara

                if (fieldOnChange) fieldOnChange(numericValue);
                e.target.value = formatCurrency(numericValue); // 🔥 Exibe formatado
            } else {
                setValue(name, value, { shouldValidate: true });
                if (fieldOnChange) fieldOnChange(value);
            }

            if (onChange) onChange(e);
        };

        return (
            <InputContainer className={className}>
                {floatLabel ? (
                    <FloatingLabelWrapper>
                        {type === "date" ? (
                            // 🔥 Caso o tipo seja "date", usamos um input padrão
                            <Controller
                                name={name}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={name}
                                        type={type}
                                        value={type === "date" ? formatDateToInput(field.value) : field.value || ""}
                                        required={required}
                                        placeholder=" "
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value); // ✅ Atualiza o formulário corretamente
                                            setValue(name, value, { shouldValidate: true }); // ✅ Atualiza manualmente
                                            if (onChange) onChange(e);
                                        }}
                                    />
                                )}
                            />
                        ) : mask ? (
                            <InputMask
                                mask={mask}
                                maskPlaceholder={maskPlaceholder}
                                {...register(name, { required })}
                            >
                                {(inputProps) => (
                                    <Input
                                        {...inputProps}
                                        id={name}
                                        type={type}
                                        required={required}
                                        placeholder=" " // 🔥 Mantemos espaço para ativar o float label
                                    />
                                )}
                            </InputMask>
                        ) : (
                            <Input
                                {...inputProps}
                                id={name}
                                type={type}
                                required={required}
                                placeholder={placeholder || ""}
                                onChange={handleChange} // 🔥 Garante que `react-hook-form` detecta a mudança
                            />
                        )}
                        <Label htmlFor={name} className="float">
                            {label} {required && <Required>*</Required>}
                        </Label>
                    </FloatingLabelWrapper>
                ) : (
                    <StaticLabelWrapper> {/* 🔥 Agora o label fica fixo acima do input */}
                        <Label htmlFor={name} className="static-label">
                            {label} {required && <Required>*</Required>}
                        </Label>
                        {mask ? (
                            <InputMask
                                mask={mask}
                                maskPlaceholder={maskPlaceholder}
                                {...register(name, { required })}
                            >
                                {(inputProps) => (
                                    <Input
                                        {...inputProps}
                                        id={name}
                                        type={type}
                                        required={required}
                                        placeholder={placeholder || ""} // 🔥 Agora o placeholder funciona corretamente
                                    />
                                )}
                            </InputMask>
                        ) : (
                            <Controller
                                name={name}
                                control={control}
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <Input
                                        id={name}
                                        type={type === "money" ? "text" : type}
                                        placeholder={placeholder || ""}
                                        required={required}
                                        value={
                                            type === "money"
                                                ? formatCurrency(cleanCurrency(value || ""))
                                                : value || ""
                                        }
                                        onChange={(e) => {
                                            const numericValue = Number(cleanCurrency(e.target.value)) / 100; // Converte para decimal
                                            handleChange(e);
                                            onChange(numericValue); // ✅ Agora é um número
                                        }}

                                        onBlur={onBlur}
                                        ref={ref}
                                    />
                                )}
                            />
                        )}
                    </StaticLabelWrapper>
                )}

                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </InputContainer>
        );
    };

export default FloatingMaskedInput;
