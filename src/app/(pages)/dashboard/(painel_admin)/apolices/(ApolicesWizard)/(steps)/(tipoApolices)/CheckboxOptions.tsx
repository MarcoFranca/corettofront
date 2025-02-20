import React from "react";
import { StyledCheckbox, CheckboxGroupStyled, CheckboxTitle } from "./Consorcio.styles";
import { Controller, UseFormRegister, Control } from "react-hook-form";

interface CheckboxOptionsProps {
    control: Control<any>;
}

const CheckboxOptions: React.FC<CheckboxOptionsProps> = ({ control }) => {
    return (
        <div>
            <CheckboxTitle>🎛️ Permissões de Lances:</CheckboxTitle>
            <CheckboxGroupStyled>
                <Controller
                    name="detalhes.permitir_lance_livre"
                    control={control}
                    render={({ field }) => (
                        <StyledCheckbox {...field} checked={field.value}>Lance Livre</StyledCheckbox>
                    )}
                />
                <Controller
                    name="detalhes.permitir_lance_fixo"
                    control={control}
                    render={({ field }) => (
                        <StyledCheckbox {...field} checked={field.value}>Lance Fixo</StyledCheckbox>
                    )}
                />
                <Controller
                    name="detalhes.permitir_embutido_fixo"
                    control={control}
                    render={({ field }) => (
                        <StyledCheckbox {...field} checked={field.value}>Embutido (Lance Fixo)</StyledCheckbox>
                    )}
                />
                <Controller
                    name="detalhes.permitir_embutido_livre"
                    control={control}
                    render={({ field }) => (
                        <StyledCheckbox {...field} checked={field.value}>Embutido (Lance Livre)</StyledCheckbox>
                    )}
                />
            </CheckboxGroupStyled>
        </div>
    );
};

export default CheckboxOptions;
