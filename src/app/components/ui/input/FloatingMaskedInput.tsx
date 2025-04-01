import React from "react";
import InputMask from "react-input-mask-next";
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
            ? register(name, required ? { required: { value: true, message: "Campo obrigatório" } } : {})
            : {};

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

        // 🔥 Remove qualquer caractere não numérico para números
        const cleanCurrency = (value: string) => {
            return value.replace(/[^\d]/g, ""); // Remove qualquer caractere não numérico
        };

        // 🏦 Manipula mudanças no input garantindo que o backend receba o valor correto
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange?: (value: any) => void) => {
            let value = e.target.value;

            if (type === "money") {
                const cleanValue = cleanCurrency(value);
                const numericValue = Number(cleanValue) / 100; // Converte para decimal


                // 🔥 Garante que o formulário armazena o valor correto sem máscara
                setValue(name, numericValue, { shouldValidate: true });
                if (fieldOnChange) fieldOnChange(numericValue);

                // **🔥 ATUALIZA APENAS O ELEMENTO SEM ALTERAR O RHF**
                e.target.value = formatCurrency(numericValue);
            }
            else if (type === "number") {
                // ✅ Garante que valores numéricos sejam enviados corretamente ao backend
                const numericValue = Number(value);
                setValue(name, numericValue, {shouldValidate: true});
                if (fieldOnChange) fieldOnChange(numericValue);

            }
            else {
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
                            <Controller
                                name={name}
                                control={control}
                                rules={{ required }}
                                render={({ field }) => (
                                    <InputMask
                                        mask={mask}
                                        maskPlaceholder={maskPlaceholder}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setValue(name, value, { shouldValidate: true });
                                            field.onChange(value);
                                            if (onChange) onChange(e);
                                        }}
                                    >
                                        <Input id={name} required={required} placeholder=" " />
                                    </InputMask>
                                )}
                            />

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
                                onChange={handleChange}
                                inputRef={register(name).ref} // ✅ Passa a ref diretamente
                            >
                                <Input
                                    id={name}
                                    required={required}
                                    placeholder=" "
                                />
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
                                                ? formatCurrency(value || 0) // 🔥 Exibe formatado, mas mantém o valor puro no form
                                                : value || ""
                                        }
                                        onChange={(e) => {
                                            const numericValue = Number(cleanCurrency(e.target.value)) / 100;
                                            console.log("📌 Salvando no formulário sem máscara:", numericValue);
                                            onChange(numericValue); // 🔥 Armazena apenas número no form
                                            setValue(name, numericValue, { shouldValidate: true });
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
