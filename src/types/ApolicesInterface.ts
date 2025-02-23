
// ✅ Interface dos dados da apólice
export interface ApoliceFormData {
    detalhes: Record<string, any>;
    coberturas: { descricao: string; valor: number }[];
    cliente: { value: string; label: string } | string | null;
    parceiro?: string;
    tipoApolice: string | null;  // ✅ Agora pode ser null
    administradora: { value: string; label: string } | null; // ✅ Agora pode armazenar `{ value, label }`
    numeroApolice: string;
    dataInicio: string;
    dataVencimento?: string;
    dataRevisao?: string;
    premioPago: number;
    valorParcela: number;
    periodicidadePagamento: string;  // 🔥 Adicionado
    formaPagamento: string;  // 🔥 Adicionado
    valorCota: number;  // 🔥 Adicionado
    indiceCorrecao: string;  // 🔥 Adicionado
    objetivo: string;  // 🔥 Adicionado
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
