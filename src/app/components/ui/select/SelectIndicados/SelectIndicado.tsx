// 📂 components/ui/select/SelectIndicado.tsx
import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { Controller } from "react-hook-form";
import { loadIndicadoOptions } from "../selectUtils";

interface SelectIndicadoProps {
    name: string;
    control: any;
    label?: string;
    placeholder?: string;
    required?: boolean;
    tipo: "clientes" | "parceiros"; // 🔥 Define se carrega clientes ou parceiros
    showLabel?: boolean;
    errorMessage?: string;
}

const SelectIndicado: React.FC<SelectIndicadoProps> = ({
                                                           name,
                                                           control,
                                                           label = "Indicação",
                                                           placeholder = "Selecione...",
                                                           required = false,
                                                           tipo,
                                                           showLabel = true,
                                                           errorMessage = "",
                                                       }) => {
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
                    <AsyncPaginate
                        {...field} // 🔥 Passamos corretamente os atributos do react-hook-form
                        loadOptions={(searchQuery, loadedOptions, additional) =>
                            loadIndicadoOptions(tipo, searchQuery as string, additional)
                        }
                        defaultOptions
                        isSearchable
                        additional={{ page: 1 }} // 🔥 Controle de paginação
                        placeholder={placeholder}
                        classNamePrefix="custom-select"
                        value={
                            field.value
                                ? { value: field.value, label: field.value } // ✅ Garante que é um objeto `{ value, label }`
                                : null
                        }
                        onChange={(selected) => {
                            field.onChange(selected ? selected.value : ""); // 🔥 Salva apenas o ID
                        }}
                    />
                )}
            />

            {errorMessage && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default SelectIndicado;
