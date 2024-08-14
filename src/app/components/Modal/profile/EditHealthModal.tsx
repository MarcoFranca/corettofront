import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { updateClienteSaude } from '@/store/slices/clientesSlice';
import styles from './EditHealthModal.module.css';
import { RootState } from '@/store';

interface EditHealthModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    initialData: any;
    onSave: (data: any) => void;
}

const EditHealthModal: React.FC<EditHealthModalProps> = ({ isOpen, onRequestClose, initialData, onSave }) => {
    const [formData, setFormData] = useState(initialData);
    const dispatch = useAppDispatch();
    const clienteId = useAppSelector((state: RootState) => state.clientes.clienteDetalhe?.id);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        if (clienteId) {
            const saudeData = {
                ...formData,
                altura: parseFloat(formData.altura.replace(',', '.')),
                peso: parseFloat(formData.peso.replace(',', '.'))
            };
            dispatch(updateClienteSaude({ id: clienteId, saudeData }));
            onSave(formData);
        }
        onRequestClose();
    };

    const formatLabel = (label: string) => {
        return label.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Atualizar Dados de Saúde"
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <h2>Atualizar Dados de Saúde</h2>
            <form>
                <label>
                    {formatLabel('altura')}:
                    <input
                        type="text"
                        name="altura"
                        value={formData.altura || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    {formatLabel('peso')}:
                    <input
                        type="text"
                        name="peso"
                        value={formData.peso || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    {formatLabel('doenca_preexistente')}:
                    <textarea
                        name="doenca_preexistente"
                        value={formData.doenca_preexistente || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    {formatLabel('historico_familiar_doencas')}:
                    <textarea
                        name="historico_familiar_doencas"
                        value={formData.historico_familiar_doencas || ''}
                        onChange={handleChange}
                    />
                </label>
                <button type="button" onClick={handleSave}>Salvar</button>
            </form>
        </Modal>
    );
};

export default EditHealthModal;
