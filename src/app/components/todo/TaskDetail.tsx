'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/services/hooks/hooks';
import { useParams, useRouter } from 'next/navigation';
import { fetchAgendaItems } from '@/store/slices/agendaSlice';
import { RootState } from '@/store';
import styles from './TaskDetail.module.css';
import {Meeting} from "@/types/AgendaInterfaces";

const TaskDetail: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { tarefasId } = useParams();
    const agendaItems = useAppSelector((state: RootState) => state.agenda.items);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (agendaItems.length === 0) {
            dispatch(fetchAgendaItems()).then(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [dispatch, agendaItems.length]);

    // Filtra o item da agenda pelo ID e garante que seja do tipo 'task'
    const task = agendaItems.find((item: Meeting) => item.id === tarefasId && item.type === 'task');

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!task) {
        return <div>Tarefa não encontrada.</div>;
    }

    return (
        <div className={styles.container}>
            <h2>Detalhes da Tarefa</h2>
            <div className={styles.detail}>
                <p><strong>Título:</strong> {task.title}</p>
                <p><strong>Descrição:</strong> {task.description}</p>
                <p><strong>Data de Vencimento:</strong> {task.due_date}</p>
                <p><strong>Urgência:</strong> {task.urgency}</p>
                <p><strong>Completado:</strong> {task.completed ? 'Sim' : 'Não'}</p>
                <p><strong>Adicionar ao Google Calendar:</strong> {task.add_to_google_calendar ? 'Sim' : 'Não'}</p>
                <p><strong>Adicionar ao Google Meet:</strong> {task.add_to_google_meet ? 'Sim' : 'Não'}</p>
                <p><strong>Adicionar ao Zoom:</strong> {task.add_to_zoom ? 'Sim' : 'Não'}</p>
            </div>
            <button onClick={() => router.back()} className={styles.button}>Voltar</button>
        </div>
    );
};

export default TaskDetail;
