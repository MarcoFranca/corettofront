// 📂 src/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/Investimento.tsx

import React from "react";
import {
    InvestimentoGrid,
    Input,
    SectionTitle
} from "./Investimento.styles";

interface Props {
    control: any;
    setValue: any;
    register: any;
    watch: any;
}

const Investimento: React.FC<Props> = ({ control, setValue, register }) => {
    return (
        <>
            <SectionTitle>📈 Informações do Investimento</SectionTitle>
            <InvestimentoGrid>
                <Input control={control} setValue={setValue}
                       register={register}
                       name="premio_pago"
                       label="💎 Prêmio Pago (Valor do Plano)"
                       type="money" required
                />
                <Input
                    control={control}
                    setValue={setValue}
                    register={register}
                    name="detalhes.valor_investido"
                    label="💰 Valor Investido"
                    type="money"
                    required
                />
            </InvestimentoGrid>
        </>
    );
};

export default Investimento;
