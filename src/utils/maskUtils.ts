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
export const getIdentityMask = (identidade: string): string => {
    return "99.999.999-*";
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