import { RefObject } from "react";

// Lead Interfaces
export type StatusReuniao = 'reuniao_marcada' | 'retornar' | 'nao_tem_interesse' | 'nao_atendeu' | 'marcar_reuniao';

export interface Lead {
    id: string;
    nome: string;
    contato?: string;
    telefone: string;
    email: string;
    endereco?: string;
    status: string;
    status_reuniao: StatusReuniao;
    pipeline_stage?: string;
    created_at: string;
    updated_at: string;
}

export interface Reuniao {
    dataReuniaoAgendada: string;
    horarioInicio: string;
    horarioFim: string;
    assunto: string;
    local: string;
}

export interface AgendaItem {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    cliente: string | null;
    type: 'task' | 'meeting'; // Altere de entry_type para type
    completed: boolean;
    urgency?: 'Low' | 'Medium' | 'High' | 'Critical';
    add_to_google_calendar?: boolean;
    add_to_google_meet?: boolean;
    add_to_zoom?: boolean;
    google_meet_link?: string;
    zoom_meeting_link?: string;
    created_at?: string;
    updated_at?: string;
}


export interface Data {
    leads: { [key: string]: Lead };
    columns: { [key: string]: Column };
    columnOrder: string[];
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
    handleLeadDragStart: () => void;
    isLastColumn?: boolean;
    tooltipContainerRef: RefObject<HTMLDivElement>;
}

//clients
export interface Apolice {
    capital_segurado: string;
    beneficiario: string;
    subcategoria: string;
    status_proposta: string;
    id: string;
    numero_apolice: number;
    produto: string;
    seguradora: string;
    data_inicio: string;
    data_vencimento: string;
    premio_pago: string;
    nome_fundo:string;
    valor_investido:string;
    valor_carta:string;
    valor_acumulado:string;
    fundo:string;
    franquia:string;
    capitalSegurado:string;
    periodicidade_pagamento: string;
    forma_pagamento: string;
    observacoes: string;
    arquivo: string;
    created_at: string;
    updated_at: string;
    categoria: string;
    acomodacao: string;
    abrangencia: string;
    valor_reembolso_consulta: string;
    coparticipacao: boolean;
    regime_contratacao?: string;
    regime_tributacao?: string;
    cliente: string;
}

export interface Apolices {
    plano_saude: Apolice[];
    seguro_vida: Apolice[];
    previdencia: Apolice[];
    consorcio: Apolice[];
    investimento: Apolice[];
    seguro_profissional: Apolice[];
    seguro_residencial: Apolice[];
    [key: string]: Apolice[];  // Adicione esta linha para permitir chaves dinâmicas
}

export interface Profile {
    nome: string;
    sobrenome: string;
    foto: string | File;  // Permitir que foto seja uma string ou um arquivo
    telefone: string;
    isAccountActive: boolean;
}


export interface ApoliceDetalhesSegmento {
    total_apolices: number;
    total_valor: number;
}

export interface ApolicesDetalhes {
    total_apolices: number;
    total_valor_apolices?: number;  // Adicionando a propriedade opcional total_valor_apolices
    plano_saude: ApoliceDetalhesSegmento;
    seguro_vida: ApoliceDetalhesSegmento;
    previdencia: ApoliceDetalhesSegmento;
    consorcio: ApoliceDetalhesSegmento;
    investimento: ApoliceDetalhesSegmento;
    seguro_profissional: ApoliceDetalhesSegmento;
    seguro_residencial: ApoliceDetalhesSegmento;
}

export interface Filho {
    nome: string;
    dataNascimento: string;
}

export interface Cliente {
    reunioes?: Reuniao[];
    vida_financeira: any;
    filhos: Filho[];
    conjuge: any;
    estado_civil: string;
    id: string;
    user: string;
    nome: string;
    sobre_nome: string;
    cpf?: string;
    identidade?: string;
    telefone: string;
    email: string;
    data_nascimento?: string;
    sexo?: string;
    profissao?: string;
    observacoes?: string;
    status_reuniao?: string;
    status?: string;
    pipeline_stage?: string;
    created_at?: string;
    updated_at?: string;
    idade?: string;
    apolices: Apolices;
    apolices_detalhes?: ApolicesDetalhes;
    endereco?: {
        logradouro?: string;
        numero?: string;
        complemento?: string;
        bairro?: string;
        cidade?: string;
        uf?: string;
        cep?: string;
    };
    saude?: {
        peso?: number;
        altura?: number;
        imc?: number;
        imc_grau?:string;
        tem_doenca_preexistente?:boolean;
        tem_historico_familiar_doencas?:boolean;
        doenca_preexistente?: string;
        historico_familiar_doencas?: string;
    };
}

export interface ClientesState {
    clientes: Cliente[];
    clienteDetalhe: Cliente | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    statusDetalhe: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    errorDetalhe: string | null;
}


// Auth Interfaces
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

// Leads State Interface
export interface LeadsState {
    leads: Lead[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface ColumnProps {
    column: Column;
    leads: { [key: string]: Lead };
    index: number;
    handleLeadClick: (leadId: string) => void;
    handleLeadDragStart: () => void;
    tooltipContainerRef: RefObject<HTMLDivElement>;
}

// Task Interfaces
export type Urgency = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
    id: string;
    title: string;
    description?: string;
    due_date?: string;
    urgency: Urgency;
    cliente?: string;
    reuniao?: string;
    created_at: string;
    updated_at: string;
    completed: boolean | undefined;
    add_to_google_calendar?: boolean;
    add_to_google_meet?: boolean;
    add_to_zoom?: boolean;
}

export interface TasksState {
    tasks: Task[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}


export interface MeetingsState {
    meetings: Meeting[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

//meeting inteface

export interface Meeting {
    id: string;
    title: string;
    description: string;
    due_date: string;
    start_time: string;
    end_time: string;
    cliente: string;
    is_meeting: boolean;
    entry_type: string;
    completed: boolean;
    urgency: string;
    data_reuniao_agendada?: string;
    horario_inicio?: string;
    horario_fim?: string;
    add_to_google_calendar?: boolean;
    add_to_google_meet?: boolean;
    add_to_zoom?: boolean;
    descricao?: string;
    created_at?: string;
    updated_at?: string;
}


export interface MeetingsState {
    meetings: Meeting[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface AgendaItem {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    cliente: string | null;
    is_meeting: boolean;
}

export interface AgendaState {
    items: AgendaItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface Plano {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    stripe_price_id: string;
    limite_subusuarios: number; // Adicionando a propriedade
    limite_armazenamento: number; // Adicionando a propriedade
}

