'use client';
import React from "react";
import { useRouter } from "next/navigation";
import {
    FiltroContainer,
    TipoPill,
    FiltroSelect, TipoPillContainer,
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApoliceFilter.styles";

interface ApoliceFiltroProps {
    tipoFiltro: string;
    setTipoFiltro: (tipo: string) => void;
    statusFiltro: string;
    setStatusFiltro: (status: string) => void;
    visaoGeral: boolean;
    setVisaoGeral: (visaoGeral: boolean) => void;
    onFiltrar: () => void;
}

const tiposApolice = [
    { tipo: '', label: 'Todas' },
    { tipo: 'plano_saude', label: 'Plano de Saúde' },
    { tipo: 'seguro_vida', label: 'Seguro de Vida' },
    { tipo: 'previdencia', label: 'Previdência' },
    { tipo: 'consorcio', label: 'Consórcio' },
    { tipo: 'investimento', label: 'Investimento' },
    { tipo: 'seguro_profissional', label: 'Seguro Profissional' },
    { tipo: 'seguro_residencial', label: 'Seguro Residencial' },
];

const ApoliceFiltro: React.FC<ApoliceFiltroProps> = ({
                                                         tipoFiltro, setTipoFiltro,
                                                         statusFiltro, setStatusFiltro,
                                                     }) => {
    const router = useRouter();

    const handleNavigate = (tipo: string) => {
        router.push(`/dashboard/apolices/${tipo}`);
    };

    return (
        <FiltroContainer>
            <TipoPillContainer>
            {tiposApolice.map(({ tipo, label }) => (
                <TipoPill
                    key={tipo}
                    $active={tipoFiltro === tipo}
                    onClick={() => handleNavigate(tipo)}
                >
                    {label}
                </TipoPill>
            ))}
            </TipoPillContainer>

            <FiltroSelect value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
                <option value="">Todos os Status</option>
                <option value="ativa">Ativa</option>
                <option value="cancelada">Cancelada</option>
                <option value="encerrada">Encerrada</option>
            </FiltroSelect>

            <FiltroSelect value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
                <option value="">Todos os Tipos</option>
                <option value="consorcio">Consórcio</option>
                <option value="seguro_vida">Seguro de Vida</option>
                <option value="plano_saude">Plano de Saúde</option>
                <option value="investimento">Investimento</option>
                <option value="previdencia">Previdência</option>
            </FiltroSelect>
        </FiltroContainer>
    );
};

export default ApoliceFiltro;
