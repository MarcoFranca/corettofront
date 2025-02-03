import { RefObject } from "react";

// ** Lead Interfaces **
export type StatusReuniao =
    | "reuniao_marcada"
    | "retornar"
    | "nao_tem_interesse"
    | "nao_atendeu"
    | "marcar_reuniao";

export interface Oportunidade {
    produto_interesse: string; // ID do produto de interesse
    prioridade: 'alta' | 'media' | 'baixa';
    descricao: string;
    observacoes?: string; // Campo opcional
}

export interface IndicadoPorDetalhes {
    tipo: 'cliente' | 'parceiro';
    id: string;
    nome: string;
    email: string;
}

export interface Relacionamentos {
    contatos_adicionais?: any[];
    parceiros?: any[];
    reunioes?: any[];
    oportunidades?: Oportunidade[];
    saude?: any;
    endereco?: any;
}

export interface Lead {
    id: string;
    nome: string;
    sobre_nome?: string;
    oportunidades?: Oportunidade[];
    contato?: string;
    telefone: string;
    indicacao?:string;
    indicado_por_detalhes?: IndicadoPorDetalhes;
    email: string;
    endereco?: string;
    status: string;
    relacionamentos?: Relacionamentos; // Adicionar relacionamentos aqui
    status_reuniao: StatusReuniao;
    genero?: "M" | "F";
    profissao_id?: string | null;
    parceiros?:string;
    pipeline_stage?: string;
    created_at: string;
    updated_at: string;
}

export interface Profissao {
    id: string;
    nome: string;
    descricao?: string;
    categoria_pai?: string | null;
}


export interface Column {
    id: string;
    title: string;
    leadIds: string[];
}

export interface Data {
    leads: { [key: string]: Lead };
    columns: { [key: string]: Column };
    columnOrder: string[];
}

export interface LeadProps {
    lead: Lead;
    index: number;
    handleLeadClick: (leadId: string) => void;
    handleLeadDragStart: (leadId: string) => void;  // Deve aceitar um argumento
    isLastColumn?: boolean;
    tooltipContainerRef: RefObject<HTMLDivElement>;
}

