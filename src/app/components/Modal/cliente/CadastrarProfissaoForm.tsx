import React, { useState, useEffect } from 'react';
import Input from '@/app/components/global/Input';
import Button from '@/app/components/global/Button';
import Select from 'react-select'; // Usando react-select
import api from '@/app/api/axios';
import { toast } from 'react-toastify';
import styles from './styles.module.css'
import {Profissao} from "@/types/interfaces";


interface CadastrarProfissaoFormProps {
    onSuccess: (novaProfissao: Profissao) => void;
}

const CadastrarProfissaoForm: React.FC<CadastrarProfissaoFormProps> = ({ onSuccess }) => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoriaPai, setCategoriaPai] = useState<Profissao | null>(null); // Atualizado para Profissao
    const [profissoesPrincipais, setProfissoesPrincipais] = useState<Profissao[]>([]);

    // Buscar profissões principais ao montar o componente
    useEffect(() => {
        const fetchProfissoes = async () => {
            try {
                const response = await api.get('/profissoes?categoria_pai='); // Filtra somente as profissões principais
                setProfissoesPrincipais(response.data);
            } catch (error) {
                console.error('Erro ao buscar profissões principais:', error);
                toast.error('Erro ao carregar profissões principais.');
            }
        };

        fetchProfissoes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Impede o comportamento padrão
        if (!nome.trim()) {
            toast.error('O nome da profissão é obrigatório.');
            return;
        }

        try {
            const response = await api.post('/profissoes/', {
                nome,
                descricao,
                categoria_pai: categoriaPai?.id || null,
            });
            toast.success('Profissão cadastrada com sucesso!');
            onSuccess(response.data); // Certifique-se de que o onSuccess não feche o modal antes de tudo ser executado
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
        <form onSubmit={handleSubmit} className={styles.form}>
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
                options={profissoesPrincipais.map((profissao) => ({
                    value: profissao.id,
                    label: profissao.nome,
                }))}
                value={
                    categoriaPai
                        ? { value: categoriaPai.id, label: categoriaPai.nome }
                        : null
                }
                onChange={(selectedOption) =>
                    setCategoriaPai(
                        selectedOption
                            ? profissoesPrincipais.find((prof) => prof.id === selectedOption.value) || null
                            : null
                    )
                }
                placeholder="Selecione uma categoria pai (opcional)"
                isClearable
                isSearchable
            />
            <Button variant="primary" type="submit">
                Cadastrar
            </Button>
        </form>
    );
};

export default CadastrarProfissaoForm;
