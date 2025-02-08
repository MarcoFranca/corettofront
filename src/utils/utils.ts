// Formata um número para o formato de moeda BRL
export const formatMoney = (value: number | string): string => {
    // Converte para número se for uma string
    let numberValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;

    // Formata o valor para moeda BRL
    return numberValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

// Remove a formatação de moeda, deixando apenas o número
export const removeMoneyMask = (value: string): string => {
    // Remove tudo que não é dígito ou ponto decimal
    return value.replace(/[^\d.-]/g, '');
};
