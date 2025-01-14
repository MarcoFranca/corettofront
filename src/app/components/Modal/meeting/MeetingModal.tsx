'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { AgendaItem } from '@/types/interfaces'; // Use o modelo unificado
import styles from './MeetingModal.module.css';

interface MeetingModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSubmit: (data: Partial<AgendaItem>) => void; // Use AgendaItem
    initialData?: Partial<AgendaItem> | null; // Use AgendaItem
}

const MeetingModal: React.FC<MeetingModalProps> = ({ isOpen, onRequestClose, onSubmit, initialData }) => {
    const [data, setData] = useState<Partial<AgendaItem>>(initialData || { type: 'meeting' }); // Define `type` como padrão

    useEffect(() => {
        setData(initialData || { type: 'meeting' }); // Define o tipo padrão como `meeting`
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Gerenciar Evento"
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <h2>{data.type === 'meeting' ? 'Marcar Reunião' : 'Criar Tarefa'}</h2>
            <form onSubmit={handleSubmit}>
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
                <div className={styles.buttons}>
                    <button type="submit" className={styles.submitButton}>
                        Salvar
                    </button>
                    <button
                        type="button"
                        onClick={onRequestClose}
                        className={styles.cancelButton}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default MeetingModal;
