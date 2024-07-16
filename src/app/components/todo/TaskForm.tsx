import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createTask } from '@/store/slices/todoSlice';
import { Task } from '@/types/interfaces';
import styles from './TaskForm.module.css';

const TaskForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newTask: Partial<Task> = { title, description, due_date: dueDate, urgency, completed: false };
        await dispatch(createTask(newTask));
        setTitle('');
        setDescription('');
        setDueDate('');
        setUrgency('Low');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Criar Nova Tarefa</h3>
            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={styles.input}
            />
            <textarea
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
            ></textarea>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={styles.input}
            />
            <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'Low' | 'Medium' | 'High' | 'Critical')}
                required
                className={styles.select}
            >
                <option value="Low">Baixa</option>
                <option value="Medium">Média</option>
                <option value="High">Alta</option>
                <option value="Critical">Crítica</option>
            </select>
            <button type="submit" className={styles.button}>Adicionar Tarefa</button>
        </form>
    );
};

export default TaskForm;
