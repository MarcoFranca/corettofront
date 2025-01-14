'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchAgendaItems, createAgendaItem, updateAgendaItem, deleteAgendaItem } from '@/store/slices/agendaSlice';
import { RootState } from '@/store';
import MeetingModal from '@/app/components/Modal/meeting/MeetingModal';
import styles from './ClientMeetings.module.css';
import { AgendaItem } from '@/types/interfaces';
import ScheduleMeetingForm from '@/app/components/Modal/meeting/ScheduleMeetingForm';
import moment from 'moment';

const ClientMeetings: React.FC<{ clientId: string; clientName: string }> = ({ clientId, clientName }) => {
    const dispatch = useAppDispatch();
    const agendaItems = useAppSelector((state: RootState) => state.agenda?.items || []);
    const status = useAppSelector((state: RootState) => state.agenda?.status || 'idle');
    const error = useAppSelector((state: RootState) => state.agenda?.error || null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentAgendaItem, setCurrentAgendaItem] = useState<Partial<AgendaItem> | null>(null);

    useEffect(() => {
        dispatch(fetchAgendaItems());
    }, [dispatch, clientId]);

    const handleOpenModal = (agendaItem: Partial<AgendaItem> | null = null) => {
        setCurrentAgendaItem(agendaItem);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setCurrentAgendaItem(null);
    };

    const handleSaveMeeting = async (agendaItem: Partial<AgendaItem>) => {
        if (agendaItem.id) {
            await dispatch(updateAgendaItem({ id: agendaItem.id, updatedItem: agendaItem }));
        } else {
            await dispatch(createAgendaItem({ ...agendaItem, cliente: clientId, type: 'meeting' }));
        }
        dispatch(fetchAgendaItems()); // Atualiza a lista após criar ou editar
        setModalIsOpen(false);
    };

    const handleDeleteMeeting = async (id: string) => {
        await dispatch(deleteAgendaItem(id));
        dispatch(fetchAgendaItems()); // Atualiza a lista após deletar
    };

    return (
        <div className={styles.container}>
            <button onClick={() => setModalIsOpen(true)}>Agendar Reunião</button>
            {modalIsOpen && (
                <ScheduleMeetingForm
                    entityId={clientId}
                    entityName={clientName}
                    entityType="cliente"
                    onClose={() => setModalIsOpen(false)}
                />
            )}
            {status === 'loading' && <p>Carregando...</p>}
            {error && <p className={styles.error}>{error}</p>}
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {agendaItems
                    .filter((item) => item.cliente === clientId && item.type === 'meeting')
                    .map((item) => (
                        <tr key={item.id}>
                            <td>{moment(item.start_time).format('DD/MM/YYYY')}</td>
                            <td>{`${moment(item.start_time).format('HH:mm')} - ${moment(item.end_time).format('HH:mm')}`}</td>
                            <td>{item.description}</td>
                            <td>
                                <button onClick={() => handleOpenModal(item)}>Editar</button>
                                <button onClick={() => handleDeleteMeeting(item.id)}>Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <MeetingModal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                onSubmit={handleSaveMeeting}
                initialData={currentAgendaItem}
            />
        </div>
    );
};

export default ClientMeetings;
