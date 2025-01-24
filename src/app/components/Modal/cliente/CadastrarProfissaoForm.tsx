import React, { useState, useEffect } from 'react';
import Input from '@/app/components/global/Input';
import Select from '@/app/components/global/Select';
import Button from '@/app/components/global/Button';
import api from '@/app/api/axios';
import {toast} from "react-toastify"; // Configure para acessar a API

interface Profissao {
    id: string;
    nome: string;
}

interface CadastrarProfissaoFormProps {
    onSuccess: (novaProfissao: Profissao) => void;
}

const CadastrarProfissaoForm: React.FC<CadastrarProfissaoFormProps> = ({ onSuccess }) => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoriaPai, setCategoriaPai] = useState<string | null>(null);
    const [profissoesPrincipais, setProfissoesPrincipais] = useState<Profissao[]>([]);

    // Buscar profissões principais ao montar o componente
    useEffect(() => {
        const fetchProfissoes = async () => {
            try {
                const response = await api.get('/profissoes?categoria_pai='); // Filtra somente as profissões principais
                setProfissoesPrincipais(response.data);
            } catch (error) {
                console.error('Erro ao buscar profissões principais:', error);
            }
        };

        fetchProfissoes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome.trim()) {
            toast.error('O nome da profissão é obrigatório.');
            return;
        }

        try {
            const response = await api.post('/profissoes/', {
                nome,
                descricao,
                categoria_pai: categoriaPai,
            });
            toast.success('Profissão cadastrada com sucesso!');
            onSuccess(response.data);
        } catch (error: any) {
        console.error('Erro ao cadastrar profissão:', error);
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.detail || 'Erro ao cadastrar a profissão.';
            toast.error(errorMessage);
        } else {
            toast.error('Erro de conexão. Tente novamente mais tarde.');
        }
    }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Nome da Profissão"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
            />
            <Input
                label="Descrição"
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
            />
            <Select
                label="Categoria Pai"
                value={categoriaPai || ''}
                onChange={(e) => setCategoriaPai(e.target.value || null)}
                title={'Categoria Pai (opcional)'}
                options={[
                    ...profissoesPrincipais.map((profissao) => ({
                        value: profissao.id,
                        label: profissao.nome,
                    })),
                ]}
            />
            <Button variant="primary" type="submit">
                Cadastrar
            </Button>
        </form>
    );
};

export default CadastrarProfissaoForm;
