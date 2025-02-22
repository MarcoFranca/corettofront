import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { Controller } from "react-hook-form";
import { Option } from "../selectUtils"; // ✅ Certifique-se de que `Option` é importado corretamente

interface SelectAdministradoraProps {
    name: string;
    control: any;
    label?: React.ReactNode;
    placeholder?: string;
    required?: boolean;
    showLabel?: boolean;
    errorMessage?: string;
    onChange?: (value: Option | null) => void;
    loadOptions: (search: string, prevOptions: any, additional: any) => Promise<any>;
    options: Option[];
    value?: Option | null; // ✅ Agora `value` está definido corretamente!
}


const SelectAdministradora: React.FC<SelectAdministradoraProps> = (
    {
        name,
        control,
        label = "Administradora",
        placeholder = "Selecione uma administradora",
        required = false,
        showLabel = true,
        errorMessage = "",
        onChange,
        loadOptions,
        options, // ✅ Agora `options` é uma propriedade corretamente tipada

    }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {showLabel && (
                <label style={{ color: "#007bff" }}>
                    {label} {required && <span style={{ color: "red" }}>*</span>}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                rules={{ required: required ? "Este campo é obrigatório" : false }}
                render={({ field }) => (
                    <AsyncPaginate
                        {...field}
                        loadOptions={loadOptions}
                        defaultOptions
                        isSearchable
                        additional={{ page: 1 }}
                        placeholder={placeholder}
                        classNamePrefix="custom-select"
                        value={
                            options.find((opt) => opt.value === field.value?.value) || field.value || null
                        } // ✅ Agora exibe o nome corretamente
                        onChange={(selected) => {
                            const selectedValue = selected ? { value: selected.value, label: selected.label } : null;
                            console.log("🔥 Administradora selecionada no select:", selectedValue);
                            field.onChange(selectedValue); // ✅ Agora armazenamos `{ value, label }`
                            if (onChange) onChange(selectedValue);
                        }}
                    />

                )}
            />

            {errorMessage && <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>{errorMessage}</p>}
        </div>
    );
};

export default SelectAdministradora;
