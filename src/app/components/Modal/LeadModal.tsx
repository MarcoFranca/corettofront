import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createLead } from '@/store/slices/leadsSlice';
import Modal from '@/app/components/Modal/simpleModal';
import Input from '@/app/components/global/Input';
import Button from '@/app/components/global/Button';
import { toast } from 'react-toastify';
import Select from 'react-select';
import InputMask from 'react-input-mask';
import api from '@/app/api/axios';
import styles from './LeadModal.module.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { AppDispatch } from '@/store';
import { Lead } from '@/types/interfaces';
import CadastrarProfissaoForm from "@/app/components/Modal/cliente/CadastrarProfissaoForm";
import { Profissao } from '@/types/interfaces';

interface LeadModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

interface ProfissaoOption {
    value: string;
    label: string;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onRequestClose }) => {
    const dispatch: AppDispatch = useDispatch();

    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [genero, setGenero] = useState<'M' | 'F' | ''>('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [profissaoPrincipal, setProfissaoPrincipal] = useState<ProfissaoOption | null>(null);
    const [subcategoria, setSubcategoria] = useState<ProfissaoOption | null>(null);
    const [profissoesPrincipais, setProfissoesPrincipais] = useState<ProfissaoOption[]>([]);
    const [subcategorias, setSubcategorias] = useState<ProfissaoOption[]>([]);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [isProfissaoModalOpen, setProfissaoModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchProfissoes();
        }
    }, [isOpen]);

    const fetchProfissoes = async () => {
        try {
            const response = await api.get('/profissoes/');
            setProfissoesPrincipais(
                response.data.map((profissao: any) => ({
                    value: profissao.id,
                    label: profissao.nome,
                }))
            );
        } catch (error) {
            toast.error('😔 Erro ao carregar profissões.');
        }
    };

    const handleProfissaoPrincipalChange = (selectedOption: ProfissaoOption | null) => {
        setProfissaoPrincipal(selectedOption);

        if (selectedOption) {
            fetchSubcategorias(selectedOption.value);
        } else {
            setSubcategorias([]);
        }
    };

    const fetchSubcategorias = async (profissaoId: string) => {
        try {
            const response = await api.get(`/profissoes/${profissaoId}/subcategorias/`);
            setSubcategorias(
                response.data.map((subcategoria: any) => ({
                    value: subcategoria.id,
                    label: subcategoria.nome,
                }))
            );
        } catch (error) {
            toast.error('😔 Erro ao carregar subcategorias.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!genero) {
            setFieldErrors((prev) => ({ ...prev, genero: 'Por favor, selecione um gênero.' }));
            toast.error('⚠️ Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const formattedTelefone = telefone.replace(/\D/g, '');

        const leadData: Partial<Lead> = {
            nome,
            sobre_nome: sobrenome || undefined,
            genero,
            telefone: formattedTelefone,
            email,
            profissao_id: subcategoria?.value || profissaoPrincipal?.value || null,
        };

        try {
            await dispatch(createLead(leadData)).unwrap();
            toast.success('Lead cadastrado com sucesso! 🎉😃');
            onRequestClose();
            resetForm();
        } catch (error: any) {
            if (error.response?.data) {
                setFieldErrors(error.response.data);
            } else {
                toast.error('⚠️ Erro ao cadastrar lead.');
                console.error('⚠️ Erro desconhecido:', error);
            }
        }
    };

    const resetForm = () => {
        setNome('');
        setSobrenome('');
        setGenero('');
        setTelefone('');
        setEmail('');
        setProfissaoPrincipal(null);
        setSubcategoria(null);
        setFieldErrors({});
    };

    return (
        <Modal show={isOpen} onClose={onRequestClose} title="Cadastrar Lead">
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.nameContainer}>
                    <Input
                        label="Nome"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        className={fieldErrors.nome ? styles.error : ''}
                        errorMessage={fieldErrors.nome}
                    />
                    <Input
                        label="Sobrenome"
                        type="text"
                        value={sobrenome}
                        onChange={(e) => setSobrenome(e.target.value)}
                        className={fieldErrors.sobrenome ? styles.error : ''}
                        errorMessage={fieldErrors.sobrenome}
                        required={false}
                    />
                </div>
                <Select
                    options={[
                        { value: 'M', label: 'Masculino' },
                        { value: 'F', label: 'Feminino' },
                    ]}
                    value={
                        genero
                            ? { value: genero, label: genero === 'M' ? 'Masculino' : 'Feminino' }
                            : null
                    }
                    onChange={(selectedOption) =>
                        setGenero((selectedOption as ProfissaoOption)?.value as 'M' | 'F')
                    }
                    placeholder="Selecione o Gênero *"
                    classNamePrefix="custom-select"
                    className={fieldErrors.genero ? `${styles.errorSelect}` : ''}
                />
                {fieldErrors.genero && <div className={styles.errorMessage}>{fieldErrors.genero}</div>}
                <Select
                    options={profissoesPrincipais}
                    value={profissaoPrincipal}
                    onChange={handleProfissaoPrincipalChange}
                    placeholder="Selecione uma profissão..."
                    isSearchable
                    classNamePrefix="custom-select"
                />
                {subcategorias.length > 0 && (
                    <Select
                        options={subcategorias}
                        value={subcategoria}
                        onChange={(selectedOption) => setSubcategoria(selectedOption)}
                        placeholder="Selecione uma subcategoria..."
                        isSearchable
                    />
                )}
                <button
                    type="button"
                    onClick={() => setProfissaoModalOpen(true)}
                    className={styles.cadastrarProfissao}
                >
                    <AiOutlinePlus style={{ marginRight: '5px' }} />
                    Cadastrar Nova Profissão
                </button>
                <InputMask
                    mask="(99) 99999-9999"
                    value={telefone}
                    maskChar={null}
                    onChange={(e) => setTelefone(e.target.value)}
                >
                    {(inputProps: any) => (
                        <Input
                            {...inputProps}
                            label="Telefone"
                            type="text"
                            className={fieldErrors.telefone ? styles.error : ''}
                            errorMessage={fieldErrors.telefone}
                            required
                        />
                    )}
                </InputMask>
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldErrors.email ? styles.error : ''}
                    errorMessage={fieldErrors.email}
                />
                <Button variant="primary" type="submit">
                    Cadastrar Lead
                </Button>
            </form>
            {isProfissaoModalOpen && (
                <Modal
                    show={isProfissaoModalOpen}
                    onClose={() => setProfissaoModalOpen(false)}
                    title="Cadastrar Nova Profissão"
                >
                    <CadastrarProfissaoForm
                        onSuccess={(novaProfissao: Profissao) => {
                            setProfissoesPrincipais((prev) => [
                                ...prev,
                                { value: novaProfissao.id, label: novaProfissao.nome },
                            ]);
                            setProfissaoModalOpen(false);
                        }}
                    />
                </Modal>
            )}
        </Modal>
    );
};

export default LeadModal;
