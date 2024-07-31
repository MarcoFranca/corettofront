import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views, View, NavigateAction } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Importa o CSS padrão
import './CustomCalendarStyles.css'; // Importa o CSS personalizado
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchAgendaItems } from '@/store/slices/agendaSlice';
import { fetchMeetings } from '@/store/slices/meetingSlice';
import { fetchTasks } from '@/store/slices/todoSlice';
import { RootState } from '@/store';
import styles from './Agenda.module.css';

moment.locale('pt-BR');
const localizer = momentLocalizer(moment);

const Agenda: React.FC = () => {
    const dispatch = useAppDispatch();
    const agendaItems = useAppSelector((state: RootState) => state.agenda.items);
    const meetings = useAppSelector((state: RootState) => state.meetings.meetings);
    const tasks = useAppSelector((state: RootState) => state.tasks.tasks);
    const [events, setEvents] = useState<any[]>([]);
    const [view, setView] = useState<View>(Views.MONTH);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        dispatch(fetchAgendaItems());
        dispatch(fetchMeetings());
        dispatch(fetchTasks());
    }, [dispatch]);

    useEffect(() => {
        const formatEvent = (item: any) => ({
            id: item.id,
            title: item.title || item.descricao,
            start: new Date(item.start_time || item.due_date || item.data_reuniao_agendada),
            end: new Date(item.end_time || item.due_date || item.data_reuniao_agendada),
            description: item.description || item.descricao,
        });

        const formattedAgendaItems = agendaItems.map(formatEvent);
        const formattedMeetings = meetings.map(formatEvent);
        const formattedTasks = tasks.map(formatEvent);

        setEvents([...formattedAgendaItems, ...formattedMeetings, ...formattedTasks]);
    }, [agendaItems, meetings, tasks]);

    const handleViewChange = (newView: View) => {
        setView(newView);
    };

    const handleNavigate = (newDate: Date, newView: View, action: NavigateAction) => {
        setDate(newDate);
        setView(newView);
    };

    return (
        <div className={`${styles.container} agenda-container`}>
            <h2>Agenda</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600, width: '100%' }}
                views={['month', 'week', 'day', 'agenda']}
                view={view}
                onView={handleViewChange}
                date={date}
                onNavigate={handleNavigate}
                toolbar={true}
                messages={{
                    today: 'Hoje',
                    previous: 'Anterior',
                    next: 'Próximo',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia',
                    agenda: 'Agenda',
                }}
            />
        </div>
    );
};

export default Agenda;
