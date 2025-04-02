// 📂 src/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/SeguroProfissional.tsx

import React from "react";
import {
    SectionTitle,
    SeguroProfissionalGrid,
    Input,
    SwitchContainer
} from "./SeguroProfissional.styles";
import { Controller } from "react-hook-form";
import { Switch } from "antd";
import {
    MoneyInputStyled
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/PlanoSaude.styles";

interface Props {
    control: any;
    setValue: any;
    register: any;
    watch: any;
}

const SeguroProfissional: React.FC<Props> = ({ control, setValue, register, watch }) => {
    const possuiFranquia = watch("detalhes.possui_franquia");

    return (
        <>
            <SectionTitle>📋 Informações do Seguro Profissional</SectionTitle>
            <SeguroProfissionalGrid>
                <MoneyInputStyled
                    control={control}
                    setValue={setValue}
                    name="premio_pago_money"
                    label="💎 Prêmio Pago "
                    required
                />

                <MoneyInputStyled
                    control={control}
                    setValue={setValue}
                    name="detalhes.capital_de_seguro_money"
                    label="💰 Capital de Seguro"
                    required
                />

                <SwitchContainer>
                    <label>Possui Franquia?</label>
                    <Controller
                        name="detalhes.possui_franquia"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                checked={field.value}
                                onChange={(checked) => field.onChange(checked)}
                            />
                        )}
                    />
                </SwitchContainer>

                {possuiFranquia && (
                    <Input
                        name="detalhes.descricao_franquia"
                        label="📄 Descrição da Franquia"
                        control={control}
                        register={register}
                        setValue={setValue}
                        placeholder="Ex: 30% do valor de cada sinistro"
                    />
                )}
            </SeguroProfissionalGrid>
        </>
    );
};

export default SeguroProfissional;
