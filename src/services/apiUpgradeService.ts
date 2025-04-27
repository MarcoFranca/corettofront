// src/services/apiUpgradeService.ts
import api from "@/app/api/axios";

export async function simularUpgrade(novoPlanoId: string, codigoCupom?: string) {
    const response = await api.post('/pagamentos/simular-upgrade/', {
        novo_plano_id: novoPlanoId,
        codigo_cupom: codigoCupom || undefined,
    });
    return response.data;
}

export async function aplicarCupom(codigoCupom: string) {
    const response = await api.post('/pagamentos/aplicar-cupom/', {
        codigo_cupom: codigoCupom,
    });
    return response.data;
}
