import React from "react";
import {
    PrevidenciaGrid,
    Input,
    SelectStyled,
    SectionTitle
} from "./Previdencia.styles";
import {
    MoneyInputStyled
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/PlanoSaude.styles";

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
                <MoneyInputStyled
                    control={control}
                    setValue={setValue}
                    name="premio_pago_money"
                    label="💎 Prêmio Pago "
                    required
                />
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
                <MoneyInputStyled
                    control={control}
                    setValue={setValue}
                    name="detalhes.valor_acumulado_money"
                    label="💰 Valor Acumulado"
                    required
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
