export const STATUS_OPTIONS = [
    { value: "lead", label: "Lead", color: "#FFA500", description: "Cliente potencial que ainda não fechou negócio." },
    { value: "negociacao", label: "Em Negociação", color: "#1E90FF", description: "Cliente em contato e negociação ativa." },
    { value: "ativo", label: "Cliente Ativo", color: "#32CD32", description: "Cliente que possui um serviço ativo." },
    { value: "nova_negociacao", label: "Nova Negociação", color: "#4682B4", description: "Cliente ativo, mas negociando novos produtos." },
    { value: "inativo", label: "Cliente Inativo", color: "#FF4500", description: "Cliente que já teve um serviço, mas não está mais ativo." },
    { value: "recusado", label: "Recusado", color: "#A52A2A", description: "Cliente recusou a oferta após a negociação." },
    { value: "reativacao_pendente", label: "Reativação Pendente", color: "#FFD700", description: "Cliente inativo com possibilidade de retorno." },
    { value: "cancelado", label: "Cancelado", color: "#8B0000", description: "Cliente que cancelou os serviços recentemente." },
];

// Criamos um dicionário de status para acesso rápido pelo código do status
export const STATUS_CHOICES = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status.value] =
        { label: status.label,
            color: status.color,
            description: status.description,
        };
    return acc;
}, {} as Record<string, { label: string; color: string; description: string }>);
