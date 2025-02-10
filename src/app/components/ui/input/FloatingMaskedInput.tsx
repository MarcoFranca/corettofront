import React from "react";
import InputMask from "react-input-mask";
import { InputContainer, Label, Input, Required, FloatingLabelWrapper, StaticLabelWrapper } from "./FloatingMaskedInput.styles";
import {UseFormRegister, UseFormSetValue} from "react-hook-form";

interface FloatingMaskedInputProps {
    label: string;
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

const FloatingMaskedInput: React.FC<FloatingMaskedInputProps> = ({
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
                                                                     setValue,
                                                                     register, // ✅ Adicionado suporte ao `register`
                                                                 }) => {
    const inputProps = register
        ? register(name, {
            required: { value: true, message: "Campo obrigatório" },
        })
        : {};
console.log(name)




    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(name, e.target.value, { shouldValidate: true }); // ✅ Agora `setValue` sempre será chamado corretamente
        if (onChange) onChange(e);
    };

    return (
        <InputContainer className={className}>
            {floatLabel ? (
                <FloatingLabelWrapper>
                    {type === "date" ? (
                        // 🔥 Caso o tipo seja "date", usamos um input padrão
                        <Input
                            {...inputProps}
                            id={name}
                            type="date"
                            value={value} // 🔥 Certifique-se de passar o valor corretamente no formato "yyyy-MM-dd"
                            required={required}
                            placeholder=" " // 🔥 Mantemos espaço para ativar o float label
                            onChange={handleChange} // Atualiza o valor no react-hook-form
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
                        <Input
                            {...inputProps}
                            id={name}
                            type={type}
                            required={required}
                            placeholder={placeholder || ""} // 🔥 Agora o placeholder funciona corretamente
                        />
                    )}
                </StaticLabelWrapper>
            )}

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </InputContainer>
    );
};

export default FloatingMaskedInput;
