import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views, SlotInfo } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchAgendaItems, createAgendaItem, deleteAgendaItem, updateAgendaItem } from '@/store/slices/agendaSlice';
import { RootState } from '@/store';
import api from '@/app/api/axios';
import styles from './Agenda.module.css';
import CreateEventModal from '@/app/components/Modal/agenda/CreateEventModal';
import EventDetailsModal from '@/app/components/Modal/agenda/EventDetailsModal';

moment.locale('pt-BR');
const localizer = momentLocalizer(moment);
const timeZone = 'America/Sao_Paulo';

interface Cliente {
    id: string;
    nome: string;
}

const Agenda: React.FC = () => {
    const dispatch = useAppDispatch();
    const agendaItems = useAppSelector((state: RootState) => state.agenda.items);
    const [events, setEvents] = useState<any[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false); // CreateEventModal
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false); // EventDetailsModal
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        type: 'task' as 'task' | 'meeting',
        urgency: 'Low' as 'Low' | 'Medium' | 'High' | 'Critical',
        clienteId: null as string | null,
        add_to_google_calendar: false,
        add_to_google_meet: false,
        add_to_zoom: false,
    });
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    useEffect(() => {
        dispatch(fetchAgendaItems());
        fetchClientes();
    }, [dispatch]);

    useEffect(() => {
        const formattedEvents = agendaItems.map((item: any) => ({
            ...item,
            start: moment.tz(item.start, timeZone).toDate(),
            end: moment.tz(item.end, timeZone).toDate(),
        }));
        setEvents(formattedEvents);
    }, [agendaItems]);

    const fetchClientes = async () => {
        try {
            const response = await api.get('/clientes/');
            setClientes(response.data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    };

    const handleSelectSlot = (slotInfo: SlotInfo) => {
        setNewEvent({
            ...newEvent,
            startTime: moment(slotInfo.start).format('HH:mm'),
            endTime: moment(slotInfo.end).format('HH:mm'),
        });
        setModalIsOpen(true);
    };

    const handleEditEvent = (event: any) => {
        setNewEvent({
            title: event.title,
            description: event.description,
            startTime: moment(event.start).format('HH:mm'),
            endTime: moment(event.end).format('HH:mm'),
            type: event.type,
            urgency: event.urgency,
            clienteId: event.cliente || null,
            add_to_google_calendar: event.add_to_google_calendar,
            add_to_google_meet: event.add_to_google_meet,
            add_to_zoom: event.add_to_zoom,
        });
        setDetailsModalIsOpen(false); // Feche o modal de detalhes
        setModalIsOpen(true); // Abra o modal de criação para edição
    };


    const handleSelectEvent = (event: any) => {
        setSelectedEvent(event);
        setDetailsModalIsOpen(true);
    };

    const handleSave = async () => {
        try {
            const formattedStart = moment(`2023-12-10T${newEvent.startTime}`).format();
            const formattedEnd = moment(`2023-12-10T${newEvent.endTime}`).format();

            await dispatch(
                createAgendaItem({
                    title: newEvent.title,
                    description: newEvent.description,
                    start_time: formattedStart,
                    end_time: formattedEnd,
                    type: newEvent.type,
                    urgency: newEvent.urgency,
                    cliente: newEvent.clienteId,
                })
            );
            setModalIsOpen(false);
        } catch (error) {
            console.error('Erro ao salvar o evento:', error);
        }
    };

    const handleUpdateEvent = async (updatedEvent: any) => {
        try {
            const formattedEvent = {
                ...updatedEvent,
                start: moment(`2023-12-10T${updatedEvent.start}`).toISOString(),
                end: moment(`2023-12-10T${updatedEvent.end}`).toISOString(),
            };

            await dispatch(
                updateAgendaItem({
                    id: updatedEvent.id,
                    updatedItem: formattedEvent,
                })
            );
            setDetailsModalIsOpen(false);
        } catch (error) {
            console.error('Erro ao atualizar o evento:', error);
        }
    };


    const handleDeleteEvent = async () => {
        if (selectedEvent?.id) {
            await dispatch(deleteAgendaItem(selectedEvent.id));
            setDetailsModalIsOpen(false);
        }
    };

    const eventStyleGetter = (event: any) => {
        const style = {
            backgroundColor: event.type === 'meeting' ? '#3174ad' : '#f1cb0e',
        };
        return { style };
    };

    return (
        <div className={styles.container}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
            />
            <CreateEventModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                newEvent={newEvent}
                setNewEvent={setNewEvent}
                clientes={clientes}
                handleSave={handleSave}
            />
            {selectedEvent && (
                <EventDetailsModal
                    isOpen={detailsModalIsOpen}
                    onRequestClose={() => setDetailsModalIsOpen(false)}
                    event={selectedEvent}
                    onUpdate={handleUpdateEvent}
                    onDelete={handleDeleteEvent}
                />
            )}
        </div>
    );
};

export default Agenda;
