import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createAgendaItem } from '@/store/slices/agendaSlice';
import styles from './TaskForm.module.css';
import moment from 'moment';
import api from '@/app/api/axios';

interface Cliente {
    id: string;
    nome: string;
}

const TaskForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');
    const [addToGoogleCalendar, setAddToGoogleCalendar] = useState(false);
    const [addToGoogleMeet, setAddToGoogleMeet] = useState(false);
    const [addToZoom, setAddToZoom] = useState(false);
    const [clienteId, setClienteId] = useState<string | null>(null);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch de clientes
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await api.get('/clientes/');
                setClientes(response.data);
            } catch (err) {
                console.error('Erro ao carregar clientes:', err);
            }
        };
        fetchClientes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!dueDate || !startTime || !endTime) {
            setError('Por favor, preencha a data, hora de início e hora de término.');
            return;
        }

        setError(null);

        const formattedStart = moment(`${dueDate}T${startTime}`).format();
        const formattedEnd = moment(`${dueDate}T${endTime}`).format();

        const newTask = {
            title,
            description,
            start_time: formattedStart,
            end_time: formattedEnd,
            type: 'task' as const,
            urgency,
            completed: false,
            add_to_google_calendar: addToGoogleCalendar,
            add_to_google_meet: addToGoogleMeet,
            add_to_zoom: addToZoom,
            cliente: clienteId || null, // Inclui o clienteId no payload
        };

        console.log('Payload enviado ao backend:', newTask);

        try {
            await dispatch(createAgendaItem(newTask));
            setTitle('');
            setDescription('');
            setStartTime('');
            setEndTime('');
            setDueDate('');
            setUrgency('Low');
            setAddToGoogleCalendar(false);
            setAddToGoogleMeet(false);
            setAddToZoom(false);
            setClienteId(null);
        } catch (err) {
            setError('Erro ao criar tarefa. Tente novamente.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Criar Nova Tarefa</h3>
            {error && <p className={styles.error}>{error}</p>}
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
                required
                className={styles.input}
            />
            <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className={styles.input}
            />
            <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
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
            <select
                value={clienteId || ''}
                onChange={(e) => setClienteId(e.target.value || null)}
                className={styles.select}
            >
                <option value="">Selecionar Cliente (Opcional)</option>
                {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                    </option>
                ))}
            </select>
            <button type="submit" className={styles.button}>Adicionar Tarefa</button>
        </form>
    );
};

export default TaskForm;
