// 📂 tipoApolices/PlanoSaude.tsx
import React from 'react';
import { Controller } from "react-hook-form";
import {
    PlanoSaudeGrid,
    SectionTitle,
    Input,
    SelectStyled,
    OptionalSection,
    SwitchContainer,
    SwitchLabel
} from "./PlanoSaude.styles";
import { Switch } from "antd";
import SelectCustom from "@/app/components/ui/select/SelectCustom";

interface PlanoSaudeProps {
    control: any;
    setValue: any;
    register: any;
}

const PlanoSaude: React.FC<PlanoSaudeProps> = ({ control, setValue, register }) => {
    return (
        <>
            <SectionTitle>📋 Informações do Plano</SectionTitle>
            <PlanoSaudeGrid>
                <Input
                    control={control}
                    setValue={setValue}
                    register={register}
                    name="detalhes.categoria"
                    label="📁 Categoria do Plano"
                    required
                />

                <SelectCustom
                    control={control}
                    name="detalhes.acomodacao"
                    label="🏥 Acomodação"
                    options={[
                        { value: "Apartamento", label: "Apartamento" },
                        { value: "Enfermaria", label: "Enfermaria" },
                    ]}
                    required
                />

                <SelectCustom
                    control={control}
                    name="detalhes.abrangencia"
                    label="📍 Abrangência"
                    options={[
                        { value: "Nacional", label: "Nacional" },
                        { value: "Estadual", label: "Estadual" },
                        { value: "Regional", label: "Regional" },
                    ]}
                    required
                />
            </PlanoSaudeGrid>

            <OptionalSection>
                <SectionTitle>⚙️ Configurações Opcionais</SectionTitle>
                <PlanoSaudeGrid>
                    <Input
                        control={control}
                        setValue={setValue}
                        register={register}
                        name="detalhes.valor_reembolso_consulta"
                        label="💰 Reembolso Consulta (R$)"
                        type="money"
                    />

                    <SwitchContainer>
                        <Controller
                            name="detalhes.coparticipacao"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Switch {...field} checked={field.value} />
                                    <SwitchLabel>Coparticipação</SwitchLabel>
                                </>
                            )}
                        />
                    </SwitchContainer>
                </PlanoSaudeGrid>
            </OptionalSection>
        </>
    );
};

export default PlanoSaude;
