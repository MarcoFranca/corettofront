import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { createAgendaItem } from '@/store/slices/agendaSlice';
import { toast } from 'react-toastify';
import styles from './ScheduleMeetingForm.module.css';
import {clearMessages, linkGoogleAccount} from "@/store/slices/googleIntegrationSlice";
import {useGoogleLogin} from "@react-oauth/google";
import {Meeting, ScheduleMeetingFormProps} from "@/types/AgendaInterfaces";

const ScheduleMeetingForm: React.FC<ScheduleMeetingFormProps> = ({ entityId, entityName, entityType, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const googleAuthRedirectUrl = useSelector((state: RootState) => state.agenda.googleAuthRedirectUrl);

    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [addToGoogleCalendar, setAddToGoogleCalendar] = useState(false);
    const [addToGoogleMeet, setAddToGoogleMeet] = useState(false);
    const [addToZoom, setAddToZoom] = useState(false);


    useEffect(() => {
        if (googleAuthRedirectUrl) {
            toast.warning('Sua sincronização com o Google foi revogada ou expirou. Você será redirecionado para reautorizar.');
            window.location.href = googleAuthRedirectUrl;
        }
    }, [googleAuthRedirectUrl]);

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: (codeResponse) => {
            dispatch(linkGoogleAccount(codeResponse.code)); // Vincula novamente a conta Google
            toast.success('Conta Google reautorizada com sucesso!');
        },
        onError: () => {
            dispatch(clearMessages());
            toast.error('Erro ao tentar reautorizar sua conta Google.');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!date || !startTime || !endTime) {
            toast.warning('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const startDateTime = new Date(`${date}T${startTime}`).toISOString();
        const endDateTime = new Date(`${date}T${endTime}`).toISOString();

        const dynamicTitle = entityType === 'negociacao'
            ? `Reunião da Negociação: ${entityName}`
            : `Reunião com ${entityName}`;

        const newAgendaItem: Partial<Meeting> = {
            title: dynamicTitle,
            cliente: entityId,
            description,
            start_time: startDateTime,
            end_time: endDateTime,
            type: 'meeting',
            completed: false,
            urgency: 'High',
            add_to_google_calendar: addToGoogleCalendar,
            add_to_google_meet: addToGoogleMeet,
            add_to_zoom: addToZoom,
            ...(entityType === 'cliente' || entityType === 'lead' ? { cliente: entityId } : {}),
            ...(entityType === 'negociacao' ? { negociacao: entityId } : {}),
        };

        try {
            await dispatch(createAgendaItem(newAgendaItem)).unwrap();
            toast.success('Reunião criada com sucesso! 🎉');
            onClose();
        } catch (error: any) {
            console.log('Erro ao criar item na agenda:', error);

            if (error.code === 'google_auth_required') {
                toast.warning('⚠️ Sua sincronização com o Google expirou. Reautorizando...');
                loginWithGoogle();
            } else {
                toast.error(error.message || '🚨 Erro ao criar a reunião.');
            }
        }
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
