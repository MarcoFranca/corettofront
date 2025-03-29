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
    options?: Option[];
}

const SelectProfissao: React.FC<SelectProfissaoProps> = ({
                                                             name,
                                                             control,
                                                             label = "Profissão",
                                                             placeholder = "Selecione uma profissão",
                                                             required = false,
                                                             showLabel = true,
                                                             errorMessage = "",
                                                             options = [],
                                                         }) => {
    const [profissoes, setProfissoes] = useState<GroupBase<Option>[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded && (!options || options.length === 0)) {
            setLoaded(true); // garante que só chama uma vez
            fetchProfissoesOrganizadas().then((data) => {
                const seen = new Set<string>();
                const deduplicated = data.map((group) => ({
                    ...group,
                    options: group.options.filter((opt) => {
                        if (seen.has(opt.value)) return false;
                        seen.add(opt.value);
                        return true;
                    }),
                }));
                setProfissoes(deduplicated);
            });
        } else if (options && options.length > 0) {
            setProfissoes([
                {
                    label: "Profissões",
                    options: options.filter((p) => p.label !== "nan"),
                },
            ]);
        }
    }, [loaded, options]);

    const customStyles: StylesConfig<Option, false> = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#0057D9" : "#D1D5DB",
            boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 87, 217, 0.2)" : "none",
            borderRadius: "8px",
            padding: "2px 4px",
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected
                ? "#0057D9"
                : isFocused
                    ? "#E5F3FF"
                    : "white",
            color: isSelected ? "white" : "#1F2937",
            paddingLeft: "12px",
            transition: "background-color 0.2s ease-in-out",
        }),
        placeholder: (base) => ({
            ...base,
            color: "#9CA3AF",
            fontStyle: "italic",
        }),
        singleValue: (base) => ({
            ...base,
            color: "#111827",
        }),
        menu: (base) => ({
            ...base,
            zIndex: 100,
        }),
        groupHeading: (base) => ({
            ...base,
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "#374151",
            background: "#F9FAFB",
            padding: "4px 12px",
        }),
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {showLabel && (
                <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "#111827" }}>
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
                        styles={customStyles}
                        value={
                            profissoes
                                .flatMap((group) => group.options)
                                .find((opt) => opt.value === field.value) || null
                        }
                        onChange={(selected: SingleValue<Option>) => {
                            field.onChange(selected ? selected.value : "");
                        }}
                    />
                )}
            />

            {errorMessage && (
                <span style={{ color: "red", fontSize: "0.75rem" }}>{errorMessage}</span>
            )}
        </div>
    );
};

export default SelectProfissao;
