import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { deleteAgendaItem, fetchAgendaItems, updateAgendaItem } from '@/store/slices/agendaSlice';
import ConfirmDeleteModal from '@/app/components/Modal/ConfirmDeleteModal';
import TaskForm from './TaskForm';
import styles from './TaskList.module.css';
import { AgendaItem } from '@/types/interfaces';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import moment from 'moment-timezone';

import PlusImage from '@/../public/assets/common/plus.svg';
import SortImage from '@/../public/assets/common/sort3.svg';
import DeleteImage from '@/../public/assets/common/delete.svg';
import DetailsImage from '@/../public/assets/common/detalhes.svg';

const timeZone = 'America/Sao_Paulo';

const TaskList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const agendaItems = useSelector((state: RootState) => state.agenda.items);

    const tasks = agendaItems.filter((item) => item.type === 'task');

    const [sortCriteria, setSortCriteria] = useState<'urgency' | 'due_date'>('due_date');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [isTaskFormOpen, setIsTaskFormOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchAgendaItems());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        setTaskToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            dispatch(deleteAgendaItem(taskToDelete));
            setIsDeleteModalOpen(false);
        }
    };

    const sortTasks = (tasks: AgendaItem[]) => {
        return [...tasks].sort((a, b) => {
            if (sortCriteria === 'urgency') {
                const urgencyOrder = ['Critical', 'High', 'Medium', 'Low'];
                const urgencyA = urgencyOrder.indexOf(a.urgency || '');
                const urgencyB = urgencyOrder.indexOf(b.urgency || '');
                if (urgencyA === urgencyB) {
                    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
                }
                return urgencyA - urgencyB;
            }
            return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return moment.tz(dateString, timeZone).format('DD/MM/YYYY');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <button
                        className={styles.addButton}
                        onClick={() => setIsTaskFormOpen(true)}
                    >
                        <Image src={PlusImage} alt="Adicionar" /> Adicionar Tarefa
                    </button>
                    <ConfirmDeleteModal
                        isOpen={isDeleteModalOpen}
                        onRequestClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={confirmDelete}
                    />
                </header>
                {isTaskFormOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <TaskForm />
                            <button
                                onClick={() => setIsTaskFormOpen(false)}
                                className={styles.cancelButton}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Check</th>
                        <th>Título</th>
                        <th>Data de Vencimento</th>
                        <th>Urgência</th>
                        <th>Google Calendar</th>
                        <th>Google Meet</th>
                        <th>Zoom</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.length > 0 ? (
                        sortTasks(tasks).map((task) => (
                            <tr key={task.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() =>
                                            dispatch(
                                                updateAgendaItem({
                                                    id: task.id,
                                                    updatedItem: { completed: !task.completed },
                                                })
                                            )
                                        }
                                    />
                                </td>
                                <td>{task.title}</td>
                                <td>{task.start_time ? formatDate(task.start_time) : ''}</td>
                                <td className={`${styles[task.urgency?.toLowerCase() || 'low']}`}>
                                    {task.urgency || 'Não especificado'}
                                </td>
                                <td>{task.add_to_google_calendar ? 'Sim' : 'Não'}</td>
                                <td>{task.add_to_google_meet ? 'Sim' : 'Não'}</td>
                                <td>{task.add_to_zoom ? 'Sim' : 'Não'}</td>
                                <td className={styles.actions}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => router.push(`/dashboard/tarefas/${task.id}`)}
                                    >
                                        <Image src={DetailsImage} alt="Detalhes" />
                                    </button>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleDelete(task.id)}
                                    >
                                        <Image src={DeleteImage} alt="Deletar" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} style={{ textAlign: 'center' }}>
                                Nenhuma tarefa encontrada.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskList;
