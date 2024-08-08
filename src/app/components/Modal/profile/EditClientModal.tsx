import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './EditClientModal.module.css';
import { buscaEnderecoPorCEP } from '@/utils/cep';
import { profissoes } from '@/utils/profissoes';
import { applyCPFMask, formatIdentity } from '@/utils/utils';

interface EditClientModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    initialData: any;
    onSave: (data: any) => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onRequestClose, initialData, onSave }) => {
    const [formData, setFormData] = useState(initialData);
    const [filteredProfissoes, setFilteredProfissoes] = useState(profissoes);
    const [filter, setFilter] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    useEffect(() => {
        const filtered = profissoes.filter(profissao =>
            profissao.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredProfissoes(filtered);
    }, [filter]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('endereco.')) {
            const enderecoKey = name.split('.')[1];
            setFormData({
                ...formData,
                endereco: {
                    ...formData.endereco,
                    [enderecoKey]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: name === 'cpf' ? applyCPFMask(value) :
                    name === 'identidade' ? formatIdentity(value) :
                        value
            });
        }
    };

    const handleSave = () => {
        const updatedData = Object.keys(formData).reduce((acc, key) => {
            if (formData[key] !== initialData[key]) {
                acc[key] = formData[key];
            }
            return acc;
        }, {} as any);

        onSave(updatedData);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setFormData({ ...formData, profissao: e.target.value });
    };

    const handleProfissaoSelect = (profissao: string) => {
        setFormData({ ...formData, profissao });
        setFilter(profissao);
        setShowDropdown(false);
    };

    const handleCEPBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const endereco = await buscaEnderecoPorCEP(cep);
                setFormData({
                    ...formData,
                    endereco: {
                        ...formData.endereco,
                        cep: endereco.cep,
                        logradouro: endereco.logradouro,
                        bairro: endereco.bairro,
                        cidade: endereco.localidade,
                        uf: endereco.uf,
                    }
                });
            } catch (error) {
                console.error(error.message);
            }
        }
    };

    const formatLabel = (label: string) => {
        return label.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
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
                {Object.keys(formData).map((key) => {
                    if (key === 'id' || key === 'user') {
                        return null; // Oculta os campos 'id' e 'user'
                    }
                    if (key === 'sexo') {
                        return (
                            <label key={key}>
                                {formatLabel(key)}:
                                <select name={key} value={formData[key]} onChange={handleChange}>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </label>
                        );
                    } else if (key === 'profissao') {
                        return (
                            <label key={key} className={styles.profissaoLabel}>
                                {formatLabel(key)}:
                                <input
                                    type="text"
                                    placeholder="Filtrar profissões"
                                    value={filter}
                                    onChange={handleFilterChange}
                                    className={styles.filterInput}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                />
                                {showDropdown && filteredProfissoes.length > 0 && (
                                    <ul className={styles.dropdown}>
                                        {filteredProfissoes.map((profissao) => (
                                            <li
                                                key={profissao}
                                                onMouseDown={() => handleProfissaoSelect(profissao)}
                                            >
                                                {profissao}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </label>
                        );
                    } else if (key === 'endereco' && typeof formData[key] === 'object' && formData[key] !== null) {
                        return (
                            <div key={key} className={styles.enderecoSection}>
                                {Object.keys(formData[key]).map((enderecoKey) => (
                                    <label key={enderecoKey}>
                                        {formatLabel(enderecoKey)}:
                                        <input
                                            type="text"
                                            name={`endereco.${enderecoKey}`}
                                            value={formData[key][enderecoKey] || ''}
                                            onChange={handleChange}
                                            onBlur={enderecoKey === 'cep' ? handleCEPBlur : undefined}
                                        />
                                    </label>
                                ))}
                            </div>
                        );
                    } else {
                        return (
                            <label key={key}>
                                {formatLabel(key)}:
                                <input
                                    type={key === 'data_nascimento' ? 'date' : 'text'}
                                    name={key}
                                    value={formData[key] || ''}
                                    onChange={handleChange}
                                />
                            </label>
                        );
                    }
                })}
                <button type="button" onClick={handleSave}>Salvar</button>
            </form>
        </Modal>
    );
};

export default EditClientModal;
