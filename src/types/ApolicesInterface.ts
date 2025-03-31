
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
    valor_carta?: number;
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
    apolice?: Partial<ApoliceFormData> & { id?: string } | ApoliceDetalhada;
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


interface Beneficiario {
    id: string;
    nome: string;
    data_nascimento: string;
    idade: number;
    parentesco: string;
    percentual: number;
}

// 🏛️ Base para todas as apólices
export interface BaseApolice {
    id: string;
    numero_apolice: string;
    administradora: string;
    administradora_nome?: string;
    cliente: string;
    cliente_nome: string;
    cliente_sobre_nome: string;
    status: string;
    data_inicio: string;
    data_vencimento?: string;
    vitalicia?: boolean;
    data_revisao?: string;
    premio_pago: number;
    periodicidade_pagamento: string;
    forma_pagamento: string;
    regra_comissao?: string;
    parceiro?: string;
    observacoes?: string;
    arquivo?: string; // ✅ Agora pode ser opcional
    tipo_produto: string;
}

// 🏥 Plano de Saúde
export interface ApolicePlanoSaude extends BaseApolice {
    categoria: string;
    acomodacao: string;
    abrangencia: string;
    valor_reembolso_consulta?: number;
    coparticipacao: boolean;
    tipo_contratante: 'PF' | 'PJ';
    cpf_cnpj?: string;
    beneficiarios?: Beneficiario[]; // ✅ Agora é opcional
}

// ⚰️ Seguro de Vida
export interface ApoliceSeguroVida extends BaseApolice {
    categoria: string;
    valor_segurado: number;
    periodo_vigencia: boolean;
    tipo_contratante: 'PF' | 'PJ';
    cpf_cnpj?: string;
    beneficiarios?: Beneficiario[]; // ✅ Agora é opcional
    classe_ajuste?: string;
    subcategoria?:string;
    capital_segurado_total?:number;
    coberturas?: {
        id: string;
        nome: {
            id: string;
            nome: string;
            show: boolean;
        };
        subclasse: string;
        capital_segurado: string;
    }[]; // ✅ Adicionando coberturas ao seguro de vida
}

// 🏦 Consórcio
export interface ApoliceConsorcio extends BaseApolice {
    categoria: string;
    valor_total: number;
    valor_parcela: number;
    tipo_consorcio: string;
    data_termino: string;
    tipo_contratante: 'PF' | 'PJ';
    cpf_cnpj?: string;
    saldo_devedor: number;
    beneficiarios?: Beneficiario[];

    // 🔹 Campos adicionais de Consórcio
    contemplada: boolean;
    grupo: string;
    cota: string;
    prazo: number;
    indice_correcao: string;
    furo?: number;
    objetivo: string;
    estrategia?: string;
    parcela_reduzida: boolean;
    percentual_reducao_parcela?: number;
    data_ultimo_lance?: string;
    tipo_lance?: string;
    detalhes_lance?: string;
    aporte?: number;
    valor_final_carta?: number;
    valor_carta: number;
    parcelas_pagas: number;
    historico_pagamentos?: Record<string, any>;
    historico_reajustes?: Record<string, any>;
    lance_fixo_opcoes?: number[];
    permitir_lance_fixo: boolean;
    permitir_lance_livre: boolean;
    permitir_embutido_fixo: boolean;
    permitir_embutido_livre: boolean;
}

// 🏦 Previdência
export interface ApolicePrevidencia extends BaseApolice {
    nome_fundo: string;
    fundo: string;
    valor_acumulado: number;
    regime_tributacao: string;
    regime_contratacao: string;
}


// 🔄 Tipo Genérico para todas as Apólices Detalhadas
export type ApoliceDetalhada = ApolicePlanoSaude | ApoliceSeguroVida | ApoliceConsorcio | ApolicePrevidencia;

