// utils/formatApoliceData.ts

import {ApoliceDetalhada, ApoliceFormData} from "@/types/ApolicesInterface";

// 🏦 Funções auxiliares para formatação de valores
const formatUUID = (value: any) => {
    if (!value) return null;

    // Caso seja objeto com { value: uuid, label: nome }
    if (typeof value === "object" && "value" in value) {
        return value.value;
    }

    // Se já for string (uuid direto)
    if (typeof value === "string" && value.length === 36) {
        return value;
    }

    return null;
};
const formatNumber = (value: any) => (isNaN(Number(value)) ? null : Number(value));
const formatString = (value: any) => (typeof value === "string" ? value.trim() : null);
const formatDate = (date: string | null | undefined) =>
    date ? new Date(date).toISOString().split("T")[0] : null;

export const cleanMoneyValue = (value: string | number | null | undefined): number | null => {
    if (typeof value === "string") {
        const cleaned = value.replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".");
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }
    if (typeof value === "number") {
        return value; // aqui não converte, já está limpo
    }
    return null;
};

// ✅ 🚀 Estrutura Base (comum para todas as apólices)
export const formattedDataBase = (data: ApoliceFormData) => ({
    cliente: formatUUID(data.cliente),
    administradora: formatUUID(data.administradora),
    parceiro: data.parceiro
        ? typeof data.parceiro === "object"
            ? data.parceiro.value
            : data.parceiro
        : null,
    numero_apolice: formatString(data.numero_apolice),
    status: formatString(data.status) || "ativa",
    data_inicio: formatDate(data.data_inicio),
    data_vencimento: data.data_vencimento ? formatDate(data.data_vencimento) : null,
    data_revisao: data.data_revisao ? formatDate(data.data_revisao) : null,
    premio_pago_money: cleanMoneyValue(data.premio_pago_money),
    periodicidade_pagamento: formatString(data.periodicidade_pagamento) || "mensal",
    forma_pagamento: formatString(data.forma_pagamento) || "boleto",
    observacoes: formatString(data.observacoes),
    beneficiarios: data.detalhes.beneficiarios ? data.detalhes.beneficiarios : [],
    coberturas: data.detalhes.coberturas ? data.detalhes.coberturas : [],
});

// 🔄 Extrai somente os campos de "detalhes" com base no tipo de apólice
export const extrairDetalhesFromApolice = (apolice: ApoliceDetalhada): Record<string, any> => {
    if (!apolice || !apolice.tipo_produto) return {};

    const camposPorTipo: Record<string, string[]> = {
        "Plano de Saúde": [
            "categoria", "acomodacao", "abrangencia", "valor_reembolso_consulta_money", "coparticipacao",
            "tipo_contratante", "cpf_cnpj", "beneficiarios"
        ],
        "Previdência": [
            "nome_fundo", "fundo", "valor_acumulado_money", "regime_tributacao", "regime_contratacao"
        ],
        "Consórcio": [
            "contemplada", "grupo", "cota", "prazo", "indice_correcao", "furo", "objetivo", "estrategia",
            "percentual_reducao_parcela", "tipo_lance", "detalhes_lance", "aporte", "valor_carta_money",
            "parcelas_pagas", "historico_pagamentos", "forma_pagamento", "historico_reajustes", "permitir_lance_fixo",
            "permitir_lance_livre", "permitir_embutido_fixo", "permitir_embutido_livre"
        ],
        "Seguro de Vida": [
            "periodicidade_pagamento", "classe_ajuste", "subcategoria", "beneficiarios", "coberturas"
        ],
        "Seguro Profissional": [
            "possui_franquia", "descricao_franquia", "capital_de_seguro_money"
        ],
        "Seguro Residencial": [
            "capital_de_seguro_money", "cobertura_adicional"
        ],
        "Investimento": [
            "valor_investido_money"
        ]
    };

    const campos = camposPorTipo[apolice.tipo_produto] ?? [];

    return campos.reduce((acc, campo) => {
        if (campo in apolice) {
            acc[campo] = (apolice as any)[campo];
        }
        return acc;
    }, {} as Record<string, any>);
};

