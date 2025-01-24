import React, { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal/simpleModal';
import Input from '@/app/components/global/Input';
import Select from '@/app/components/global/Select';
import Button from '@/app/components/global/Button';
import api from '@/app/api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './LeadModal.module.css';
import CadastrarProfissaoForm from "@/app/components/Modal/cliente/CadastrarProfissaoForm";

interface LeadModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSubmit: (leadData: any) => void;
}

interface Profissao {
    id: string;
    nome: string;
    descricao?: string;
    categoria_pai?: string | null;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onRequestClose, onSubmit }) => {
    const [nome, setNome] = useState('');
    const [genero, setGenero] = useState<'M' | 'F' | ''>('');
    const [profissaoPrincipal, setProfissaoPrincipal] = useState('');
    const [subcategoria, setSubcategoria] = useState('');
    const [profissoesPrincipais, setProfissoesPrincipais] = useState<Profissao[]>([]);
    const [subcategorias, setSubcategorias] = useState<Profissao[]>([]);
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [isProfissaoModalOpen, setProfissaoModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            api.get('/profissoes/')
                .then((response) => setProfissoesPrincipais(response.data))
                .catch((error) => {
                    console.error('Erro ao carregar profissões:', error);
                    toast.error('⚠️ Erro ao carregar as profissões. Tente novamente mais tarde.');
                });
        }
    }, [isOpen]);

    const handleProfissaoPrincipalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProfissaoId = e.target.value;
        setProfissaoPrincipal(selectedProfissaoId);

        if (selectedProfissaoId) {
            api.get(`/profissoes/${selectedProfissaoId}/subcategorias/`)
                .then((response) => setSubcategorias(response.data))
                .catch((error) => {
                    console.error('Erro ao carregar subcategorias:', error);
                    toast.error('⚠️ Erro ao carregar subcategorias. Tente novamente mais tarde.');
                });
        } else {
            setSubcategorias([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const leadData = {
            nome,
            genero,
            profissao_id: subcategoria || profissaoPrincipal,
            telefone,
            email,
            status: 'lead',
            pipeline_stage: 'leads de entrada',
        };

        try {
            const response = await api.post('/clientes/', leadData);
            toast.success('Lead cadastrado com sucesso! 😃');
            onSubmit(response.data); // Envia os dados para o componente pai
            onRequestClose(); // Fecha o modal
        } catch (error: any) {
            console.error('⚠️ Erro ao cadastrar lead:', error);
            if (error.response && error.response.headers['content-type']?.includes('text/html')) {
                toast.error('⚠️ Erro interno do servidor. Por favor, tente novamente mais tarde.');
            } else if (error.response && error.response.data) {
                // Trata erros JSON do backend
                const errorData = error.response.data;
                const messages = Object.entries(errorData)
                    .map(([field, message]) => `${field}: ${message}`)
                    .join(' | ');
                toast.error(`Erro: ${messages}`);
            } else {
                toast.error('Erro de conexão. Tente novamente mais tarde.');
            }
        }
    };

    return (
        <>
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
                        value={genero}
                        onChange={(e) => setGenero(e.target.value as 'M' | 'F')}
                        title="Selecione um Gênero"
                        options={[
                            { value: 'M', label: 'Masculino' },
                            { value: 'F', label: 'Feminino' },
                        ]}
                        required
                    />
                    <div className={styles.profissaoWrapper}>
                        <Select
                            label="Profissão Principal"
                            value={profissaoPrincipal}
                            onChange={handleProfissaoPrincipalChange}
                            title="Selecione uma profissão"
                            options={profissoesPrincipais.map((p) => ({ value: p.id, label: p.nome }))}
                            required
                        />
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setProfissaoModalOpen(true)}
                        >
                            Cadastrar Nova Profissão
                        </Button>
                    </div>
                    {subcategorias.length > 0 && (
                        <Select
                            label="Subcategoria"
                            value={subcategoria}
                            onChange={(e) => setSubcategoria(e.target.value)}
                            title="Selecione uma subcategoria"
                            options={subcategorias.map((s) => ({ value: s.id, label: s.nome }))}
                        />
                    )}
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

            {isProfissaoModalOpen && (
                <Modal
                    show={isProfissaoModalOpen}
                    onClose={() => setProfissaoModalOpen(false)}
                    title="Cadastrar Nova Profissão"
                >
                    <CadastrarProfissaoForm
                        onSuccess={(novaProfissao) => {
                            setProfissoesPrincipais((prev) => [...prev, novaProfissao]);
                            setProfissaoModalOpen(false);
                        }}
                    />
                </Modal>
            )}
        </>
    );
};

export default LeadModal;
