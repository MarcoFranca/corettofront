import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createMeeting } from '@/store/slices/meetingSlice';
import { Meeting } from '@/types/interfaces';
import styles from './ScheduleMeetingForm.module.css';

interface ScheduleMeetingFormProps {
    entityId: string;
    entityName: string;
    entityType: 'lead' | 'cliente';
    onClose: () => void;
}

const ScheduleMeetingForm: React.FC<ScheduleMeetingFormProps> = ({ entityId, entityName, entityType, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [addToGoogleCalendar, setAddToGoogleCalendar] = useState(false);
    const [addToGoogleMeet, setAddToGoogleMeet] = useState(false);
    const [addToZoom, setAddToZoom] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!date) {
            alert('A data de vencimento é obrigatória.');
            return;
        }

        const newMeeting: Partial<Meeting> = {
            cliente: entityId,
            descricao: description,
            data_reuniao_agendada: date,
            horario_inicio: startTime,
            horario_fim: endTime,
            add_to_google_calendar: addToGoogleCalendar,
            add_to_google_meet: addToGoogleMeet,
            add_to_zoom: addToZoom,
        };
        await dispatch(createMeeting(newMeeting));
        onClose();
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Agendar Reunião Com: <span className={styles.entityName}>{entityName}</span></h3>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>
                        Data:
                        <input
                            className={styles.input}
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </label>
                    <label className={styles.label}>
                        Hora de Início:
                        <input
                            className={styles.input}
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </label>
                    <label className={styles.label}>
                        Hora de Término:
                        <input
                            className={styles.input}
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </label>
                    <label className={styles.label}>
                        <p>Descrição:</p>
                        <textarea
                            className={styles.textarea}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <label className={`${styles.label} ${styles.labelSelect}`}>
                        <p>Adicionar ao Google Calendar:</p>
                        <input
                            className={styles.select}
                            type="checkbox"
                            checked={addToGoogleCalendar}
                            onChange={(e) => setAddToGoogleCalendar(e.target.checked)}
                        />
                    </label>
                    <label className={`${styles.label} ${styles.labelSelect}`}>
                        <p>Adicionar ao Google Meet:</p>
                        <input
                            className={styles.select}
                            type="checkbox"
                            checked={addToGoogleMeet}
                            onChange={(e) => setAddToGoogleMeet(e.target.checked)}
                        />
                    </label>
                    <label className={`${styles.label} ${styles.labelSelect}`}>
                        <p>Adicionar ao Zoom:</p>
                        <input
                            className={styles.select}
                            type="checkbox"
                            checked={addToZoom}
                            onChange={(e) => setAddToZoom(e.target.checked)}
                        />
                    </label>
                    <div className={styles.actions}>
                        <button type="submit" className={styles.button}>Agendar</button>
                        <button type="button" className={styles.buttonCancel} onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleMeetingForm;
