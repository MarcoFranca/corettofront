import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import api from '@/app/api/axios';
import styles from './EditLeadForm.module.css';
import { Lead, StatusReuniao } from "@/types/interfaces";
import { updateLead } from '@/store/slices/leadsSlice';
import axios from "axios";

interface EditLeadFormProps {
    lead: Lead;
    onClose: () => void;
    onUpdate: (updatedLead: Lead) => void; // Callback para informar sobre a atualização
}

const EditLeadForm: React.FC<EditLeadFormProps> = ({ lead, onClose, onUpdate }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [nome, setNome] = useState(lead.nome);
    const [email, setEmail] = useState(lead.email);
    const [telefone, setTelefone] = useState(lead.telefone);
    const [statusReuniao, setStatusReuniao] = useState<StatusReuniao>(lead.status_reuniao);

    const handleUpdateLead = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedLead = {
            nome,
            email,
            telefone,
            status_reuniao: statusReuniao,
        };
        console.log('Enviando dados:', updatedLead);
        try {
            const response = await api.patch(`/clientes/${lead.id}/`, updatedLead);
            dispatch(updateLead({ id: lead.id, updatedLead })); // Atualiza o lead no store
            console.log('Lead atualizado com sucesso:', response.data);
            onUpdate(response.data); // Chama o callback com o lead atualizado
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Erro ao atualizar lead:', error.response?.data);
            } else {
                console.error('Erro ao atualizar lead:', error);
            }
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Editar Lead</h2>
                <form onSubmit={handleUpdateLead}>
                    <div className={styles.formGroup}>
                        <label>Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Telefone</label>
                        <input
                            type="tel"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Status Reunião</label>
                        <select
                            value={statusReuniao}
                            onChange={(e) => setStatusReuniao(e.target.value as StatusReuniao)}
                            required
                        >
                            <option value="reuniao_marcada">Reunião Marcada</option>
                            <option value="retornar">Retornar</option>
                            <option value="nao_tem_interesse">Não Tem Interesse</option>
                            <option value="nao_atendeu">Não Atendeu</option>
                            <option value="marcar_reuniao">Marcar Reunião</option>
                        </select>
                    </div>
                    <div className={styles.actions}>
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLeadForm;
