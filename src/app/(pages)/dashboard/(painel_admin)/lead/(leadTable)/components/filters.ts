import { Cliente } from "@/types/interfaces";

export function getFiltroIndicacao(clientes: Cliente[]) {
    const parceirosUnicos = Array.from(
        new Set(
            clientes
                .map((c) => c.indicado_por_detalhes)
                .filter((i): i is NonNullable<Cliente["indicado_por_detalhes"]> => !!i && i.tipo === "parceiro" && typeof i.nome === "string")
                .map((i) => i.nome)
        )
    ).map((nome) => ({
        text: `Parceiro: ${nome}`,
        value: `parceiro:${nome}`,
    }));

    const clientesIndicadores = Array.from(
        new Set(
            clientes
                .map((c) => c.indicado_por_detalhes)
                .filter((i): i is NonNullable<Cliente["indicado_por_detalhes"]> => !!i && i.tipo === "cliente" && typeof i.nome === "string")
                .map((i) => i.nome)
        )
    ).map((nome) => ({
        text: `Cliente: ${nome}`,
        value: `cliente:${nome}`,
    }));

    const filtrosFixos = [
        { text: "Sem Indicação", value: "sem_indicacao" },
        { text: "Indicado por Parceiro", value: "tipo:parceiro" },
        { text: "Indicado por Cliente", value: "tipo:cliente" },
    ];

    return [...filtrosFixos, ...parceirosUnicos, ...clientesIndicadores];
}
