// 📂 src/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/SeguroResidencial.tsx

import React from "react";
import {
    SeguroResidencialGrid,
    SectionTitle,
    TextArea
} from "./SeguroResidencial.styles";
import {
    MoneyInputStyled
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/PlanoSaude.styles";

interface Props {
    control: any;
    setValue: any;
    register: any;
    watch: any;
}

const SeguroResidencial: React.FC<Props> = ({ control, setValue, register }) => {
    return (
        <>
            <SectionTitle>🏠 Informações do Seguro Residencial</SectionTitle>
            <SeguroResidencialGrid>
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

                <TextArea
                    name="detalhes.cobertura_adicional"
                    label="🛡️ Cobertura Adicional"
                    control={control}
                    setValue={setValue}
                    register={register}
                    type="textarea"
                />
            </SeguroResidencialGrid>
        </>
    );
};

export default SeguroResidencial;
