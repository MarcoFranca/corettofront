import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDateBR = (date: string | null): string => {
    if (!date) return "N/A"; // ✅ Retorna "N/A" se a data for inválida
    try {
        return format(parseISO(date), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
        return "N/A"; // ✅ Evita que um erro quebre a aplicação
    }
};

export const formatDateRelative = (date: string | null): string => {
    if (!date) return "N/A"; // ✅ Se a data for inválida, retorna "N/A"
    try {
        return formatDistanceToNow(parseISO(date), { locale: ptBR, addSuffix: true });
    } catch (error) {
        return "N/A"; // ✅ Retorna "N/A" se houver erro ao formatar
    }
};
