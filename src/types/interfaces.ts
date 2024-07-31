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
export interface Cliente {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface ClientesState {
    clientes: Cliente[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}


// Auth Interfaces
export interface User {
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
}

export interface TasksState {
    tasks: Task[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface Meeting {
    id: string;
    cliente: string;
    descricao: string;
    data_reuniao_agendada: string;
    horario_inicio: string;
    horario_fim: string;
    add_to_google_calendar: boolean;
    add_to_google_meet: boolean;
    add_to_zoom: boolean;
    created_at: string;
    updated_at: string;
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
    start_time: string;
    end_time: string;
    cliente: string;
    is_meeting: boolean;
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
    cliente: string;
    is_meeting: boolean;
}

export interface AgendaState {
    items: AgendaItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

