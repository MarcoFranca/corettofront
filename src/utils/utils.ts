export const formatPhoneNumber = (phoneNumber: string): string => {
    const match = phoneNumber.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
};

export const formatCPF = (cpf: string): string => {
    const match = cpf.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
        return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cpf;
};

export const applyCPFMask = (cpf: string): string => {
    return cpf
        .replace(/\D/g, '') // Remove todos os caracteres não numéricos
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona um ponto após os primeiros três dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona um ponto após os três dígitos seguintes
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona um hífen antes dos dois últimos dígitos
};

// Remove a máscara do CPF (deixa apenas os dígitos)
export const removeCPFMask = (value: string): string => {
    return value.replace(/\D/g, ''); // Remove tudo que não é dígito
};

export const formatIdentity = (identity: string): string => {
    return identity
        .replace(/\D/g, '') // Remove todos os caracteres não numéricos
        .replace(/(\d{2})(\d)/, '$1.$2') // Adiciona um ponto após os primeiros dois dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona um ponto após os três dígitos seguintes
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona um hífen antes dos dois últimos dígitos
};

export const removeIdentityMask = (value: string): string => {
    return value.replace(/\D/g, ''); // Remove tudo que não é dígito
};
