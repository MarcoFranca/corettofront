'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Meeting } from '@/types/interfaces';
import styles from './MeetingModal.module.css';

interface MeetingModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSubmit: (data: Partial<Meeting>) => void;
    initialData?: Partial<Meeting> | null;
}

const MeetingModal: React.FC<MeetingModalProps> = ({ isOpen, onRequestClose, onSubmit, initialData }) => {
    const [data, setData] = useState<Partial<Meeting>>(initialData || {});

    useEffect(() => {
        setData(initialData || {});
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            contentLabel="Marcar Reunião"
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <h2>Marcar Reunião</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Data da Reunião</label>
                    <input
                        type="date"
                        name="data_reuniao_agendada"
                        value={data.data_reuniao_agendada || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Horário de Início</label>
                    <input
                        type="time"
                        name="horario_inicio"
                        value={data.horario_inicio || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Horário de Fim</label>
                    <input
                        type="time"
                        name="horario_fim"
                        value={data.horario_fim || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Descrição</label>
                    <input
                        type="text"
                        name="descricao"
                        value={data.descricao || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.buttons}>
                    <button type="submit" className={styles.submitButton}>Salvar</button>
                    <button type="button" onClick={onRequestClose} className={styles.cancelButton}>Cancelar</button>
                </div>
            </form>
        </Modal>
    );
};

export default MeetingModal;