// ✅ 🚀 Estruturas Específicas para Cada Tipo de Apólice
export const formattedDataByType = {

    "Plano de Saúde": (data: ApoliceFormData) => ({
        categoria: formatString(data.detalhes.categoria),
        acomodacao: formatString(data.detalhes.acomodacao),
        abrangencia: formatString(data.detalhes.abrangencia),
        valor_reembolso_consulta_money: cleanMoneyValue(data.detalhes.valor_reembolso_consulta_money),
        coparticipacao: !!data.detalhes.coparticipacao,
        tipo_contratante: formatString(data.detalhes.tipo_contratante),
        cpf_cnpj: formatString(data.detalhes.cpf_cnpj),

        // ✅ Agora os beneficiários são stringificados para envio correto no FormData
        beneficiarios: JSON.stringify(data.detalhes.beneficiarios || []),
    }),

    "Previdência": (data: ApoliceFormData) => ({
        nome_fundo: formatString(data.detalhes.nome_fundo),
        fundo: formatString(data.detalhes.fundo),
        valor_acumulado_money: cleanMoneyValue(data.detalhes.valor_acumulado_money),
        regime_tributacao: formatString(data.detalhes.regime_tributacao),
        regime_contratacao: formatString(data.detalhes.regime_contratacao),
    }),

    "Consórcio": (data: ApoliceFormData) => ({
        contemplada: data.detalhes.contemplada || false,
        grupo: formatString(data.detalhes.grupo),
        cota: formatString(data.detalhes.cota),
        prazo: formatNumber(data.detalhes.prazo) || 0,
        indice_correcao: formatString(data.detalhes.indice_correcao),
        furo: formatNumber(data.detalhes.furo) || 0,
        objetivo: formatString(data.detalhes.objetivo),
        estrategia: formatString(data.detalhes.estrategia),
        percentual_reducao_parcela: formatNumber(data.detalhes.percentual_reducao_parcela),
        tipo_lance: formatString(data.detalhes.tipo_lance),
        detalhes_lance: formatString(data.detalhes.detalhes_lance),
        aporte_money: formatNumber(data.detalhes.aporte_money),
        valor_carta_money: cleanMoneyValue(data.detalhes.valor_carta_money || 0),
        parcelas_pagas: formatNumber(data.detalhes.parcelas_pagas),
        historico_pagamentos: data.detalhes.historico_pagamentos ?? {},
        historico_reajustes: data.detalhes.historico_reajustes ?? {},
        permitir_lance_fixo: data.detalhes.permitir_lance_fixo ?? false,
        permitir_lance_livre: data.detalhes.permitir_lance_livre ?? false,
        permitir_embutido_fixo: data.detalhes.permitir_embutido_fixo ?? false,
        permitir_embutido_livre: data.detalhes.permitir_embutido_livre ?? false,
    }),

    "Seguro de Vida": (data: ApoliceFormData) => ({
        premio_pago_money: cleanMoneyValue(data.premio_pago_money),
        subcategoria: formatString(data.detalhes.subcategoria),
        beneficiarios: JSON.stringify(
            (Array.isArray(data.detalhes.beneficiarios) ? data.detalhes.beneficiarios : []).map(
                (beneficiario, index) => ({
                    nome: beneficiario?.nome || "",
                    data_nascimento: beneficiario?.data_nascimento || "",
                    parentesco: beneficiario?.parentesco || "",
                    percentual: formatNumber(data.detalhes.beneficiarios?.[index]?.percentual) || 0,  // ✅ Agora buscamos no índice correto
                })
            )
        ),
        coberturas: JSON.stringify(
            (Array.isArray(data.detalhes.coberturas) ? data.detalhes.coberturas : []).map(
                (cobertura, index) => ({
                    nome_id: cobertura?.nome_id || "",  // ✅ Garante que `nome_id` seja string válida
                    subclasse: cobertura?.subclasse || "",
                    capital_segurado_money: cleanMoneyValue(data.detalhes.coberturas?.[index]?.capital_segurado_money) || 0,  // ✅ Garante que `capital_segurado` seja numérico
                })
            )
        ),
        classe_ajuste: formatString(data.detalhes.classe_ajuste),
    }),

    "Seguro Profissional": (data: ApoliceFormData) => ({
        possui_franquia: !!data.detalhes.possui_franquia,
        descricao_franquia: data.detalhes.descricao_franquia || null,
        capital_de_seguro_money: cleanMoneyValue(data.detalhes.capital_de_seguro_money),
    }),

    "Seguro Residencial": (data: ApoliceFormData) => ({
        capital_de_seguro_money: cleanMoneyValue(data.detalhes.capital_de_seguro_money),
        cobertura_adicional: data.detalhes.cobertura_adicional || null,
    }),

    "Investimento": (data: ApoliceFormData) => ({
        valor_investido_money: cleanMoneyValue(data.detalhes.valor_investido_money)
    }),

    "Seguro Auto": (data: ApoliceFormData) => ({
        marca: formatString(data.detalhes.marca),
        modelo: formatString(data.detalhes.modelo),
        ano_fabricacao: formatNumber(data.detalhes.ano_fabricacao),
        ano_modelo: formatNumber(data.detalhes.ano_modelo),
        placa: formatString(data.detalhes.placa),
        chassi: formatString(data.detalhes.chassi),
        renavam: formatString(data.detalhes.renavam),
        cor: formatString(data.detalhes.cor),
        combustivel: formatString(data.detalhes.combustivel),
        categoria_veiculo: formatString(data.detalhes.categoria_veiculo),
        tipo_cobertura: formatString(data.detalhes.tipo_cobertura),
        valor_veiculo: cleanMoneyValue(data.detalhes.valor_veiculo),
        valor_fipe: cleanMoneyValue(data.detalhes.valor_fipe),
        franquia: formatString(data.detalhes.franquia),
        cep_pernoite: formatString(data.detalhes.cep_pernoite),
        cep_circulacao: formatString(data.detalhes.cep_circulacao),
        // Fazendo parse para boolean:
        possui_garagem: data.detalhes.possui_garagem === true || data.detalhes.possui_garagem === "true",
        possui_rastreador: data.detalhes.possui_rastreador === true || data.detalhes.possui_rastreador === "true",
    }),


};
