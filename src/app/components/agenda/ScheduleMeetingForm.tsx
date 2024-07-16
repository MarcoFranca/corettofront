import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createMeeting } from '@/store/slices/agendaSlice';
import { Meeting } from '@/types/interfaces';
import styles from './ScheduleMeetingForm.module.css';

interface ScheduleMeetingFormProps {
    leadId: string;
    leadName: string;
    onClose: () => void;
}

const ScheduleMeetingForm: React.FC<ScheduleMeetingFormProps> = ({ leadId, leadName, onClose }) => {
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

        // Verificar se a data está sendo enviada corretamente
        if (!date) {
            alert('A data de vencimento é obrigatória.');
            return;
        }

        const newMeeting: Partial<Meeting> = {
            cliente: leadId,
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
                <h3>Agendar Reunião com {leadName}</h3>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>
                        Descrição:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Data:
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Hora de Início:
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Hora de Término:
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Adicionar ao Google Calendar:
                        <input
                            type="checkbox"
                            checked={addToGoogleCalendar}
                            onChange={(e) => setAddToGoogleCalendar(e.target.checked)}
                        />
                    </label>
                    <label>
                        Adicionar ao Google Meet:
                        <input
                            type="checkbox"
                            checked={addToGoogleMeet}
                            onChange={(e) => setAddToGoogleMeet(e.target.checked)}
                        />
                    </label>
                    <label>
                        Adicionar ao Zoom:
                        <input
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
