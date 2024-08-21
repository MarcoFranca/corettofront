import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchTasks, deleteTask, updateTask } from '@/store/slices/todoSlice';
import TaskForm from './TaskForm';
import TaskModal from '@/app/components/Modal/TaskModal';
import ConfirmDeleteModal from '@/app/components/Modal/ConfirmDeleteModal';
import styles from './TaskList.module.css';
import { Task } from "@/types/interfaces";
import Image from "next/image";
import { useRouter } from 'next/navigation';

import PlusImage from '@/../public/assets/common/plus.svg';
import SortImage from '@/../public/assets/common/sort3.svg';
import DeleteImage from '../../../../public/assets/common/delete.svg';
import DetailsImage from '../../../../public/assets/common/detalhes.svg';

const TaskList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editableTask, setEditableTask] = useState<{ id: string; field: string } | null>(null);
    const [sortCriteria, setSortCriteria] = useState<'urgency' | 'due_date'>('due_date');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const isFirstRender = useRef(true); // Ref para verificar se é a primeira renderização

    useEffect(() => {
        if (isFirstRender.current) {
            // Evita a requisição na primeira renderização
            isFirstRender.current = false;
            return;
        }
        // Buscar as tarefas após a primeira renderização
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        setTaskToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            dispatch(deleteTask(taskToDelete));
            setIsDeleteModalOpen(false);
        }
    };

    const handleToggleComplete = (task: Task) => {
        dispatch(updateTask({ id: task.id, updatedTask: { ...task, completed: !task.completed } }));
    };

    const handleFieldEdit = (task: Task, field: string, value: any) => {
        dispatch(updateTask({ id: task.id, updatedTask: { [field]: value } }));
        setEditableTask(null);
    };

    const handleFieldClick = (id: string, field: string) => {
        setEditableTask({ id, field });
    };

    const handleBlur = (task: Task, field: string, value: any) => {
        handleFieldEdit(task, field, value);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const goToDetails = (id: string) => {
        router.push(`/dashboard/tarefas/${id}`);
    };

    const sortTasks = (tasks: Task[]) => {
        return [...tasks].sort((a, b) => {
            if (sortCriteria === 'urgency') {
                const urgencyOrder = ['Critical', 'High', 'Medium', 'Low'];
                if (urgencyOrder.indexOf(a.urgency) === urgencyOrder.indexOf(b.urgency)) {
                    const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
                    const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
                    return dateA - dateB;
                }
                return urgencyOrder.indexOf(a.urgency) - urgencyOrder.indexOf(b.urgency);
            } else {
                const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
                const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
                return dateA - dateB;
            }
        });
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <button className={styles.addButton} onClick={openModal}>
                        <Image src={PlusImage} alt={'+'}/> Adicionar Tarefa
                    </button>
                    <TaskModal isOpen={isModalOpen} onRequestClose={closeModal}>
                        <TaskForm />
                    </TaskModal>
                    <ConfirmDeleteModal
                        isOpen={isDeleteModalOpen}
                        onRequestClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={confirmDelete}
                    />
                </header>
                <table className={styles.table}>
                    <thead>
                    <tr >
                        <th><div className={styles.titles}>Check</div></th>
                        <th><div className={styles.titles}>Título</div></th>
                        <th>
                            <div className={`${styles.titles} ${styles.titleSort}`}>
                                <Image className={styles.sortButton} onClick={() => setSortCriteria('due_date')} src={SortImage} alt={'ordenar data'}/>
                                <p>Data de Vencimento</p>
                            </div>

                        </th>
                        <th>
                            <div className={`${styles.titles} ${styles.titleSort}`}>
                                <Image className={styles.sortButton} onClick={() => setSortCriteria('urgency')}
                                       src={SortImage} alt={'ordenar data'}/>
                                <p>Urgência</p>
                            </div>
                        </th>
                        <th>
                            <div className={styles.titles}>Ações</div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortTasks(tasks).map((task) => (
                        <tr key={task.id}>
                            <td>
                                <div className={styles.titles}>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggleComplete(task)}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className={`${task.completed ? styles.completed : ''} ${styles.titles}`}>
                                    {editableTask?.id === task.id && editableTask.field === 'title' ? (
                                        <input
                                            type="text"
                                            defaultValue={task.title}
                                            onBlur={(e) => handleBlur(task, 'title', e.target.value)}
                                            className={styles.editableInput}
                                            autoFocus
                                        />
                                    ) : (
                                        <div
                                            className={`${task.completed ? styles.completed : ''} ${styles.editableField}`}
                                            onClick={() => handleFieldClick(task.id, 'title')}
                                        >
                                            {task.title}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className={`${task.completed ? styles.completed : ''} ${styles.titles}`}>
                                    {editableTask?.id === task.id && editableTask.field === 'due_date' ? (
                                        <input
                                            type="date"
                                            defaultValue={task.due_date}
                                            onBlur={(e) => handleBlur(task, 'due_date', e.target.value)}
                                            className={styles.editableInput}
                                            autoFocus
                                        />
                                    ) : (
                                        <div
                                            className={`${task.completed ? styles.completed : ''} ${styles.editableField}`}
                                            onClick={() => handleFieldClick(task.id, 'due_date')}
                                        >
                                            {task.due_date ? formatDate(task.due_date) : ''}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className={`${task.completed ? styles.completed : ''} ${styles[task.urgency.toLowerCase()]}`}>
                                <div className={styles.titles}>
                                    {editableTask?.id === task.id && editableTask.field === 'urgency' ? (
                                        <select
                                            defaultValue={task.urgency}
                                            onBlur={(e) => handleBlur(task, 'urgency', e.target.value)}
                                            className={styles.editableInput}
                                            autoFocus
                                        >
                                            <option value="Low">Baixa</option>
                                            <option value="Medium">Média</option>
                                            <option value="High">Alta</option>
                                            <option value="Critical">Crítica</option>
                                        </select>
                                    ) : (
                                        <div
                                            className={`${task.completed ? styles.completed : ''} ${styles.editableField}`}
                                            onClick={() => handleFieldClick(task.id, 'urgency')}
                                        >
                                            {task.urgency}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className={styles.actions}>
                                <button onClick={() => goToDetails(task.id)} className={styles.actionButton}>
                                    <Image src={DetailsImage} alt="Detalhes" />
                                </button>
                                <button onClick={() => handleDelete(task.id)} className={styles.actionButton}>
                                    <Image src={DeleteImage} alt="Deletar" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskList;
