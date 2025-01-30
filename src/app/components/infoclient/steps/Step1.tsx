import React, { useState, useEffect } from 'react';
import FloatingLabelInput from '@/app/components/common/input/FloatingLabelInput';
import CustomDropdown from '@/app/components/common/DropDown/CustomDropdown';
import styles from './Step1.module.css'; // Usando o mesmo CSS

interface Filho {
    nome: string;
    data_nascimento?: string;
}

interface Step1Props {
    nextStep?: () => void;
    handleChange: (input: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string) => void;
    formData: {
        nome: string;
        sobreNome: string;
        telefone: string;
        email: string;
        data_nascimento?: string;
        profissao: string;
        estadoCivil: string;
        nomeConjuge?: string;
        dataNascimentoConjuge?: string;
        profissaoConjuge?: string;
        filhos: Filho[];
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const estadoCivilOptions = [
    { value: 'solteiro', label: 'Solteiro' },
    { value: 'casado', label: 'Casado' },
    { value: 'divorciado', label: 'Divorciado' },
];

const Step1: React.FC<Step1Props> = ({ nextStep, handleChange, formData, setFormData }) => {
    const [filhos, setFilhos] = useState<Filho[]>(formData.filhos);

    // Função para adicionar um novo filho
    const adicionarFilho = () => {
        setFilhos([...filhos, { nome: '', data_nascimento: '' }]);
    };

    // Função para remover um filho
    const removerFilho = (index: number) => {
        const novosFilhos = [...filhos];
        novosFilhos.splice(index, 1);
        setFilhos(novosFilhos);
        setFormData((prev: any) => ({ ...prev, filhos: novosFilhos }));
    };

    // Função para atualizar os dados de um filho
    const handleFilhoChange = (index: number, key: string, value: string) => {
        const novosFilhos = [...filhos];
        novosFilhos[index] = { ...novosFilhos[index], [key]: value };
        setFilhos(novosFilhos);
        setFormData((prev: any) => ({ ...prev, filhos: novosFilhos }));
    };

    // Preencher automaticamente os campos de input se os valores já estiverem no formData
    useEffect(() => {
        setFormData((prev: any) => ({
            ...prev,
            nome: formData.nome || '',
            sobreNome: formData.sobreNome || '',
            telefone: formData.telefone || '',
        }));
    }, [formData.nome, formData.sobreNome, formData.telefone, setFormData]);

    return (
        <div className={styles.formGroup}>
            <h2 className={styles.sectionTitle}>Dados do Cliente</h2>
            <div className={styles.fieldGroup}>
                <FloatingLabelInput
                    id="nome"
                    type="text"
                    placeholder="Nome"
                    value={formData.nome}
                    onChange={handleChange('nome')}
                    required
                />
                <FloatingLabelInput
                    id="sobreNome"
                    type="text"
                    placeholder="Sobrenome"
                    value={formData.sobreNome}
                    onChange={handleChange('sobreNome')}
                    required
                />
            </div>
            <div className={styles.fieldGroup}>
                <FloatingLabelInput
                    id="telefone"
                    type="tel"
                    placeholder="Telefone"
                    value={formData.telefone}
                    onChange={handleChange('telefone')}
                    required
                />
                <FloatingLabelInput
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                />
            </div>
            <div className={styles.fieldGroup}>
                <FloatingLabelInput
                    id="dataNascimento"
                    type="date"
                    placeholder="Data de Nascimento"
                    value={formData.data_nascimento}
                    onChange={handleChange('dataNascimento')}
                    required
                />
                <FloatingLabelInput
                    id="profissao"
                    type="text"
                    placeholder="Profissão"
                    value={formData.profissao}
                    onChange={handleChange('profissao')}
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <CustomDropdown
                    options={estadoCivilOptions}
                    placeholder="Estado Civil"
                    onSelect={(value) => handleChange('estadoCivil')(value)}
                    initialValue={formData.estadoCivil}
                />
            </div>

            {/* Campos do Cônjuge aparecem apenas se o estado civil for "Casado" */}
            {formData.estadoCivil === 'casado' && (
                <div className={styles.conjugueFieldGroup}>
                    <h3>Dados do Cônjuge</h3>
                    <div className={styles.conjugueFieldGroupInput}>
                        <FloatingLabelInput
                            id="nomeConjuge"
                            type="text"
                            placeholder="Nome do Cônjuge"
                            value={formData.nomeConjuge || ''}
                            onChange={handleChange('nomeConjuge')}
                        />
                        <FloatingLabelInput
                            id="dataNascimentoConjuge"
                            type="date"
                            placeholder="Data de Nascimento do Cônjuge"
                            value={formData.dataNascimentoConjuge || ''}
                            onChange={handleChange('dataNascimentoConjuge')}
                        />
                        <FloatingLabelInput
                            id="profissaoConjuge"
                            type="text"
                            placeholder="Profissão do Cônjuge"
                            value={formData.profissaoConjuge || ''}
                            onChange={handleChange('profissaoConjuge')}
                        />
                    </div>
                </div>
            )}

            <div className={styles.childrenFieldGroup}>
                <h3>Filhos</h3>
                <div className={styles.childrenFieldGroupInput}>
                    {filhos.map((filho, index) => (
                        <div key={index} className={styles.fieldGroup}>
                            <FloatingLabelInput
                                id={`filho_nome_${index}`}
                                type="text"
                                placeholder="Nome do Filho"
                                value={filho.nome}
                                onChange={(e) => handleFilhoChange(index, 'nome', e.target.value)}
                            />
                            <FloatingLabelInput
                                id={`filho_dataNascimento_${index}`}
                                type="date"
                                placeholder="Data de Nascimento do Filho"
                                value={filho.data_nascimento}
                                onChange={(e) => handleFilhoChange(index, 'dataNascimento', e.target.value)}
                            />
                            <button className={styles.submitButton} type="button" onClick={() => removerFilho(index)}>Remover Filho</button>
                        </div>
                    ))}
                </div>
                <button className={styles.submitButton} type="button" onClick={adicionarFilho}>Adicionar Filho</button>
            </div>

            {nextStep && (
                <button className={styles.submitButton} onClick={nextStep}>Próximo</button>
            )}
        </div>
    );
};

export default Step1;
