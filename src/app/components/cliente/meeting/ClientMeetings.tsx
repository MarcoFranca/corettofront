'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchClientMeetings, createMeeting, updateMeeting, deleteMeeting } from '@/store/slices/meetingSlice';
import { RootState } from '@/store';
import MeetingModal from '@/app/components/Modal/meeting/MeetingModal';
import styles from './ClientMeetings.module.css';
import { Meeting } from "@/types/interfaces";
import ScheduleMeetingForm from "@/app/components/Modal/meeting/ScheduleMeetingForm";

const ClientMeetings: React.FC<{ clientId: string, clientName: string }> = ({ clientId, clientName }) => {
    const dispatch = useAppDispatch();
    const meetings = useAppSelector((state: RootState) => state.meetings?.meetings || []);
    const status = useAppSelector((state: RootState) => state.meetings?.status || 'idle');
    const error = useAppSelector((state: RootState) => state.meetings?.error || null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentMeeting, setCurrentMeeting] = useState<Partial<Meeting> | null>(null);

    useEffect(() => {
        dispatch(fetchClientMeetings(clientId));
    }, [dispatch, clientId]);

    const handleOpenModal = (meeting: Partial<Meeting> | null = null) => {
        setCurrentMeeting(meeting);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setCurrentMeeting(null);
    };

    const handleSaveMeeting = async (meeting: Partial<Meeting>) => {
        if (meeting.id) {
            await dispatch(updateMeeting({ id: meeting.id, updatedMeeting: meeting }));
        } else {
            await dispatch(createMeeting({ ...meeting, cliente: clientId }));
        }
        dispatch(fetchClientMeetings(clientId)); // Atualiza a lista após criar ou editar
        setModalIsOpen(false);
    };

    const handleDeleteMeeting = async (id: string) => {
        await dispatch(deleteMeeting(id));
        dispatch(fetchClientMeetings(clientId)); // Atualiza a lista após deletar
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
                {meetings.map(meeting => (
                    <tr key={meeting.id}>
                        <td>{meeting.data_reuniao_agendada}</td>
                        <td>{`${meeting.horario_inicio} - ${meeting.horario_fim}`}</td>
                        <td>{meeting.descricao}</td>
                        <td>
                            <button onClick={() => handleOpenModal(meeting)}>Editar</button>
                            <button onClick={() => handleDeleteMeeting(meeting.id)}>Deletar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <MeetingModal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                onSubmit={handleSaveMeeting}
                initialData={currentMeeting}
            />
        </div>
    );
};

export default ClientMeetings;
