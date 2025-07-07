// utils/maskUtils.ts

/**
 * Remove todos os caracteres que não sejam números.
 * Pode ser usado para CPF, RG, telefone ou qualquer campo numérico.
 * @param value - O valor que precisa ser "limpo".
 * @returns Apenas os números da string.
 */
export const removeMask = (value: string): string => {
    return value?.replace(/\D/g, ""); // Remove tudo que não for número
};

/**
 * Retorna a máscara apropriada para o telefone (celular ou fixo).
 * @param telefone - Número de telefone sem máscara.
 * @returns A máscara correta para o telefone.
 */

export const getPhoneMask = (telefone: string): string => {
    const rawValue = removeMask(telefone); // Remove a máscara para calcular o tamanho real
    return rawValue?.length <= 10 ? "(99) 9999-9999" : "(99) 99999-9999";
};

/**
 * Retorna a máscara apropriada para o CPF.
 * @param cpf - Número do CPF sem máscara.
 * @returns A máscara correta para o CPF.
 */
export const getCpfMask = (cpf: string): string => {
    return "999.999.999-99";
};

/**
 * Retorna a máscara apropriada para a Identidade (RG).
 * @param identidade - Número da identidade sem máscara.
 * @returns A máscara correta para a Identidade.
 */


export function formatIdentidade(valor: string, tipo?: string): string {
    if (!valor) return "";

    // Limpa tudo que não é número/letra
    let clean = valor.replace(/[^0-9A-Za-z]/g, "");

    // Aplica as máscaras conhecidas (você pode expandir se quiser)
    switch (tipo) {
        case "RG - SP":
        case "RG - RJ":
        case "RG - Outros":
        case "SSP":
        case "IFP":
            return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");
        case "RG - MG":
            return clean.replace(/^(\d{2})(\d{3})(\d{2})(\d{1})$/, "$1.$2.$3-$4");
        case "RG - PR":
            return clean.replace(/^(\d{2})(\d{3})(\d{3})$/, "$1.$2.$3");
        case "RIC":
        case "CREA":
            return clean.replace(/^(\d{10})(\d{1})$/, "$1-$2");
        case "CNH":
            return clean.replace(/^(\d{11})$/, "$1");
        case "PASSAPORTE":
            return clean; // Pode criar regex, depende do país
        default:
            return valor; // Não mascara se tipo desconhecido
    }
}

export const IDENTITY_MASKS: Record<string, string> = {
    "RG - SP": "99.999.999-9",
    "RG - RJ": "99.999.999-9",
    "RG - MG": "99.999.99-9",
    "RG - PR": "99.999.999",
    "RG - Outros": "99.999.999-9",
    "RIC": "9999999999-9",
    "CNH": "99999999999",
    "CRM": "999999",
    "CRO": "999999",
    "SSP": "99.999.999-9",
    "IFP": "99.999.999-9",
    "Outro": "",
    "CREA": "9999999999-9",
    "OAB": "999999",
    "PASSAPORTE": "AA9999999",
};

export const getIdentityMask = (tipoIdentidade?: string): string => {
    return IDENTITY_MASKS[tipoIdentidade ?? ""] || "";
};

export const identidadeOptions = Object.keys(IDENTITY_MASKS)
    .filter(opt => opt && opt !== "Outro") // Se não quiser o "Outro" no select
    .map(key => ({
        value: key,
        label: key.replace(/_/g, " "),
    }));


/**
 * Remove a máscara e deixa apenas números.
 * Exemplo: R$ 1.234,56 -> "123456"
 */
export const removeMoneyMask = (value: string): string => {
    return value?.replace(/[^\d]/g, "");
};

/**
 * Formata número em moeda brasileira (R$).
 * Exemplo: "123456" -> "R$ 1.234,56"
 */
export const formatMoney = (value: string | number): string => {
    const numericValue = Number(removeMoneyMask(String(value))) / 100;
    return numericValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

/**
 * Máscara para InputMask (moeda brasileira).
 * Usa máscara dinâmica para valores pequenos e grandes.
 */
export const getMoneyMask = (): string => {
    return "999999999,99"; // ✅ Permite até 9 dígitos antes da vírgula
};

export const formatCPFOrCNPJ = (value: string | null): string => {
    if (!value) return "N/A";

    // Remove caracteres não numéricos
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length === 11) {
        // Formata como CPF (000.000.000-00)
        return cleanValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    } else if (cleanValue.length === 14) {
        // Formata como CNPJ (00.000.000/0000-00)
        return cleanValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }

    return value; // Retorna como está caso não seja CPF nem CNPJ válido
};

export const formatCurrency = (value: string | number): string => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    }).format(Number(value) || 0);
};

export const formatBRLCurrency = (value: number | undefined | null) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    }).format(value ?? 0);


export function formatPhoneNumber(telefone?: string | null): string {
    if (!telefone) return "";  // <- Protege contra undefined/null

    const rawPhone = removeMask(telefone) || "";

    if (rawPhone.length === 10) {
        // Telefone fixo (XX) XXXX-XXXX
        return rawPhone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    } else if (rawPhone.length === 11) {
        // Celular (XX) 9XXXX-XXXX
        return rawPhone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }
    // Se não encaixa nos padrões, retorna o valor sem máscara
    return telefone;
}
