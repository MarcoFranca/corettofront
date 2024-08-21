import React, { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer, Views, View, NavigateAction, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CustomCalendarStyles.css';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchAgendaItems } from '@/store/slices/agendaSlice';
import { fetchMeetings, createMeeting } from '@/store/slices/meetingSlice';
import { fetchTasks, createTask } from '@/store/slices/todoSlice';
import { RootState } from '@/store';
import styles from './Agenda.module.css';
import Modal from 'react-modal';

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
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', start: new Date(), end: new Date(), type: 'task' });
    const isFirstRender = useRef(true); // Ref para evitar requisições duplicadas

    useEffect(() => {
        if (isFirstRender.current) {
            // Evita a requisição na primeira renderização
            isFirstRender.current = false;
            return;
        }
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

    const handleSelectSlot = (slotInfo: SlotInfo) => {
        setNewEvent({ ...newEvent, start: slotInfo.start, end: slotInfo.end });
        setModalIsOpen(true);
    };

    const handleSave = () => {
        const event = {
            title: newEvent.title,
            description: newEvent.description,
            start: newEvent.start,
            end: newEvent.end,
        };

        if (newEvent.type === 'task') {
            dispatch(createTask(event));
        } else if (newEvent.type === 'meeting') {
            dispatch(createMeeting(event));
        }

        setModalIsOpen(false);
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
                selectable
                onSelectSlot={handleSelectSlot}
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
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Novo Evento"
            >
                <h2>Novo Evento</h2>
                <form>
                    <label>
                        Título:
                        <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                    </label>
                    <label>
                        Descrição:
                        <input type="text" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
                    </label>
                    <label>
                        Tipo:
                        <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
                            <option value="task">Tarefa</option>
                            <option value="meeting">Reunião</option>
                        </select>
                    </label>
                    <button type="button" onClick={handleSave}>Salvar</button>
                    <button type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                </form>
            </Modal>
        </div>
    );
};

export default Agenda;
