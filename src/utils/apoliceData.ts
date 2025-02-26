// utils/formatApoliceData.ts

import { ApoliceFormData } from "@/types/ApolicesInterface";
import currency from "currency.js";

// 🏦 Funções auxiliares para formatação de valores
const formatUUID = (value: any) => (value && typeof value === "object" ? value.value : value || null);
const formatNumber = (value: any) => (isNaN(Number(value)) ? null : Number(value));
const formatString = (value: any) => (typeof value === "string" ? value.trim() : null);
const formatDate = (date: string | null | undefined) =>
    date ? new Date(date).toISOString().split("T")[0] : null;
const cleanMoneyValue = (value: string | number) =>
    typeof value === "string" ? Number(value.replace(/[^\d,]/g, "").replace(",", ".")) : value || null;

// ✅ 🚀 Estrutura Base (comum para todas as apólices)
export const formattedDataBase = (data: ApoliceFormData) => ({
    cliente: formatUUID(data.cliente),
    administradora: formatUUID(data.administradora),
    parceiro: formatUUID(data.parceiro),
    numero_apolice: formatString(data.numero_apolice),
    status: formatString(data.status) || "ativa",
    data_inicio: formatDate(data.data_inicio),
    data_vencimento: data.data_vencimento ? formatDate(data.data_vencimento) : null,
    data_revisao: data.data_revisao ? formatDate(data.data_revisao) : null,
    premio_pago: cleanMoneyValue(data.detalhes.premio_pago),
    periodicidade_pagamento: formatString(data.periodicidade_pagamento) || "mensal",
    forma_pagamento: formatString(data.detalhes.forma_pagamento) || "boleto",
    observacoes: formatString(data.observacoes),
});

// ✅ 🚀 Estruturas Específicas para Cada Tipo de Apólice
export const formattedDataByType = {

    "Plano de Saúde": (data: ApoliceFormData) => ({
        categoria: data.detalhes.categoria,
        acomodacao: data.detalhes.acomodacao,
        abrangencia: data.detalhes.abrangencia,
        valor_reembolso_consulta: cleanMoneyValue(data.detalhes.valor_reembolso_consulta),
        coparticipacao: data.detalhes.coparticipacao,
    }),
    "Consórcio": (data: ApoliceFormData) => ({
        contemplada: data.contemplada || false,
        grupo: formatString(data.detalhes.grupo),
        cota: formatString(data.detalhes.cota),
        prazo: formatNumber(data.detalhes.prazo) || 0,
        indice_correcao: formatString(data.detalhes.indice_correcao),
        furo: formatNumber(data.detalhes.furo) || 0,
        objetivo: formatString(data.detalhes.objetivo),
        estrategia: formatString(data.detalhes.estrategia),
        percentual_reducao_parcela: formatNumber(data.detalhes.percentual_reducao_parcela),
        tipo_lance: formatString(data.tipo_lance),
        detalhes_lance: formatString(data.detalhes_lance),
        aporte: formatNumber(data.aporte),
        valor_parcela: cleanMoneyValue(data.detalhes.valor_parcela || 0),
        parcelas_pagas: formatNumber(data.parcelas_pagas),
        historico_pagamentos: data.historico_pagamentos ?? {},
        historico_reajustes: data.historico_reajustes ?? {},
        permitir_lance_fixo: data.permitir_lance_fixo ?? false,
        permitir_lance_livre: data.permitir_lance_livre ?? false,
        permitir_embutido_fixo: data.permitir_embutido_fixo ?? false,
        permitir_embutido_livre: data.permitir_embutido_livre ?? false,
    }),
    "seguro_vida": (data: ApoliceFormData) => ({
        coberturas: Array.isArray(data.coberturas) ? data.coberturas : [],
    }),
};
