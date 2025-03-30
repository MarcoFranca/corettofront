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
    whatch:any;
    tipoApolice: string;
}


const StepDetalhesApolice: React.FC<StepDetalhesApoliceProps> =
    ({
         control,
         tipoApolice,
         setValue,
         register,
        whatch
     }) => {

        switch (tipoApolice) {
            case "Plano de Saúde":
                return <PlanoSaude watch={whatch} register={register} setValue={setValue} control={control} />;
            case "Seguro de Vida":
                return <SeguroVida control={control} setValue={setValue} watch={whatch} register={register} />;
            case "Consórcio":
                return <Consorcio control={control} setValue={setValue} register={register}/>;
            case "Previdência":
                return <Previdencia control={control} setValue={setValue} register={register} watch={whatch}/>;
            case "Investimento":
                return <Investimento control={control} />;
            case "Seguro Residencial":
                return <SeguroResidencial control={control} />;
            case "Seguro Profissional":
                return <SeguroProfissional control={control} />;
            default:
                return <p>Selecione um tipo de apólice</p>;
        }
    };

export default StepDetalhesApolice;
