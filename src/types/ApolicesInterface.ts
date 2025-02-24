
// ✅ Interface dos dados da apólice
export interface ApoliceFormData {
    coberturas: { descricao: string; valor: number }[];
    detalhes: Record<string, any>;
    cliente: { value: string; label: string } | string | null;
    parceiro?: string | null;
    tipoApolice: string | null;
    administradora: string | { value: string; label: string } | null;
    numero_apolice?: string;
    status?: string;

    data_inicio: string;
    data_vencimento?: string | null;
    data_revisao?: string | null;

    premio_pago: number;
    periodicidade_pagamento: string;
    forma_pagamento: string;
    observacoes?: string | null;

    // Campos exclusivos de Consórcio
    contemplada?: boolean;
    grupo?: string;
    cota?: string;
    prazo?: number;
    indice_correcao?: string;
    furo?: number | null;
    objetivo?: string;
    estrategia?: string;
    parcela_reduzida?: boolean;
    percentual_reducao_parcela?: number | null;
    data_ultimo_lance?: string | null;
    tipo_lance?: string;
    detalhes_lance?: string;
    aporte?: number | null;
    valor_final_carta?: number | null;
    valor_parcela?: number;
    parcelas_pagas?: number;
    historico_pagamentos?: Record<string, any>;
    historico_reajustes?: Record<string, any>;
    lance_fixo_opcoes?: number[];

    permitir_lance_fixo?: boolean;
    permitir_lance_livre?: boolean;
    permitir_embutido_fixo?: boolean;
    permitir_embutido_livre?: boolean;

    // Arquivo da apólice
    arquivoApolice?: File | null;
}


export interface ApoliceWizardProps {
    onClose: () => void;
}

export const tipoApoliceParaEndpoint: Record<string, string> = {
    "Consórcio": "apolices/consorcio/",
    "Plano de Saúde": "apolices/plano_saude/",
    "Seguro de Vida": "apolices/seguro_vida/",
    "Previdência": "apolices/previdencia/",
    "Investimento": "apolices/investimento/",
    "Seguro Profissional": "apolices/seguro_profissional/",
    "Seguro Residencial": "apolices/seguro_residencial/"
};

export const moneyFields = ["premioPago", "valorParcela", "valorFinalCarta", "aporte", "valor_cota"];
