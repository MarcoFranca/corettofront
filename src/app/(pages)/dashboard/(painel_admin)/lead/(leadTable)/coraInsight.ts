import { Cliente, NegociacaoCliente } from "@/types/interfaces";
import { ApoliceDetalhada } from "@/types/ApolicesInterface";  // 👈 Aqui!
import { Reuniao } from "@/types/AgendaInterfaces";

// Função para montar o contexto completo do cliente para pedir insights à IA
export function montarContextoCliente(
    cliente: Cliente,
    negociacoes: NegociacaoCliente[] = [],
    apolices: ApoliceDetalhada[] = [],
    reunioes: Reuniao[] = [],
    descricao: string = ""
) {
    return `
**Dados do Cliente:**
- Nome: ${cliente.nome} ${cliente.sobre_nome || ""}
- Gênero: ${cliente.genero || ""}
- Profissão: ${cliente.profissao?.nome || ""}
- Idade: ${cliente.idade || ""}
- Estado civil: ${cliente.estado_civil || ""}
- Telefone: ${cliente.telefone || ""}
- E-mail: ${cliente.email || ""}
- Observações: ${cliente.observacoes || ""}
- Oportunidades: ${(cliente.oportunidades || []).map(o =>
        `Produto: ${o.produto_interesse}, Prioridade: ${o.prioridade}, Descrição: ${o.descricao || ""}`
    ).join(" | ") || "Nenhuma"}

**Negociações:**
${(negociacoes || []).map(n =>
        `- Título: ${n.titulo || ""}, Status: ${n.status || ""}, Interesse: ${n.interesse || ""}, Encerrada: ${n.encerrada ? "Sim" : "Não"}`
    ).join("\n") || "Nenhuma"}

**Apólices:**
${(apolices || []).map(a =>
        `- Tipo: ${a.tipo_produto || ""}, Status: ${a.status || ""}, Administradora: ${a.administradora_nome || a.administradora || ""}, Valor Segurado: ${(a as any).valor_segurado || ""}, Início: ${a.data_inicio || ""}, Vencimento: ${a.data_vencimento || ""}`
    ).join("\n") || "Nenhuma"}

**Reuniões:**
${(reunioes || []).map(r =>
        `- Data: ${r.dataReuniaoAgendada || ""}, Assunto: ${r.assunto || ""}, Local: ${r.local || ""}`
    ).join("\n") || "Nenhuma"}

**Descrição adicional do corretor:**  
${descricao}
    `.trim();
}
