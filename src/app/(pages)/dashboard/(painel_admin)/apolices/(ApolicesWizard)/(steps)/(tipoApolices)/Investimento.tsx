// 📂 src/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/Investimento.tsx

import React from "react";
import {
    InvestimentoGrid,
    SectionTitle
} from "./Investimento.styles";
import {
    MoneyInputStyled
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/PlanoSaude.styles";

interface Props {
    control: any;
    setValue: any;
    register: any;
    watch: any;
}

const Investimento: React.FC<Props> = ({ control, setValue }) => {
    return (
        <>
            <SectionTitle>📈 Informações do Investimento</SectionTitle>
            <InvestimentoGrid>
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
                    name="detalhes.valor_investido_money"
                    label="💰 Valor Investido"
                    required
                />

            </InvestimentoGrid>
        </>
    );
};

export default Investimento;
