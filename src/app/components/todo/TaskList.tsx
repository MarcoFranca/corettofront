import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { deleteAgendaItem, fetchAgendaItems, updateAgendaItem } from '@/store/slices/agendaSlice';
import ConfirmDeleteModal from '@/app/components/Modal/ConfirmDeleteModal';
import TaskForm from './TaskForm';
import styles from './TaskList.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import moment from 'moment-timezone';

import PlusImage from '@/../public/assets/common/plus.svg';
import DeleteImage from '@/../public/assets/common/delete.svg';
import DetailsImage from '@/../public/assets/common/detalhes.svg';
import {AgendaItem} from "@/types/interfaces";
import AscendingIcon from '@/../public/assets/common/sort2.svg';
import DescendingIcon from '@/../public/assets/common/sort3.svg';


const timeZone = 'America/Sao_Paulo';

const TaskList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const agendaItems = useSelector((state: RootState) => state.agenda.items);

    const tasks = agendaItems.filter((item) => item.type === 'task');

    const [sortCriteria, setSortCriteria] = useState<'due_date' | 'urgency'>('due_date');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc'); // Adiciona o estado para o tipo de ordenação
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
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
            let comparison = 0;

            if (sortCriteria === 'due_date') {
                const dateA = new Date(a.start_time || '').getTime();
                const dateB = new Date(b.start_time || '').getTime();
                comparison = dateA - dateB; // Ordena por data (ascendente)
            } else if (sortCriteria === 'urgency') {
                const urgencyOrder = ['Low', 'Medium', 'High', 'Critical'];
                const urgencyA = urgencyOrder.indexOf(a.urgency || '');
                const urgencyB = urgencyOrder.indexOf(b.urgency || '');
                comparison = urgencyA - urgencyB; // Ordena por urgência (ascendente)
            }

            return order === 'asc' ? comparison : -comparison; // Inverte a ordem se for descendente
        });
    };

    const toggleSortOrder = (criteria: 'due_date' | 'urgency') => {
        if (sortCriteria === criteria) {
            // Alterna entre ascendente e descendente
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            // Define novo critério e reseta para ascendente
            setSortCriteria(criteria);
            setOrder('asc');
        }
    };


    const filterTasks = (tasks: AgendaItem[]) => {
        switch (filter) {
            case 'completed':
                return tasks.filter((task) => task.completed);
            case 'pending':
                return tasks.filter((task) => !task.completed);
            default:
                return tasks;
        }
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Sem data definida'; // Mensagem padrão
        return moment.tz(dateString, timeZone).format('DD/MM/YYYY');
    };

    const filteredAndSortedTasks = sortTasks(filterTasks(tasks));

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <button
                        className={styles.addButton}
                        onClick={() => setIsTaskFormOpen(true)}
                    >
                        <Image src={PlusImage} alt="Adicionar"/> Adicionar Tarefa
                    </button>
                    <ConfirmDeleteModal
                        isOpen={isDeleteModalOpen}
                        onRequestClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={confirmDelete}
                    />
                </header>

                <div className={styles.filterSort}>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'pending')}
                        className={styles.filterSelect}
                    >
                        <option value="all">Todas</option>
                        <option value="completed">Concluídas</option>
                        <option value="pending">Pendentes</option>
                    </select>

                </div>
                {isTaskFormOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <TaskForm/>
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
                        <th onClick={() => toggleSortOrder('due_date')}>
                            Data de Vencimento
                            <Image
                                src={sortCriteria === 'due_date' && order === 'asc' ? AscendingIcon : DescendingIcon}
                                alt="Ordenar por data"
                                className={styles.sortIcon}
                            />
                        </th>
                        <th onClick={() => toggleSortOrder('urgency')}>
                            Urgência
                            <Image
                                src={sortCriteria === 'urgency' && order === 'asc' ? AscendingIcon : DescendingIcon}
                                alt="Ordenar por urgência"
                                className={styles.sortIcon}
                            />
                        </th>
                        <th>Google Calendar</th>
                        <th>Google Meet</th>
                        <th>Zoom</th>
                        <th>Ações</th>
                    </tr>
                    </thead>


                    <tbody>
                    {filteredAndSortedTasks.length > 0 ? (
                        filteredAndSortedTasks.map((task) => (
                            <tr
                                key={task.id}
                                className={task.completed ? styles.completed : ''}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() =>
                                            dispatch(
                                                updateAgendaItem({
                                                    id: task.id,
                                                    updatedItem: {completed: !task.completed},
                                                })
                                            )
                                        }
                                    />
                                </td>
                                <td>{task.title}</td>
                                <td>{task.start_time ? formatDate(task.start_time) : 'Sem data definida'}</td>
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
                                        <Image src={DetailsImage} alt="Detalhes"/>
                                    </button>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleDelete(task.id)}
                                    >
                                        <Image src={DeleteImage} alt="Deletar"/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} style={{textAlign: 'center'}}>
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
