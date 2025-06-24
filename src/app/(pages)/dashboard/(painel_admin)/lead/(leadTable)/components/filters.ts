import { Cliente, IndicadoPor } from "@/types/interfaces";

export function getFiltroIndicacao(clientesInput: Cliente[] | { results: Cliente[] }): any[] {
    // Sempre normaliza para array puro!
    const clientes: Cliente[] = Array.isArray(clientesInput)
        ? clientesInput
        : (clientesInput && Array.isArray((clientesInput as any).results))
            ? (clientesInput as any).results
            : [];

    const parceirosUnicos = Array.from(
        new Set(
            clientes
                .map((c: Cliente) => c.indicado_por_detalhes)
                .filter((i: IndicadoPor | undefined | null): i is IndicadoPor =>
                    !!i && i.tipo === "parceiro")
                .map((i: IndicadoPor) => i.nome)
        )
    ).map((nome: string) => ({
        text: `Parceiro: ${nome}`,
        value: `parceiro:${nome}`,
    }));

    const clientesIndicadores = Array.from(
        new Set(
            clientes
                .map((c: Cliente) => c.indicado_por_detalhes)
                .filter((i: IndicadoPor | undefined | null): i is IndicadoPor =>
                    !!i && i.tipo === "cliente")
                .map((i: IndicadoPor) => i.nome)
        )
    ).map((nome: string) => ({
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
