import React, { useState, useEffect } from 'react';
import { UseFormReturn } from "react-hook-form";
import FloatingMaskedInput from '@/app/components/ui/input/FloatingMaskedInput';
import Button from '@/app/components/ui/Button';
import Select from 'react-select';
import api from '@/app/api/axios';
import { toast } from 'react-toastify';
import styles from './styles.module.css';
import { Profissao } from "@/types/interfaces";

interface CadastrarProfissaoFormProps {
    onSuccess: (novaProfissao: Profissao) => void; // ✅ Agora `onSuccess` está sendo corretamente tipado
    methods: UseFormReturn<any>;
}

const CadastrarProfissaoForm: React.FC<CadastrarProfissaoFormProps> = ({ onSuccess, methods }) => {
    const { register, watch, handleSubmit, setValue, control, formState: { errors } } = methods;

    const [profissoesPrincipais, setProfissoesPrincipais] = useState<Profissao[]>([]);
    const [categoriaPai, setCategoriaPai] = useState<Profissao | null>(null);

    const categoriaPaiSelecionada = watch("categoria_pai");

    // 🔥 Buscar profissões principais ao montar o componente
    useEffect(() => {
        const fetchProfissoes = async () => {
            try {
                const response = await api.get('/profissoes?categoria_pai=');
                setProfissoesPrincipais(response.data);
            } catch (error) {
                console.error('Erro ao buscar profissões principais:', error);
                toast.error('Erro ao carregar profissões principais.');
            }
        };
        fetchProfissoes();
    }, []);


    return (
        <div>
            <FloatingMaskedInput
                name="nome"
                label="Nome da Profissão"
                type="text"
                required
                control={control}
                setValue={setValue}
                register={register}
                errorMessage={errors.nome?.message as string | undefined}
            />

            <FloatingMaskedInput
                name="descricao"
                label="Descrição"
                type="text"
                control={control}
                setValue={setValue}
                register={register}
                errorMessage={errors.descricao?.message as string | undefined}
            />

            <Select
                options={profissoesPrincipais.map((profissao) => ({
                    value: profissao.id,
                    label: profissao.nome,
                }))}
                value={categoriaPaiSelecionada}
                onChange={(selectedOption) => {
                    console.log("📌 Categoria pai selecionada:", selectedOption);
                    setValue("categoria_pai", selectedOption || null, { shouldValidate: true });
                }}
                placeholder="Selecione uma categoria pai (opcional)"
                isClearable
                isSearchable
                className={styles.customSelectSpacing}
            />

        </div>
    );
};

export default CadastrarProfissaoForm;
