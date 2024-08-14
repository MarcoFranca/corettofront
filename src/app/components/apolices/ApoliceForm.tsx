import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './ApoliceForm.module.css';

interface ApoliceFormProps {
    onSubmit: (data: any, endpoint: string) => void;
    produtoInicial?: string;
}

const ApoliceForm: React.FC<ApoliceFormProps> = ({ onSubmit, produtoInicial }) => {
    const { register, handleSubmit, watch } = useForm();
    const [file, setFile] = useState<File | null>(null);
    const produto = watch('produto', produtoInicial || 'plano_saude');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const renderCamposEspecificos = () => {
        switch (produto) {
            case 'plano_saude':
                return (
                    <>
                        <label>Categoria</label>
                        <input {...register('categoria')} />
                        <label>Acomodação</label>
                        <input {...register('acomodacao')} />
                        <label>Abrangência</label>
                        <input {...register('abrangencia')} />
                        <label>Valor Reembolso Consulta</label>
                        <input type="number" {...register('valor_reembolso_consulta')} />
                        <label>Coparticipação</label>
                        <input type="checkbox" {...register('coparticipacao')} />
                    </>
                );
            case 'seguro_vida':
                return (
                    <>
                        <label>Subcategoria</label>
                        <input {...register('subcategoria')} />
                        <label>Beneficiário</label>
                        <input {...register('beneficiario')} />
                        <label>Capital Segurado</label>
                        <input type="number" {...register('capital_segurado')} />
                    </>
                );
            // Adicione mais casos para cada tipo de apólice
            default:
                return null;
        }
    };

    const onSubmitForm = (data: any) => {
        if (file) {
            data.arquivo = file; // Adiciona o arquivo aos dados do formulário
        }

        // Defina o endpoint com base no produto selecionado
        let endpoint = '';
        switch (produto) {
            case 'plano_saude':
                endpoint = '/apolices/planos-saude/';
                break;
            case 'seguro_vida':
                endpoint = '/apolices/seguros-vida/';
                break;
            case 'previdencia':
                endpoint = '/apolices/previdencias/';
                break;
            case 'consorcio':
                endpoint = '/apolices/consorcios/';
                break;
            case 'investimento':
                endpoint = '/apolices/investimentos/';
                break;
            case 'seguro_profissional':
                endpoint = '/apolices/seguros-profissionais/';
                break;
            case 'seguro_residencial':
                endpoint = '/apolices/seguros-residenciais/';
                break;
            default:
                console.error('Produto não reconhecido.');
                return;
        }

        onSubmit(data, endpoint);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmitForm)}>
            <label>Produto</label>
            <select {...register('produto')}>
                <option value="plano_saude">Plano de Saúde</option>
                <option value="seguro_vida">Seguro de Vida</option>
                <option value="previdencia">Previdência</option>
                <option value="consorcio">Consórcio</option>
                <option value="investimento">Investimento</option>
                <option value="seguro_profissional">Seguro Profissional</option>
                <option value="seguro_residencial">Seguro Residencial</option>
            </select>

            <label>Seguradora</label>
            <input {...register('seguradora')} />

            <label>Data Início</label>
            <input type="date" {...register('data_inicio')} />

            <label>Data Vencimento</label>
            <input type="date" {...register('data_vencimento')} />

            <label>Prêmio Pago</label>
            <input type="number" {...register('premio_pago')} />

            <label>Periodicidade Pagamento</label>
            <select {...register('periodicidade_pagamento')}>
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
            </select>

            <label>Forma Pagamento</label>
            <select {...register('forma_pagamento')}>
                <option value="cartao">Cartão</option>
                <option value="debito_conta">Débito em Conta</option>
                <option value="boleto">Boleto</option>
                <option value="pix">Pix</option>
                <option value="outros">Outros</option>
            </select>

            {renderCamposEspecificos()}

            <div className={styles.formGroup}>
                <label htmlFor="arquivo">Importar Apólice:</label>
                <input type="file" id="arquivo" accept=".pdf" onChange={handleFileChange} />
            </div>

            <label>Observações</label>
            <textarea {...register('observacoes')}></textarea>

            <button type="submit">Salvar Apólice</button>
        </form>
    );
};

export default ApoliceForm;
