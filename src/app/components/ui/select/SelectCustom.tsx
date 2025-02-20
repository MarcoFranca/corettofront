import React from "react";
import Select, { SingleValue, MultiValue, ActionMeta } from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import { Controller } from "react-hook-form";
import { SelectWrapper, ErrorMessage, customSelectStyles, Label } from "./SelectCustom.styles";

interface Option {
    value: string;
    label: string;
    isDisabled?: boolean;
}

interface SelectProps {
    name: string;
    control: any;
    label?: React.ReactNode;
    showLabel?: boolean;
    value?: Option | null;
    onChange?: (value: string | string[]) => void;
    placeholder?: string;
    options?: Option[]; // ✅ Agora é opcional
    required?: boolean;
    className?: string;
    errorMessage?: string;
    isMulti?: boolean;
    isSearchable?: boolean;
    isAsync?: boolean;
    loadOptions?: (search: string, prevOptions: any, additional: any) => Promise<any>;
    defaultOptions?: boolean;
}

const SelectCustom: React.FC<SelectProps> = ({
                                                 name,
                                                 control,
                                                 label = "",
                                                 showLabel = true,
                                                 value,
                                                 onChange,
                                                 placeholder = "Selecione...",
                                                 options = [], // ✅ Definimos um padrão vazio
                                                 required = false,
                                                 className = "",
                                                 errorMessage = "",
                                                 isMulti = false,
                                                 isSearchable = false,
                                                 isAsync = false,
                                                 loadOptions,
                                                 defaultOptions = true,
                                             }) => {

    return (
        <SelectWrapper className={className}>
            {showLabel && <Label>{label} {required && <span>*</span>}</Label>}

            <Controller
                name={name}
                control={control}
                rules={{ required: required ? "Este campo é obrigatório" : false }}
                render={({ field, fieldState }) => (
                    isAsync ? (
                        <AsyncPaginate
                            {...field}
                            loadOptions={loadOptions!}
                            defaultOptions={defaultOptions}
                            isMulti={isMulti}
                            isSearchable
                            placeholder={placeholder}
                            styles={customSelectStyles(required)}
                            value={
                                isAsync
                                    ? field.value
                                        ? { value: field.value, label: options.find(opt => opt.value === field.value)?.label || field.value }
                                        : null
                                    : isMulti
                                        ? options.filter(opt => Array.isArray(field.value) && field.value.includes(opt.value))
                                        : options.find(opt => opt.value === field.value) || null
                            }

                            onChange={(selected: MultiValue<Option> | SingleValue<Option>, _: ActionMeta<Option>) => {
                                let selectedValue: string | string[] = "";

                                if (!selected) {
                                    selectedValue = "";
                                } else if (Array.isArray(selected)) {
                                    selectedValue = selected.map(s => s.value);
                                } else if ("value" in selected) {
                                    selectedValue = selected.label;
                                }

                                field.onChange(selectedValue);
                                if (onChange) onChange(selectedValue);
                            }}
                        />
                    ) : (
                        <Select
                            {...field}
                            options={options}
                            isMulti={isMulti}
                            isSearchable={isSearchable}
                            placeholder={placeholder}
                            styles={customSelectStyles(required)}
                            value={
                                isMulti
                                    ? options.filter((opt) => Array.isArray(field.value) && field.value.includes(opt.value))
                                    : options.find((opt) => opt.value === field.value) || null
                            }
                            onChange={(selected) => {
                                let selectedValue: string | string[] = "";

                                if (!selected) {
                                    selectedValue = "";
                                } else if (Array.isArray(selected)) {
                                    selectedValue = selected.map((s) => s.value);
                                } else if ("value" in selected) {
                                    selectedValue = selected.value;
                                }

                                field.onChange(selectedValue);
                                if (onChange) onChange(selectedValue);
                            }}
                        />
                    )
                )}
            />
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </SelectWrapper>
    );
};

export default SelectCustom;
