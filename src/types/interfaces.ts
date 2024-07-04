// Interface for Lead
export interface Lead {
    id?: string;
    nome: string;
    contato: string;
    telefone: string;
    email: string;
    endereco: string;
    status: string;
    pipeline_stage?: string;
}

// Interface for Auth State
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

// Interface for Leads State
export interface LeadsState {
    leads: Lead[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
