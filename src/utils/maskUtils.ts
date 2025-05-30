// utils/phoneUtils.ts

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

export const getIdentityMask = (tipoIdentidade?: string): string => {
    switch (tipoIdentidade) {
        case "RG - SP":
            return "99.999.999-9"; // 9 dígitos com dígito verificador
        case "RG - RJ":
            return "99.999.999-9"; // 8 a 9 dígitos com verificador
        case "RG - MG":
            return "99.999.99-9"; // idem
        case "RG - PR":
            return "99.999.999"; // 8 dígitos sem verificador
        case "RG - Outros":
            return "99.999.999-9"; // formato genérico
        case "RIC":
            return "9999999999-9"; // 10+1 dígitos (novo RG nacional)
        case "CNH":
            return "99999999999"; // 11 dígitos
        case "CRM":
        case "CRO":
            return "999999"; // 6 dígitos comuns
        case "SSP":
        case "IFP":
            return "99.999.999-9"; // mesmo formato que RG
        case "Outro":
            return ""; // sem máscara
        default:
            return ""; // fallback
    }
};

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
