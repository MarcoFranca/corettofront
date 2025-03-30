// 📂 src/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/SeguroResidencial.tsx

import React from "react";
import {
    SeguroResidencialGrid,
    Input,
    SectionTitle,
    TextArea
} from "./SeguroResidencial.styles";

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
                <Input control={control} setValue={setValue}
                       register={register}
                       name="detalhes.premio_pago"
                       label="💎 Prêmio Pago (Valor do Plano)"
                       type="money" required
                />
                <Input
                    name="detalhes.capital_de_seguro"
                    label="💰 Capital de Seguro"
                    type="money"
                    control={control}
                    setValue={setValue}
                    register={register}
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
