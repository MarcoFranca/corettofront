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
    negociacao?: string | { id: string }; // 👈 aqui o pulo do gato
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