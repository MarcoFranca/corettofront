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
                <Input control={control} setValue={setValue}
                       register={register}
                       name="premio_pago"
                       label="💎 Prêmio Pago (Valor do Plano)"
                       type="money" required
                />

                <Input
                    name="detalhes.capital_de_seguro"
                    label="💰 Capital de Seguro"
                    type="money"
                    required
                    control={control}
                    register={register}
                    setValue={setValue}
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
