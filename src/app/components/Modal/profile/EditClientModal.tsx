import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from '@/app/components/cliente/conta/ClientProfile.module.css';
import { buscaEnderecoPorCEP } from '@/utils/cep';
import { profissoes } from '@/utils/profissoes';
import { applyCPFMask, formatIdentity, removeCPFMask, removeIdentityMask } from '@/utils/utils';

interface EditClientModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    initialData: any;
    onSave: (data: any) => void;
    title?: string;  // Novo campo para o título do modal
    requiredFields?: string[];  // Novo campo para os campos obrigatórios a serem exibidos
}

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onRequestClose, initialData, onSave, title, requiredFields }) => {
    const [formData, setFormData] = useState(initialData || {}); // Garante que formData nunca seja null
    const [filteredProfissoes, setFilteredProfissoes] = useState(profissoes);
    const [filter, setFilter] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setFormData(initialData || {});  // Garante que o estado nunca seja null
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
        const cleanedData = {
            ...formData,
            cpf: formData.cpf ? removeCPFMask(formData.cpf) : undefined,
            identidade: formData.identidade ? removeIdentityMask(formData.identidade) : undefined,
        };

        const updatedData = Object.keys(cleanedData).reduce((acc, key) => {
            if (cleanedData[key] !== initialData[key]) {
                acc[key] = cleanedData[key];
            }
            return acc;
        }, {} as any);

        // Remover campos vazios
        Object.keys(updatedData).forEach(key => {
            if (updatedData[key] === undefined) {
                delete updatedData[key];
            }
        });

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
            } catch (error: any) {
                console.error('Erro ao buscar endereço:', error.message);
            }
        }
    };

    const formatLabel = (label: string) => {
        return label.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    // Filtrar os campos que devem ser exibidos com base na lista de requiredFields
    const fieldsToShow = requiredFields ? requiredFields : Object.keys(formData);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={title || "Atualizar Dados do Cliente"}
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <h2 className={styles.modalTitle}>{title || "Atualizar Dados do Cliente"}</h2>
            <form>
                {fieldsToShow.map((key) => {
                    if (key === 'id' || key === 'user') {
                        return null; // Oculta os campos 'id' e 'user'
                    }
                    if (key === 'sexo') {
                        return (
                            <label key={key}>
                                {formatLabel(key)}:
                                <select name={key} value={formData[key] || ''} onChange={handleChange}>
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
                                            value={formData[key]?.[enderecoKey] || ''}
                                            onChange={handleChange}
                                            onBlur={enderecoKey === 'cep' ? handleCEPBlur : undefined}
                                        />
                                    </label>
                                ))}
                            </div>
                        );
                    } else if (key === 'altura' || key === 'peso' || key === 'doenca_preexistente' || key === 'historico_familiar_doencas') {
                        return (
                            <label key={key}>
                                {formatLabel(key)}:
                                <input
                                    type="text"
                                    name={key}
                                    value={formData[key] || ''}
                                    onChange={handleChange}
                                />
                            </label>
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
