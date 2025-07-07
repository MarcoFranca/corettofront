import { useState } from "react";
import { Controller } from "react-hook-form";
import { InputContainer, FloatingLabelWrapper, Label, Required } from "./FloatingMaskedInput.styles";
import Select from "react-select";
import { getIdentityMask, identidadeOptions } from "@/utils/maskUtils";

// Aplica a máscara manualmente (só números + substitui pontos e traços)
function applyMask(value: string, mask: string): string {
    let masked = "";
    let i = 0;
    const digits = value.replace(/\D/g, "");

    for (const char of mask) {
        if (char === "9") {
            if (digits[i]) {
                masked += digits[i];
                i++;
            } else break;
        } else {
            masked += char;
        }
    }

    return masked;
}

interface Props {
    name: string;
    control: any;
    setValue: any;
    label?: string;
    required?: boolean;
    className?: string;
    errorMessage?: string;
}

const IdentidadeInput: React.FC<Props> = ({
                                              name,
                                              control,
                                              setValue,
                                              label = "Identidade",
                                              required = false,
                                              className = "",
                                              errorMessage = ""
                                          }) => {
    const [isFocused, setIsFocused] = useState(false);


    return (
        <InputContainer className={className}>
            {/* Tipo de Identidade */}
            <Controller
                name="tipo_identidade"
                control={control}
                defaultValue={control._formValues?.tipo_identidade || "RG"}
                render={({ field }) => (
                    <div style={{ marginBottom: 16 }}>
                        <Select
                            options={identidadeOptions}
                            value={identidadeOptions.find(opt => opt.value === field.value)}
                            onChange={(option: any) => {
                                const value = option?.value || "";
                                field.onChange(value);
                                setValue("tipo_identidade", value, { shouldValidate: true });
                                setValue(name, ""); // Limpa a identidade só quando troca
                            }}
                            isSearchable={false}
                            placeholder="Tipo de Documento"
                            styles={{
                                control: base => ({ ...base, minHeight: 36, borderRadius: 7, borderColor: "#e0e6ef" }),
                                menu: base => ({ ...base, zIndex: 9999 })
                            }}
                        />
                    </div>
                )}
            />

            {/* Campo Identidade com máscara controlada */}
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    const tipoIdentidade = control._formValues?.tipo_identidade || "RG";
                    const mask = getIdentityMask(tipoIdentidade);
                    const isFloating = isFocused || !!field.value;

                    return (
                        <FloatingLabelWrapper>
                            <input
                                type="text"
                                value={applyMask(field.value || "", mask)}
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, "");
                                    const masked = applyMask(digits, mask);
                                    field.onChange(masked);
                                    setValue(name, masked);
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder=" "
                                className="input"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: isFocused ? "1.5px solid #007bff" : "1px solid #ccc",
                                    borderRadius: "5px",
                                    fontSize: "16px",
                                    color: "#333",
                                    background: "#fff",
                                    outline: "none",
                                    transition: "border-color 0.3s"
                                }}
                            />
                            <Label
                                htmlFor={name}
                                className="float"
                                style={{
                                    position: "absolute",
                                    top: isFloating ? "-9px" : "11px",
                                    left: "12px",
                                    fontSize: isFloating ? "16px" : "16px",
                                    color: isFloating ? "#007bff" : "#888",
                                    background: "#fff",
                                    padding: "0 4px",
                                    pointerEvents: "none",
                                    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)"
                                }}
                            >
                                {label} {required && <Required>*</Required>}
                            </Label>
                        </FloatingLabelWrapper>
                    );
                }}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </InputContainer>
    );
};

export default IdentidadeInput;
