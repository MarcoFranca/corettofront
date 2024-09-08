import React, { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer, Views, View, NavigateAction, SlotInfo } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CustomCalendarStyles.css';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchAgendaItems } from '@/store/slices/agendaSlice';
import { RootState } from '@/store';
import styles from './Agenda.module.css';
import Modal from 'react-modal';

moment.locale('pt-BR');
const localizer = momentLocalizer(moment);

// Defina o fuso horário que você deseja usar
const timeZone = 'America/Sao_Paulo';

const Agenda: React.FC = () => {
    const dispatch = useAppDispatch();
    const agendaItems = useAppSelector((state: RootState) => state.agenda.items);
    const [events, setEvents] = useState<any[]>([]);
    const [view, setView] = useState<View>(Views.MONTH);
    const [date, setDate] = useState(new Date());
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', start: new Date(), end: new Date(), type: 'task' });
    const isFirstRender = useRef(true); // Ref para evitar requisições duplicadas

    useEffect(() => {
        dispatch(fetchAgendaItems()); // Faz a requisição para buscar os itens da agenda
    }, [dispatch]);

    // Função para formatar os eventos com conversão de fuso horário
    const formatEvent = (item: any) => {
        // Verifica se a data já está em UTC e converte para o fuso horário correto
        const startZoned = moment.tz(item.start, timeZone).toDate();
        const endZoned = moment.tz(item.end, timeZone).toDate();

        return {
            id: item.id,
            title: item.title,
            start: startZoned,
            end: endZoned,
            description: item.description,
        };
    };


    // Atualiza os eventos quando os dados da agenda forem alterados
    useEffect(() => {
        const formattedAgendaItems = agendaItems.map(formatEvent);

        // Adicione log para verificar os eventos convertidos
        console.log("Eventos formatados:", formattedAgendaItems);

        // Remover duplicatas usando o ID único de cada evento
        const uniqueEvents = Array.from(new Set(formattedAgendaItems.map(event => event.id)))
            .map(id => formattedAgendaItems.find(event => event.id === id));

        setEvents(uniqueEvents);
    }, [agendaItems]);


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

        // Lógica para criar uma nova task ou reunião
        if (newEvent.type === 'task') {
            // Dispatch createTask
        } else if (newEvent.type === 'meeting') {
            // Dispatch createMeeting
        }

        setModalIsOpen(false);
    };

    return (
        <div className={`${styles.container} agenda-container`}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', width: '100%' }}
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
