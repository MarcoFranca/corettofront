import React from "react";
import { ApoliceSeguroAuto } from "@/types/ApolicesInterface";

interface Props {
    apolice: ApoliceSeguroAuto;
}

const SeguroAutoDetalhes: React.FC<Props> = ({ apolice }) => {
    return (
        <div>
            <h3>🚗 Seguro Auto</h3>
            <ul>
                <li><b>Veículo:</b> {apolice.marca} {apolice.modelo} ({apolice.ano_fabricacao}/{apolice.ano_modelo})</li>
                <li><b>Placa:</b> {apolice.placa}</li>
                <li><b>Chassi:</b> {apolice.chassi || "—"}</li>
                <li><b>Renavam:</b> {apolice.renavam || "—"}</li>
                <li><b>Cor:</b> {apolice.cor || "—"}</li>
                <li><b>Combustível:</b> {apolice.combustivel || "—"}</li>
                <li><b>Categoria:</b> {apolice.categoria_veiculo || "—"}</li>
                <li><b>Tipo de Cobertura:</b> {apolice.tipo_cobertura}</li>
                <li><b>Valor do Veículo:</b> R$ {apolice.valor_veiculo}</li>
                <li><b>Franquia:</b> {apolice.franquia}</li>
                {/* Outros campos relevantes */}
            </ul>
            {/* Pode exibir condutor, coberturas adicionais, etc. */}
        </div>
    );
};

export default SeguroAutoDetalhes;
