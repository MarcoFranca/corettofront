import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { Controller } from "react-hook-form";
import { loadClienteSelectOptions, Option} from "../selectUtils";
import styled from "styled-components";

interface SelectClienteProps {
    name: string;
    control: any;
    label: React.ReactNode; // ✅ Aceita `JSX.Element` ou `string`
    placeholder?: string;
    required?: boolean;
    showLabel?: boolean;
    errorMessage?: string;
    onChange?: (value: Option | null) => void;
}

const Label = styled.label`
    color:${({ theme }) => theme.colorsSelect.label};
    span{
        color:${({ theme }) => theme.colors.error};
    }
`

const SelectCliente: React.FC<SelectClienteProps> = ({
                                                         name,
                                                         control,
                                                         label = "Cliente",
                                                         placeholder = "Selecione um cliente",
                                                         required = false,
                                                         showLabel = true,
                                                         errorMessage = "",
                                                         onChange,
                                                     }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {showLabel && (
                <Label >
                    {label} {required && <span>*</span>}
                </Label>
            )}

            <Controller
                name={name}
                control={control}
                rules={{ required: required ? "Este campo é obrigatório" : false }}
                render={({ field }) => (
                    <AsyncPaginate
                        {...field}
                        loadOptions={loadClienteSelectOptions}
                        defaultOptions
                        isSearchable
                        additional={{ page: 1 }}
                        placeholder={placeholder}
                        classNamePrefix="custom-select"
                        value={
                            field.value
                                ? { value: field.value, label: field.value.label } // 🔥 Garante que o nome aparece corretamente
                                : null
                        }
                        onChange={(selected) => {
                            field.onChange(selected ? { value: selected.value, label: selected.label } : null); // 🔥 Salva nome e ID
                            if (onChange) onChange(selected);
                        }}
                    />
                )}
            />

            {errorMessage && <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>{errorMessage}</p>}
        </div>
    );
};

export default SelectCliente;
