import React from "react";
import {
    FiltroContainer, FiltroSelect
} from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/apolice/(component)/ApoliceFilter.styles";

interface ApoliceFiltroProps {
    tipoFiltro: string;
    setTipoFiltro: (value: string) => void;
    statusFiltro: string;
    setStatusFiltro: (value: string) => void;
    visaoGeral: boolean;
    setVisaoGeral: (value: boolean) => void;
    onFiltrar: () => void;
}

const ApoliceFiltro: React.FC<ApoliceFiltroProps> = ({
                                                         tipoFiltro, setTipoFiltro,
                                                         statusFiltro, setStatusFiltro,
                                                         visaoGeral, setVisaoGeral,
                                                         onFiltrar
                                                     }) => {
    return (
        <FiltroContainer className="filtros">
            <FiltroSelect value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
                <option value="">Todos os Tipos</option>
                <option value="consorcio">Consórcio</option>
                <option value="seguro_vida">Seguro de Vida</option>
                <option value="plano_saude">Plano de Saúde</option>
                <option value="investimento">Investimento</option>
                <option value="previdencia">Previdência</option>
            </FiltroSelect>

            <FiltroSelect value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
                <option value="">Todos os Status</option>
                <option value="ativa">Ativa</option>
                <option value="cancelada">Cancelada</option>
                <option value="encerrada">Encerrada</option>
            </FiltroSelect>

            <label>
                <input
                    type="checkbox"
                    checked={visaoGeral}
                    onChange={() => setVisaoGeral(!visaoGeral)}
                />
                Visão Geral (Todas do Usuário)
            </label>

            <button onClick={onFiltrar}>Filtrar</button>
        </FiltroContainer>
    );
};

export default ApoliceFiltro;
