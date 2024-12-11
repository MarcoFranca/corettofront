import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
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
    const [addToGoogleCalendar, setAddToGoogleCalendar] = useState(task.add_to_google_calendar || false);
    const [addToGoogleMeet, setAddToGoogleMeet] = useState(task.add_to_google_meet || false);
    const [addToZoom, setAddToZoom] = useState(task.add_to_zoom || false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateTask({
            id: task.id,
            updatedTask: {
                title,
                description,
                due_date: dueDate,
                urgency,
                add_to_google_calendar: addToGoogleCalendar,
                add_to_google_meet: addToGoogleMeet,
                add_to_zoom: addToZoom,
            },
        }));
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                required
            />
            <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
            />
            <input
                type="date"
                name="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={styles.input}
                required
            />
            <select
                name="urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
                className={styles.select}
                required
            >
                <option value="Low">Baixa</option>
                <option value="Medium">Média</option>
                <option value="High">Alta</option>
                <option value="Critical">Crítica</option>
            </select>
            <label>
                <input
                    type="checkbox"
                    checked={addToGoogleCalendar}
                    onChange={(e) => setAddToGoogleCalendar(e.target.checked)}
                />
                Adicionar ao Google Calendar
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={addToGoogleMeet}
                    onChange={(e) => setAddToGoogleMeet(e.target.checked)}
                />
                Adicionar ao Google Meet
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={addToZoom}
                    onChange={(e) => setAddToZoom(e.target.checked)}
                />
                Adicionar ao Zoom
            </label>
            <button type="submit" className={styles.button}>Salvar</button>
        </form>
    );
};

export default EditTaskForm;
