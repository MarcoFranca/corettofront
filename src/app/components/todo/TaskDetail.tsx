import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useParams, useRouter } from 'next/navigation';
import styles from './TaskDetail.module.css';

const TaskDetail: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { tarefasId } = useParams();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tasks.length === 0) {
            dispatch(fetchTasks()).then(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [dispatch, tasks.length]);

    const task = tasks.find((task) => task.id === tarefasId);

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
