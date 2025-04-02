import {removeMask} from "@/utils/maskUtils";

export   const getWhatsAppLink = (phone: string): string => {
    const formattedPhone = removeMask(phone);
    return `https://wa.me/55${formattedPhone}`;
};

// utils/functions.ts
export const getIdentityPlaceholder = (tipoIdentidade?: string) => {
    if (!tipoIdentidade) return "Digite o número do documento";

    const placeholderByTipo: Record<string, string> = {
        "RG - SP": "Ex: 12.345.678-9",
        "RG - RJ": "Ex: 12.345.678-9",
        "RG - MG": "Ex: 12.345.67-9",
        "RG - PR": "Ex: 12.345.678",
        "RG - Outros": "Ex: 12.345.678-9",
        "RIC": "Ex: 1234567890-1",
        CRM: "Ex: 123456",
        CRO: "Ex: 123456",
        CNH: "Ex: 12345678901",
        IFP: "Ex: 12.345.678-9",
        SSP: "Ex: 12.345.678-9",
        Outro: "Digite o número do documento",
    };

    return placeholderByTipo[tipoIdentidade] || "Digite o número do documento";
};

