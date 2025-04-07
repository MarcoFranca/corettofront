import React, { RefObject } from "react";
import {ApoliceDetalhada} from "@/types/ApolicesInterface";
import {Reuniao} from "@/types/AgendaInterfaces";

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

export interface IndicadoPor {
    tipo: 'cliente' | 'parceiro';
    nome: string;
    id: string;
}

export interface Relacionamentos {
    contatos_adicionais?: ContatoAdicional[];
    negociacoes?: NegociacaoCliente[];
    parceiros?: any[];
    reunioes?: any[];
    oportunidades?: Oportunidade[];
    saude?: Saude;
    endereco?: any;
}


export interface Profissao {
    id: string;
    nome: string;
    descricao?: string;
    categoria_pai?: string | null;
    categoria_pai_nome?: string | null;
}


export interface Column {
    id: string;
    title: string;
    leadIds: string[];
}

export interface Data {
    leads: { [key: string]: Cliente };
    columns: { [key: string]: Column };
    columnOrder: string[];
}

export interface LeadProps {
    lead: Cliente;
    index: number;
    handleLeadClick: (leadId: string) => void;
    handleLeadDragStart: (leadId: string) => void;  // Deve aceitar um argumento
    isLastColumn?: boolean;
    tooltipContainerRef: RefObject<HTMLDivElement>;
}

export interface LeadsState {
    leads: Cliente[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

export interface LeadModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

export interface ProfissaoOption {
    value: string;
    label: string;
}

export interface ProdutoOption {
    value: string;
    label: string;
}

export interface OptionType {
    value: string;
    label: string;
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
export interface ContatoAdicional {
    id: string;  // O ID pode ser opcional ao cadastrar um novo contato
    tipo: string; // Tipo do contato (ex: "Telefone Secundário", "E-mail Alternativo", etc.)
    valor: string; // O número de telefone ou e-mail adicional
}

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
    id: any;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
}

export interface EnderecoCadastro {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
}

export interface Saude {
    id: string;
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

export interface NegociacaoCliente {
    id: string;
    titulo: string;
    status: string;
    interesse: string;
    encerrada: boolean;
    observacoes: string[];
    reunioes: { start_time: string }[];
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
    tipo_identidade?:string;
    data_nascimento?: string;
    genero?: string;
    profissao?: Profissao;
    profissao_id?: string | null;
    oportunidades?: Oportunidade[];
    observacoes?: string;
    status_reuniao?: string;
    status: "lead" | "ativo" | "negociacao" | "nova_negociacao" | "inativo" | "recusado" | "reativacao_pendente" | "cancelado";
    negociacoes?: NegociacaoCliente[];
    possui_apolice_ativa?: boolean;
    pipeline_stage?: string;
    idade?: string;
    apolices?: ApoliceDetalhada[];
    apolices_detalhes?: ApolicesDetalhes;
    total_apolices?: number;
    reunioes?: Reuniao[];
    vida_financeira?: VidaFinanceira;
    filhos: Filho[];
    conjuge?: Conjuge;
    contatos_adicionais?: ContatoAdicional[];
    estado_civil?: string;
    endereco?: Endereco;
    relacionamentos?: Relacionamentos; // ✅ Garantindo o tipo correto
    indicado_por_detalhes?: IndicadoPor;
    indicado_por_cliente_id?: string; // <- Adicione esta linha se não existir
    indicado_por_parceiros_ids?: string[]; // <- Adicione esta linha se não exist
    created_at?: string;
    updated_at?: string;
}


export interface ClientesState {
    clientes: Cliente[];
    clienteDetalhe: Cliente | null;
    totalClientes: number;
    status: "idle" | "loading" | "succeeded" | "failed";
    statusDetalhe: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    errorDetalhe: string | null;
}

export interface EditClientModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    initialData: {
        email: string;
        telefone: string;
        contatos_adicionais: ContatoAdicional[];
    };
    onSave: (data: any) => void;
}

export interface EditAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    cliente: Cliente;
    onSave: (data: any) => void;
    initialData: EnderecoCadastro;
}

export interface EditPersonalInfoModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    initialData: {
        data_nascimento?: string;
        genero?: string;
        profissao?: Profissao;
    };
    onSave: (data: any) => void;
}

export const genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
];

export interface Stats {
    total_apolices: number;
    valor_total: number;
    media_valor: number;
    revisoes_este_mes: number;
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
    planos_saude_apolices?: any[];  // 🛠 Adicionando os novos relacionamentos
    seguros_vida_apolices?: any[];
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
    leads: { [key: string]: Cliente }; // Mapeia os IDs de lead para os objetos Lead
    index: number; // Índice da coluna
    handleLeadClick: (leadId: string) => void; // Função de clique
    handleLeadDragStart: () => void; // Função de início de arraste
    tooltipContainerRef: React.RefObject<HTMLDivElement>; // Referência ao container do tooltip
}
