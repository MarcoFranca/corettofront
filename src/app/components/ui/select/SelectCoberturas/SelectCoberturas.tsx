// 📂 components/ui/select/SelectCobertura.tsx
import React, { useEffect, useState } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { Controller } from "react-hook-form";
import { fetchCoberturas, Option } from "./selectUtils";

interface SelectCoberturaProps {
    name: string;
    control: any;
    label?: string;
    placeholder?: string;
    required?: boolean;
    showLabel?: boolean;
    errorMessage?: string;
}

const SelectCobertura: React.FC<SelectCoberturaProps> = ({
                                                             name,
                                                             control,
                                                             label = "Cobertura",
                                                             placeholder = "Selecione uma cobertura",
                                                             required = false,
                                                             showLabel = true,
                                                             errorMessage = "",
                                                         }) => {
    const [coberturas, setCoberturas] = useState<Option[]>([]);

    useEffect(() => {
        fetchCoberturas().then(setCoberturas);
    }, []);

    // 🔥 Estilos personalizados do `react-select`
    const customStyles: StylesConfig<Option, false> = {
        placeholder: (provided) => ({
            ...provided,
            fontStyle: "italic",
            color: "#999",
            position: "relative",
            "&::after": required
                ? {
                    content: "' *'",
                    color: "red",
                    fontWeight: "bold",
                }
                : {},
        }),
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? "#007bff" : "#ccc",
            boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 123, 255, 0.2)" : "none",
        }),
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {showLabel && (
                <label>
                    {label} {required && <span style={{ color: "red" }}>*</span>}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                rules={{ required: required ? "Este campo é obrigatório" : false }}
                render={({ field }) => (
                    <Select
                        {...field}
                        options={coberturas}
                        placeholder={placeholder}
                        isSearchable
                        styles={customStyles}
                        value={coberturas.find(opt => opt.value === field.value) || null}
                        onChange={(selected: SingleValue<Option>) => {
                            field.onChange(selected ? selected.value : "");
                        }}
                    />
                )}
            />
            {errorMessage && <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>{errorMessage}</p>}
        </div>
    );
};

export default SelectCobertura;
