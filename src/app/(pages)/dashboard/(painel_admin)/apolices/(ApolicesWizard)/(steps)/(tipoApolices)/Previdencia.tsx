import React from "react";
import { Controller } from "react-hook-form";
import {
    PrevidenciaGrid,
    Input,
    SelectStyled,
    SectionTitle
} from "./Previdencia.styles";

const regimeTributacaoOptions = [
    { value: "progressivo", label: "Progressivo" },
    { value: "regressivo", label: "Regressivo" },
];

const regimeContratacaoOptions = [
    { value: "pgbl", label: "PGBL" },
    { value: "vgbl", label: "VGBL" },
];

interface PrevidenciaProps {
    control: any;
    setValue: any;
    register: any;
    watch: any;
}

const Previdencia: React.FC<PrevidenciaProps> = ({ control, setValue, register }) => {

    return (
        <>
            <SectionTitle>🏦 Informações da Previdência</SectionTitle>
            <PrevidenciaGrid>
                <Input control={control} setValue={setValue}
                       register={register}
                       name="detalhes.premio_pago"
                       label="💎 Prêmio Pago (Valor do Plano)"
                       type="money" required />
                <Input
                    control={control}
                    setValue={setValue}
                    register={register}
                    name="detalhes.nome_fundo"
                    label="📘 Nome do Fundo"
                    required
                />

                <Input
                    control={control}
                    setValue={setValue}
                    register={register}
                    name="detalhes.fundo"
                    label="🏛️ Fundo"
                />

                <Input
                    control={control}
                    setValue={setValue}
                    register={register}
                    name="detalhes.valor_acumulado"
                    label="💰 Valor Acumulado"
                    type="money"
                />

                <SelectStyled
                    control={control}
                    name="detalhes.regime_tributacao"
                    label="📊 Regime de Tributação"
                    options={regimeTributacaoOptions}
                />

                <SelectStyled
                    control={control}
                    name="detalhes.regime_contratacao"
                    label="📝 Regime de Contratação"
                    options={regimeContratacaoOptions}
                />
            </PrevidenciaGrid>
        </>
    );
};


export default Previdencia;