export interface LeadsState {
    leads: Lead[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

// ** Agenda Interfaces **
export interface AgendaItem {
    id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    due_date?: string;
    cliente?: string | null;
    urgency?: 'Low' | 'Medium' | 'High' | 'Critical';
    type: 'task' | 'meeting';
    completed?: boolean; // Propriedade opcional adicionada
    add_to_google_calendar?: boolean;
    add_to_google_meet?: boolean;
    add_to_zoom?: boolean;
    google_meet_link?: string;
    zoom_meeting_link?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ScheduleMeetingFormProps {
    entityId: string;
    entityName: string;
    entityType: 'lead' | 'cliente';
    onClose: () => void;
}


export interface AgendaState {
    items: AgendaItem[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    googleAuthRedirectUrl: string | null; // Adicione esta propriedade
}

// ** Meeting Interfaces **
export interface Meeting {
    id: string;
    title: string;
    description?: string;
    due_date?: string;
    start_time: string;
    end_time: string;
    cliente?: string | null;
    urgency?: "Low" | "Medium" | "High" | "Critical";
    add_to_google_calendar?: boolean;
    add_to_google_meet?: boolean;
    add_to_zoom?: boolean;
    google_meet_link?: string;
    zoom_meeting_link?: string;
    created_at?: string;
    updated_at?: string;
}

export interface MeetingsState {
    meetings: Meeting[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

export interface Reuniao {
    dataReuniaoAgendada: string;
    horarioInicio: string;
    horarioFim: string;
    assunto: string;
    local: string;
}

// ** Task Interfaces **
export type Urgency = "Low" | "Medium" | "High" | "Critical";

export interface Task {
    id: string;
    title: string;
    description?: string;
    due_date?: string;
    urgency?: Urgency;
    cliente?: string | null;
    add_to_google_calendar?: boolean;
    add_to_google_meet?: boolean;
    add_to_zoom?: boolean;
    created_at?: string;
    updated_at?: string;
    completed: boolean;
}

export interface TasksState {
    tasks: Task[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

// ** Cliente Interfaces **
export interface Profissao {
    id: string;
    nome: string;
    categoria_pai?: string | null;
    descricao?: string;
    subcategorias?: Profissao[];
}

export interface Filho {
    id: string;
    nome: string;
    data_nascimento: string; // 🔥 Agora sempre será string
    idade?: number;
}

export interface Conjuge {
    id: string;
    nome: string;
    data_nascimento?: string;
    profissao?: string;
}

export interface Endereco {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
}

export interface Saude {
    peso?: number;
    altura?: number;
    imc?: number;
    imc_grau?: string;
    tem_doenca_preexistente?: boolean;
    tem_historico_familiar_doencas?: boolean;
    doenca_preexistente?: string;
    historico_familiar_doencas?: string;
}

export interface VidaFinanceira {
    renda_mensal?: number;
    despesas_totais?: number;
    custo_mensal?:number;
    patrimonio?: number;
    nivel_concurso?:string;
    trabalho?:string;
    local_trabalho?:string;
    moradia?:string
    valor_moradia?:number;
    custo_filhos?:number;
    dividas?:number;
    projetos_futuros?:string;
}

export interface Cliente {
    id: string;
    user: string;
    nome: string;
    sobre_nome: string;
    telefone: string;
    email: string;
    cpf?: string;
    identidade?: string;
    data_nascimento?: string;
    genero?: string;
    profissao?: Profissao;
    oportunidades?: Oportunidade[];
    observacoes?: string;
    status_reuniao?: string;
    status:  "lead" | "ativo" | "negociacao" | "nova_negociacao" | "inativo" | "recusado" | "reativacao_pendente" | "cancelado";
    pipeline_stage?: string;
    idade?: string;
    apolices: Apolices;
    apolices_detalhes?: ApolicesDetalhes;
    reunioes?: Reuniao[];
    vida_financeira?: VidaFinanceira;
    filhos: Filho[];
    conjuge?: Conjuge;
    estado_civil?: string;
    created_at?: string;
    updated_at?: string;
    endereco?: Endereco;
    saude?: Saude;
}

export interface ClientesState {
    clientes: Cliente[];
    clienteDetalhe: Cliente | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    statusDetalhe: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    errorDetalhe: string | null;
}


// ** Apólice Interfaces **
export interface Apolice {
    id: string;
    capital_segurado: string;
    beneficiario: string;
    subcategoria: string;
    status_proposta: string;
    numero_apolice: number;
    produto: string;
    seguradora: string;
    data_inicio: string;
    data_vencimento: string;
    premio_pago: string;
    nome_fundo: string;
    valor_investido: string;
    valor_carta: string;
    valor_acumulado: string;
    fundo: string;
    franquia: string;
    capitalSegurado: string;
    periodicidade_pagamento: string;
    forma_pagamento: string;
    observacoes: string;
    arquivo: string;
    categoria: string;
    acomodacao: string;
    abrangencia: string;
    valor_reembolso_consulta: string;
    coparticipacao: boolean;
    regime_contratacao?: string;
    regime_tributacao?: string;
    cliente: string;
    created_at: string;
    updated_at: string;
}

export interface Apolices {
    plano_saude: Apolice[];
    seguro_vida: Apolice[];
    previdencia: Apolice[];
    consorcio: Apolice[];
    investimento: Apolice[];
    seguro_profissional: Apolice[];
    seguro_residencial: Apolice[];
    [key: string]: Apolice[];
}

export interface ApoliceDetalhesSegmento {
    total_apolices: number;
    total_valor: number;
}

export interface ApolicesDetalhes {
    total_apolices: number;
    total_valor_apolices?: number;
    plano_saude: ApoliceDetalhesSegmento;
    seguro_vida: ApoliceDetalhesSegmento;
    previdencia: ApoliceDetalhesSegmento;
    consorcio: ApoliceDetalhesSegmento;
    investimento: ApoliceDetalhesSegmento;
    seguro_profissional: ApoliceDetalhesSegmento;
    seguro_residencial: ApoliceDetalhesSegmento;
}

// ** Auth Interfaces **
export interface User {
    profileImage: string;
    id: number;
    username: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    token: {
        access: string;
        refresh: string;
    } | null;
}

// ** Plano Interfaces **
export interface Plano {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    stripe_price_id: string;
    limite_subusuarios: number;
    limite_armazenamento: number;
}

export interface ColumnProps {
    column: Column; // Use o tipo 'Column' já definido
    leads: { [key: string]: Lead }; // Mapeia os IDs de lead para os objetos Lead
    index: number; // Índice da coluna
    handleLeadClick: (leadId: string) => void; // Função de clique
    handleLeadDragStart: () => void; // Função de início de arraste
    tooltipContainerRef: React.RefObject<HTMLDivElement>; // Referência ao container do tooltip
}
