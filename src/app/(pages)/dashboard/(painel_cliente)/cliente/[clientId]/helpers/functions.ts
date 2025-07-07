import {Cliente} from "@/types/interfaces";
import React from "react";

export const getTotalApolices = (cliente: Cliente) => cliente.apolices?.length || 0;
export const getTotalApolicesValor = (cliente: Cliente) =>
    cliente.apolices_detalhes?.total_valor_apolices
        ? `R$ ${cliente.apolices_detalhes.total_valor_apolices.toLocaleString("pt-BR")}`
        : "R$ 0,00";
// Helper universal para extrair próxima reunião
export function getProximaReuniao(cliente: Cliente) {
    // 1. Prioriza o campo proxima_reuniao do backend, se existir
    if (cliente.proxima_reuniao) {
        return {
            data: cliente.proxima_reuniao,
            label: cliente.status_reuniao ?? '',
            local: '',
        };
    }

    // 2. Fallback para a lista, cobrindo diferentes possíveis nomes de campo:
    if (cliente.reunioes && cliente.reunioes.length > 0) {
        const future = cliente.reunioes
            .map(r => ({
                ...r,
                // Prioriza start_time, depois data, depois dataReuniaoAgendada
                dataReuniao: (r as any).start_time || (r as any).data || (r as any).dataReuniaoAgendada
            }))
            .filter(r => r.dataReuniao && new Date(r.dataReuniao) > new Date());

        if (future.length > 0) {
            const maisProxima = future.sort(
                (a, b) =>
                    new Date(a.dataReuniao).getTime() - new Date(b.dataReuniao).getTime()
            )[0];
            return {
                data: maisProxima.dataReuniao,
                label: (maisProxima as any).title || (maisProxima as any).assunto || "",
                local: (maisProxima as any).local || "",
            };
        }
    }
    // 3. Caso nada encontrado
    return null;
}



