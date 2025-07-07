import {Cliente} from "@/types/interfaces";
import {removeMask} from "@/utils/maskUtils";

export function buildSafePayload(data: any, cliente: Cliente) {
    const payload: any = {
        nome: data.nome || cliente.nome,
        genero: data.genero || cliente.genero,
    };

    Object.entries(data).forEach(([key, value]) => {
        // Envie se preenchido (inclusive se valor for 0 ou false)
        if (
            value !== undefined &&
            value !== null &&
            !(typeof value === "string" && value.trim() === "")
        ) {
            payload[key] = value;
        }
    });

    // Telefone
    if (removeMask(data.telefone)) payload.telefone = removeMask(data.telefone);

    // E-mail
    if (data.email && data.email !== "nan" && data.email.includes("@")) payload.email = data.email;

    // Estado civil
    if (data.estado_civil && data.estado_civil !== "nan") payload.estado_civil = data.estado_civil;

    // Foto (ver nota acima, precisa implementar upload real)
    if (data.foto) payload.foto = data.foto;

    // Documentos
    if (removeMask(data.cpf)) payload.cpf = removeMask(data.cpf);
    if (removeMask(data.identidade)) {
        payload.identidade = removeMask(data.identidade);
        payload.tipo_identidade = data.tipo_identidade;
    }

    // Outros campos
    if (data.sobre_nome) payload.sobre_nome = data.sobre_nome;
    if (data.data_nascimento) payload.data_nascimento = data.data_nascimento;
    if (data.nome_mae) payload.nome_mae = data.nome_mae;

    // Endereço
    if (
        data.logradouro ||
        data.numero ||
        data.bairro ||
        data.cidade ||
        data.uf ||
        data.cep
    ) {
        payload.endereco = {
            logradouro: data.logradouro,
            numero: data.numero,
            complemento: data.complemento,
            bairro: data.bairro,
            cidade: data.cidade,
            uf: data.uf,
            cep: data.cep,
        };
    }

    // VIP
    payload.is_vip = !!data.is_vip;

    return payload;
}