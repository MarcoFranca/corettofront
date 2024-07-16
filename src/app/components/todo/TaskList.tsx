import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchTasks, deleteTask, updateTask } from '@/store/slices/todoSlice';
import TaskForm from './TaskForm';
import EditTaskForm from './EditTaskForm';
import TaskModal from '@/app/components/Modal/TaskModal';
import styles from './TaskList.module.css';
import { Task } from "@/types/interfaces";
import Image from "next/image";

import PlusImage from '@/../public/assets/cadastroLead.svg';
import EditImage from '@/../public/assets/edit.svg';
import DeleteImage from '@/../public/assets/delete.svg';

const TaskList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [editTaskId, setEditTaskId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        dispatch(deleteTask(id));
    };

    const handleEdit = (task: Task) => {
        setEditTaskId(task.id);
        setIsModalOpen(true);
    };

    const handleToggleComplete = (task: Task) => {
        dispatch(updateTask({ id: task.id, updatedTask: { ...task, completed: !task.completed } }));
    };

    const openModal = () => {
        setEditTaskId(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditTaskId(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <button className={styles.addButton} onClick={openModal}>
                    <Image src={PlusImage} alt={'+'}/> Adicionar Tarefa
                </button>
                <TaskModal isOpen={isModalOpen} onRequestClose={closeModal}>
                    {editTaskId ? (
                        <EditTaskForm
                            task={tasks.find(task => task.id === editTaskId)!}
                            onClose={closeModal}
                        />
                    ) : (
                        <TaskForm />
                    )}
                </TaskModal>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Título</th>
                        <th>Data de Vencimento</th>
                        <th>Urgência</th>
                        <th>Completado</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>
                                <div className={styles.actions}>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggleComplete(task)}
                                    />
                                    <span className={task.completed ? styles.completed : ''}>{task.title}</span>
                                </div>
                            </td>
                            <td>{task.due_date}</td>
                            <td className={styles[task.urgency.toLowerCase()]}>{task.urgency}</td>
                            <td>{task.completed ? 'Sim' : 'Não'}</td>
                            <td className={styles.actions}>
                                <button onClick={() => handleEdit(task)} className={styles.actionButton}>
                                    <Image src={EditImage} alt="Editar" />
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
