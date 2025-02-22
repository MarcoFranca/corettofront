// 📂 components/ui/select/selectUtils.ts
import api from "@/app/api/axios";
import { toast } from "react-toastify";
import {LoadOptions} from "react-select-async-paginate";

export interface Option {
    value: string;
    label: string;
    email?: string;
}

export interface Profissao {
    id: string;
    nome: string;
    subcategorias?: Profissao[];
}

/**
 * Carrega e organiza profissões com subcategorias para o Select.
 */
export const fetchProfissoesOrganizadas = async (): Promise<{ label: string; options: Option[] }[]> => {
    try {
        const response = await api.get("/profissoes/");
        const dadosProfissoes: Profissao[] = response.data;

        return dadosProfissoes.map((profissao) => ({
            label: profissao.nome, // Grupo principal
            options: [
                { value: profissao.id, label: `🔹 ${profissao.nome}` }, // Principal
                ...(profissao.subcategorias ?? []).map((sub) => ({
                    value: sub.id,
                    label: `↳ ${sub.nome}`, // Indica subnível
                })),
            ],
        }));
    } catch (error) {
        toast.error("Erro ao carregar profissões.");
        console.error("Erro ao buscar profissões:", error);
        return [];
    }
};

// ✅ Ajuste a função para retornar `Promise<any>`
export const loadAdministradoraOptions = async (produto: string) => {
    try {
        let url = "/administradoras/";
        if (produto) {
            url = `/administradoras/?produto=${produto}`;
        }

        const response = await api.get(url);
        console.log("🎯 Administradoras carregadas do backend:", response.data); // 🔥 Debug

        const options = response.data.map((admin: { id: number | string; nome: string }) => ({
            value: String(admin.id),  // 🔥 Garante que `value` seja sempre um `string`
            label: admin.nome,        // 🔥 Garante que `label` seja sempre um `string`
        }));

        console.log("🛠️ Administradoras convertidas para options:", options); // 🔥 Debug
        return { options, hasMore: false };
    } catch (error) {
        console.error("❌ Erro ao carregar administradoras:", error);
        return { options: [], hasMore: false };
    }
};



/**
 * Busca clientes com paginação para o `AsyncPaginate`.
 */
export const loadClienteOptions: LoadOptions<Option, never, { page: number }> = async (
    searchQuery = "",
    loadedOptions: readonly Option[], // 🔥 Agora é readonly conforme esperado
    additional = { page: 1 }
) => {
    const { page } = additional;

    try {
        const response = await api.get(`/clientes/?search=${searchQuery}&page=${page}&limit=50`);
        console.log(response.data.results)
        return {
            options: response.data.results.map((cliente: any) => ({
                value: cliente.id,
                label: `${cliente.nome} ${cliente.sobre_nome || ""}`,
            })),
            hasMore: !!response.data.next, // 🔥 Habilita carregamento contínuo
            additional: { page: page + 1 },
        };
    } catch (error) {
        toast.error("Erro ao carregar clientes.");
        return { options: [], hasMore: false };
    }
};

/**
 * Busca clientes ou parceiros com paginação para o `AsyncPaginate`.
 */
export const loadIndicadoOptions = async (
    tipo: "clientes" | "parceiros",
    searchQuery: string = "", // 🔥 Garante que `searchQuery` sempre seja string
    additional: { page: number } = { page: 1 }
): Promise<{ options: Option[]; hasMore: boolean; additional: { page: number } }> => {
    const { page } = additional;
    const endpoint = tipo === "clientes" ? "/clientes/" : "/parceiros/";

    try {
        const response = await api.get(`${endpoint}?search=${searchQuery}&page=${page}&limit=100`);

        const options: Option[] = response.data.results.map((item: any) => ({
            value: item.id,
            label: item.nome + (tipo === "clientes" ? ` ${item.sobrenome || ""}` : ""),
        }));

        return {
            options,
            hasMore: !!response.data.next,
            additional: { page: page + 1 },
        };
    } catch (error) {
        toast.error(`Erro ao carregar ${tipo}.`);
        return { options: [], hasMore: false, additional: { page } };
    }
};


export const loadParceiroOptions = async (
    searchQuery = "",
    loadedOptions = [],
    additional = { page: 1 }
): Promise<{ options: Option[]; hasMore: boolean }> => {
    try {
        const response = await api.get("/parceiros/?search=" + searchQuery);
        const parceiros = response.data;

        return {
            options: parceiros.map((parceiro: any) => ({
                value: parceiro.id,           // ID técnico
                label: parceiro.nome,         // Nome amigável
            })),
            hasMore: false,
        };
    } catch (error) {
        toast.error("Erro ao carregar parceiros.");
        return { options: [], hasMore: false };
    }
};

