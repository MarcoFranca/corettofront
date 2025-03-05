// 📂 components/ui/select/selectUtils.ts
import api from "@/app/api/axios"; // 🔥 Certifique-se de importar a API configurada com axios

export interface Option {
    value: string;
    label: string;
}

export const fetchCoberturas = async (): Promise<Option[]> => {
    try {
        const response = await api.get("/coberturas/nome/"); // ✅ Endpoint do backend
        return response.data.map((cobertura: { id: string; nome: string }) => ({
            value: cobertura.id,
            label: cobertura.nome,
        }));
    } catch (error) {
        console.error("❌ Erro ao buscar coberturas:", error);
        return [];
    }
};
