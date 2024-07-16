import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { updateTask } from '@/store/slices/todoSlice';
import { Task, Urgency } from "@/types/interfaces";
import styles from './EditTaskForm.module.css';

interface EditTaskFormProps {
    task: Task;
    onClose: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [dueDate, setDueDate] = useState(task.due_date || '');
    const [urgency, setUrgency] = useState<Urgency>(task.urgency);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateTask({ id: task.id, updatedTask: { title, description, due_date: dueDate, urgency, completed: task.completed } }));
        onClose();
    };

    return (
        <div className={styles.modalContent}>
            <h2>Editar Tarefa</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="date"
                    name="due_date"
                    placeholder="Data de Vencimento"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={styles.input}
                    required
                />
                <select
                    name="urgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as Urgency)}
                    className={styles.input}
                    required
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
                <button type="submit" className={styles.button}>Atualizar Tarefa</button>
                <button type="button" onClick={onClose} className={styles.button}>Cancelar</button>
            </form>
        </div>
    );
};

export default EditTaskForm;
