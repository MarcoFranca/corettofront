import React, { useState } from 'react';
import Modal from '@/app/components/Modal/simpleModal';
import Input from '@/app/components/global/Input';
import Select from '@/app/components/global/Select';
import Button from '@/app/components/global/Button';
import styles from './LeadModal.module.css';

interface LeadModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSubmit: (leadData: any) => void;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onRequestClose, onSubmit }) => {
    const [nome, setNome] = useState('');
    const [sexo, setSexo] = useState<'M' | 'F' | ''>('');
    const [profissao, setProfissao] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            nome,
            sexo,
            profissao,
            telefone,
            email,
            status: 'lead',
            pipeline_stage: 'leads de entrada',
        });
        onRequestClose();
    };

    return (
        <Modal show={isOpen} onClose={onRequestClose} title="Cadastrar Lead">
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
                <Select
                    label="Gênero"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value as 'M' | 'F')}
                    options={[
                        { value: 'M', label: 'Masculino' },
                        { value: 'F', label: 'Feminino' },
                    ]}
                    required
                />
                <Input
                    label="Profissão"
                    type="text"
                    value={profissao}
                    onChange={(e) => setProfissao(e.target.value)}
                />
                <Input
                    label="Telefone"
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button variant="primary" type="submit">
                    Cadastrar Lead
                </Button>
                <Button variant="secondary" type="button" onClick={onRequestClose}>
                    Cancelar
                </Button>
            </form>
        </Modal>
    );
};

export default LeadModal;
