// 📂 components/ui/select/SelectProfissao.tsx
import React, { useEffect, useState } from "react";
import Select, { SingleValue, GroupBase, StylesConfig } from "react-select";
import { Controller } from "react-hook-form";
import { fetchProfissoesOrganizadas, Option } from "../selectUtils";

interface SelectProfissaoProps {
    name: string;
    control: any;
    label?: string;
    placeholder?: string;
    required?: boolean;
    showLabel?: boolean;
    errorMessage?: string;
}

const SelectProfissao: React.FC<SelectProfissaoProps> = ({
                                                             name,
                                                             control,
                                                             label = "Profissão",
                                                             placeholder = "Selecione uma profissão",
                                                             required = false,
                                                             showLabel = true,
                                                             errorMessage = "",
                                                         }) => {
    const [profissoes, setProfissoes] = useState<GroupBase<Option>[]>([]);

    useEffect(() => {
        fetchProfissoesOrganizadas().then(setProfissoes);
    }, []);

    // 🔥 Estilos personalizados do `react-select`
    const customStyles: StylesConfig<Option, false> = {
        placeholder: (provided) => ({
            ...provided,
            fontStyle: "italic",
            color: "#999", // 🔥 Cor normal do placeholder
            position: "relative",
            "&::after": required
                ? {
                    content: "' *'",
                    color: "red",
                    fontWeight: "bold",
                }
                : {}, // 🔥 Adiciona o `*` apenas se for obrigatório
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
                        options={profissoes}
                        placeholder={placeholder}
                        isSearchable
                        styles={customStyles} // 🔥 Aplica os estilos customizados
                        value={profissoes.flatMap(group => group.options).find(opt => opt.value === field.value) || null}
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

export default SelectProfissao;
