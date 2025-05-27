import { Meeting } from "@/types/AgendaInterfaces";
import api from "@/app/api/axios";
import { toastSuccess, toastError } from "@/utils/toastWithSound";

export function getStartTime(reuniao: any): string | undefined {
    return reuniao?.start_time || reuniao?.horarioInicio;
}
export function getStatusReuniao(reuniao: any): string | undefined {
    return reuniao?.status_reuniao || reuniao?.status;
}

const statusAtivos = ["agendada", "confirmada", "remarcada"]; // Status de reunião "ativa", ajuste conforme seu sistema

export function getNextMeeting(reunioes: any[]) {
    if (!reunioes || reunioes.length === 0) return null;
    const now = new Date();

    // Filtra reuniões que ainda são ativas
    const ativas = reunioes.filter(r => {
        const status = r.status_reuniao || r.status;
        const start = r.start_time || r.horarioInicio;
        return (
            statusAtivos.includes(status) &&
            start && new Date(start) >= now
        );
    });

    // Ordena e pega a próxima futura (inclusive remarcada)
    if (ativas.length) {
        return ativas.sort((a, b) =>
            new Date(a.start_time || a.horarioInicio).getTime() -
            new Date(b.start_time || b.horarioInicio).getTime()
        )[0];
    }

    // Se não houver futuras, pega a última que passou (mais recente)
    const passadas = reunioes
        .filter(r => {
            const status = r.status_reuniao || r.status;
            const start = r.start_time || r.horarioInicio;
            return (
                statusAtivos.includes(status) &&
                start && new Date(start) < now
            );
        })
        .sort((a, b) =>
            new Date(b.start_time || b.horarioInicio).getTime() -
            new Date(a.start_time || a.horarioInicio).getTime()
        );

    return passadas[0] || null;
}


export async function atualizarReuniaoRapida(id: string, status: string) {
    try {
        await api.patch(`/agenda/${id}/`, { status_reuniao: status });
        toastSuccess("Status da reunião atualizado!");
        // Aqui você pode disparar um dispatch para refetch caso precise
    } catch {
        toastError("Erro ao atualizar status da reunião.");
    }
}
