// utils/meetingHelpers.ts
import { Cliente, NegociacaoCliente } from '@/types/interfaces';
import { Meeting } from '@/types/AgendaInterfaces';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    WarningOutlined,
    SyncOutlined,
    CalendarOutlined,
} from '@ant-design/icons';

export const statusMap: Record<string, { label: string; color: string; icon: JSX.Element }> = {
    agendada: {
        label: 'Agendada',
        color: 'blue',
        icon: <CalendarOutlined />,
    },
    confirmada: {
        label: 'Confirmada',
        color: 'green',
        icon: <CheckCircleOutlined />,
    },
    cancelada: {
        label: 'Cancelada',
        color: 'red',
        icon: <CloseCircleOutlined />,
    },
    remarcada: {
        label: 'Remarcada',
        color: 'orange',
        icon: <SyncOutlined spin />,
    },
    no_show: {
        label: 'No-show',
        color: 'volcano',
        icon: <WarningOutlined />,
    },
    realizada: {
        label: 'Realizada',
        color: 'gold',
        icon: <CheckCircleOutlined />,
    },
};

export function criarReuniaoComModelo(
    tipo: string,
    cliente: Cliente,
    negociacao: NegociacaoCliente,
    setMeeting: (m: Meeting) => void,
    setModal: (v: boolean) => void
) {
    const agora = new Date();
    const daquiUmaHora = new Date(agora.getTime() + 3600000);

    const modelos: Record<string, Partial<Meeting>> = {
        apresentacao: {
            title: '📊 Apresentação de Proposta',
            description: 'Apresentação completa da proposta e diferenciais do plano.',
            add_to_google_calendar: true,
            add_to_google_meet: true,
        },
        revisao: {
            title: '🔍 Revisão de Apólice',
            description: 'Análise dos detalhes da apólice e próximos passos.',
            add_to_google_calendar: true,
            add_to_google_meet: true,
        },
        presencial: {
            title: '🖋️ Reunião Presencial',
            description: 'Presencial para análise dos detalhes da apólice e próximos passos.',
            add_to_google_calendar: true,
        },
        fechamento: {
            title: '🤝 Fechamento de Negócio',
            description: 'Finalização da proposta e assinatura de documentos.',
            add_to_google_calendar: true,
            add_to_google_meet: true,
        },
    };

    const modelo = modelos[tipo] || {};

    setMeeting({
        id: '',
        cliente: cliente.id,
        negociacao: negociacao.id,
        entry_type: 'meeting',
        status_reuniao: 'agendada',
        start_time: agora.toISOString(),
        end_time: daquiUmaHora.toISOString(),
        completed: false,
        ...modelo,
    } as Meeting);

    setModal(true);
}



