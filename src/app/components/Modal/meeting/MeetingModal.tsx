'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import StandardModal from '@/app/components/Modal/StandardModal';
import { Meeting } from '@/types/AgendaInterfaces'; // Use o modelo unificado
import styles from './MeetingModal.module.css';

interface MeetingModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSubmit: (data: Partial<Meeting>) => void; // Use AgendaItem
    initialData?: Partial<Meeting> | null; // Use AgendaItem
}

const MeetingModal: React.FC<MeetingModalProps> = ({ isOpen, onRequestClose, onSubmit, initialData }) => {
    const [data, setData] = useState<Partial<Meeting>>(initialData || { type: 'meeting' });

    useEffect(() => {
        setData(initialData || { type: 'meeting' });
    }, [initialData]);

    const methods = useForm({
        defaultValues: data,
        mode: 'onChange',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSubmit(data);
        onRequestClose();
    };

    return (
        <StandardModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title={data.type === 'meeting' ? 'Marcar Reunião' : 'Criar Tarefa'}
            onSubmit={methods.handleSubmit(handleSubmit)}
            buttonText="Salvar"
            buttonIcon={null}
            successMessage="Evento salvo com sucesso!"
            errorMessage="Erro ao salvar evento, tente novamente."
            methods={methods}
        >
            <div className={styles.modalContent}>
                <div className={styles.formGroup}>
                    <label>Título</label>
                    <input
                        type="text"
                        name="title"
                        value={data.title || ''}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Tipo</label>
                    <select
                        name="type"
                        value={data.type || 'meeting'}
                        onChange={handleChange}
                        className={styles.input}
                    >
                        <option value="meeting">Reunião</option>
                        <option value="task">Tarefa</option>
                    </select>
                </div>
                {data.type === 'meeting' && (
                    <>
                        <div className={styles.formGroup}>
                            <label>Data</label>
                            <input
                                type="date"
                                name="due_date"
                                value={data.due_date || ''}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Horário de Início</label>
                            <input
                                type="time"
                                name="start_time"
                                value={data.start_time || ''}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Horário de Fim</label>
                            <input
                                type="time"
                                name="end_time"
                                value={data.end_time || ''}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                    </>
                )}
                <div className={styles.formGroup}>
                    <label>Descrição</label>
                    <input
                        type="text"
                        name="description"
                        value={data.description || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
            </div>
        </StandardModal>
    );
};

export default MeetingModal;
