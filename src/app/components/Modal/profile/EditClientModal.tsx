// EditClientModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './EditClientModal.module.css';

interface EditClientModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    initialData: any;
    onSave: (data: any) => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onRequestClose, initialData, onSave }) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Atualizar Dados do Cliente"
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <h2>Atualizar Dados do Cliente</h2>
            <form>
                {Object.keys(formData).map((key) => (
                    <label key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                        <input
                            type={key === 'data_nascimento' ? 'date' : 'text'}
                            name={key}
                            value={formData[key] || ''}
                            onChange={handleChange}
                        />
                    </label>
                ))}
                <button type="button" onClick={handleSave}>Salvar</button>
            </form>
        </Modal>
    );
};

export default EditClientModal;
