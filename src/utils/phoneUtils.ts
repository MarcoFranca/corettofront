// utils/phoneUtils.ts

/**
 * Remove todos os caracteres que não sejam números.
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

