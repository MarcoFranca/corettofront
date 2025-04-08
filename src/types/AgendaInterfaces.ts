// ** Agenda Interfaces **
// export interface AgendaItem {
//     id: string;
//     title: string;
//     description?: string;
//     start_time: string;
//     end_time: string;
//     due_date?: string;
//     cliente?: string | null;
//     urgency?: 'Low' | 'Medium' | 'High' | 'Critical';
//     type: 'task' | 'meeting';
//     completed?: boolean; // Propriedade opcional adicionada
//     add_to_google_calendar?: boolean;
//     add_to_google_meet?: boolean;
//     add_to_zoom?: boolean;
//     negociacao?: string;
//     google_meet_link?: string;
//     zoom_meeting_link?: string;
//     status_reuniao?:string;
//     motivo_cancelamento?:string;
//     created_at?: string;
//     updated_at?: string;
// }

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
    type: 'task' | 'meeting';
    completed?: boolean;
    add_to_zoom?: boolean;
    google_meet_link?: string;
    zoom_meeting_link?: string;
    status_reuniao?:string;
    motivo_cancelamento?:string;
    historico_remarcacoes?: string;
    negociacao?: string | { id: string };
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

export interface ScheduleMeetingFormProps {
    entityId: string;
    entityName: string;
    entityType: 'lead' | 'cliente' | 'negociacao';
    onClose: () => void;
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
    start_time?: string;
    end_time?: string;
    add_to_google_calendar?: boolean;
    add_to_google_meet?: boolean;
    add_to_zoom?: boolean;
    created_at?: string;
    updated_at?: string;
    completed: boolean;
}

type AgendaItem = Meeting | Task;


export interface TasksState {
    tasks: Task[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

export interface AgendaState {
    items: AgendaItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    googleAuthRedirectUrl: string | null;
}

export function isTask(item: any): item is Task {
    return item?.type === 'task' && 'due_date' in item && 'urgency' in item;
}
