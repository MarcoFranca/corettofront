import {removeMask} from "@/utils/maskUtils";

export   const getWhatsAppLink = (phone: string): string => {
    const formattedPhone = removeMask(phone);
    return `https://wa.me/55${formattedPhone}`;
};