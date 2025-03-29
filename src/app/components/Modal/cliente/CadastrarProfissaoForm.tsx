import React, { useState, useEffect } from 'react';
import { UseFormReturn } from "react-hook-form";
import FloatingMaskedInput from '@/app/components/ui/input/FloatingMaskedInput';
import Select from 'react-select';
import api from '@/app/api/axios';
import { toast } from 'react-toastify';
import styles from './styles.module.css';
import { Profissao } from "@/types/interfaces";
import { CATEGORIAS_MACRO } from '@/constants/categoriasMacro';
import { SingleValue } from 'react-select';
import SelectProfissao from "@/app/components/ui/select/SelectProfissao/SelectProfissao";

interface CadastrarProfissaoFormProps {
    onSuccess: (novaProfissao: Profissao) => void;
    methods: UseFormReturn<any>;
}

const CadastrarProfissaoForm: React.FC<CadastrarProfissaoFormProps> = ({ methods }) => {
    const { register, watch, setValue, control, formState: { errors } } = methods;

    const [profissoesPrincipais, setProfissoesPrincipais] = useState<Profissao[]>([]);
    const categoriaPaiSelecionada = watch("categoria_pai");

    useEffect(() => {
        register("categoria_macro");
        register("descricao");
        register("categoria_pai");
    }, [register]);


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
        <div className={styles.form}>
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
                options={CATEGORIAS_MACRO}
                value={CATEGORIAS_MACRO.find(opt => opt.value === watch("categoria_macro")) || null}
                onChange={(selectedOption: SingleValue<{ label: string; value: string }>) => {
                    setValue("categoria_macro", selectedOption?.value || null, { shouldValidate: true });
                }}
                placeholder="Selecione a categoria macro"
                isClearable
                className={styles.customSelectSpacing}
            />

            <SelectProfissao
                name="categoria_pai"
                control={control}
                placeholder="Selecione uma categoria pai (opcional)"
                showLabel={false}
                required={false}
                errorMessage={
                    typeof errors.categoria_pai?.message === "string"
                        ? errors.categoria_pai.message
                        : undefined
                }
                options={profissoesPrincipais
                    .filter((p) => !p.categoria_pai) // 🔥 mostra só profissões principais
                    .map((profissao) => ({
                        value: profissao.id,
                        label: profissao.nome,
                    }))
                }
            />
        </div>
    );
};

export default CadastrarProfissaoForm;
