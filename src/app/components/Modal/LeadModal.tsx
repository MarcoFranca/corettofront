'use client';

import React, { useState } from 'react';
import ReactModal from 'react-modal';
import styles from './LeadModal.module.css';

interface LeadModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSubmit: (leadData: any) => void;
}

const LeadModal = ({ isOpen, onRequestClose, onSubmit }: LeadModalProps) => {
    const [nome, setNome] = useState('');
    const [contato, setContato] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [endereco, setEndereco] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ nome, contato, telefone, email, endereco, status: 'lead' });
        onRequestClose();
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
        >
            <form onSubmit={handleSubmit}>
                <label>
                    Nome:
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Contato:
                    <input
                        type="text"
                        value={contato}
                        onChange={(e) => setContato(e.target.value)}

                    />
                </label>
                <label>
                    Telefone:
                    <input
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                    />
                </label>
                <label>
                    Endereço:
                    <input
                        type="text"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}

                    />
                </label>
                <button type="submit">Cadastrar Lead</button>
            </form>
        </ReactModal>
    );
};

export default LeadModal;
