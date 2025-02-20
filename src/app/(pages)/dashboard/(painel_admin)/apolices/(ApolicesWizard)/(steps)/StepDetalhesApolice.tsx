// 📂 src/components/ApolicesWizard/steps/StepDetalhesApolice.tsx
"use client";

import React from "react";

import PlanoSaude
    from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/PlanoSaude";
import SeguroVida
    from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/SeguroVida";
import Consorcio
    from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/Consorcio";
import Previdencia
    from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/Previdencia";
import Investimento
    from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/Investimento";
import SeguroResidencial
    from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/SeguroResidencial";
import SeguroProfissional
    from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/SeguroProfissional";


interface StepDetalhesApoliceProps {
    control: any;
    setValue: any;   // ✅ Adicionado
    register: any;   // ✅ Adicionado
    tipoApolice: string;
}


const StepDetalhesApolice: React.FC<StepDetalhesApoliceProps> =
    ({
         control,
         tipoApolice,
         setValue,
         register
     }) => {

        switch (tipoApolice) {
            case "plano_saude":
                return <PlanoSaude control={control} />;
            case "seguro_vida":
                return <SeguroVida control={control} />;
            case "consorcio":
                return <Consorcio control={control} setValue={setValue} register={register}/>;
            case "previdencia":
                return <Previdencia control={control} />;
            case "investimento":
                return <Investimento control={control} />;
            case "seguro_residencial":
                return <SeguroResidencial control={control} />;
            case "seguro_profissional":
                return <SeguroProfissional control={control} />;
            default:
                return <p>Selecione um tipo de apólice</p>;
        }
    };

export default StepDetalhesApolice;
