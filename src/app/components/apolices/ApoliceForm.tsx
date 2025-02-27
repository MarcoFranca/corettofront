import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './ApoliceForm.module.css';
import DadosGerais from './DadosGerais';
import DadosFinanceiros from './DadosFinanceiros';
import CamposEspecificos from './CamposEspecificos';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import EditClientModal from '@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(contact)/EditClientModal'; // Assumindo que você tem esse modal implementado

interface ApoliceFormProps {
    onSubmit: (data: any, endpoint: string) => void;
    errorMessage?: string | null;
    clientName?: string;
}

const ApoliceForm: React.FC<ApoliceFormProps> = ({ onSubmit, errorMessage, clientName }) => {
    const { register, handleSubmit, setValue, watch } = useForm();
    const [file, setFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal
    const produto = watch('produto', 'plano_saude'); // O produto selecionado é monitorado aqui
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleDropdownSelect = (name: string, value: string) => {
        setValue(name, value);
    };

    const onSubmitForm = (data: any) => {
        if (!data.numero_apolice || !data.produto || !data.data_inicio || !data.data_vencimento || !data.premio_pago) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        data.numero_apolice = parseInt(data.numero_apolice, 10);
        data.premio_pago = parseFloat(data.premio_pago);

        switch (produto) {
            case 'plano_saude':
                data.valor_reembolso_consulta = parseFloat(data.valor_reembolso_consulta);
                break;
            case 'seguro_vida':
                data.capital_segurado = parseFloat(data.capital_segurado);
                break;
            case 'previdencia':
                data.valor_acumulado = parseFloat(data.valor_acumulado);
                break;
            case 'consorcio':
                data.valor_carta = parseFloat(data.valor_carta);
                break;
            case 'investimento':
                data.valor_investido = parseFloat(data.valor_investido);
                break;
            case 'seguro_profissional':
            case 'seguro_residencial':
                data.franquia = parseFloat(data.franquia);
                break;
            default:
                console.error('Produto não reconhecido.');
                return;
        }

        if (file) {
            data.arquivo = file;
        }

        let endpoint = '';
        switch (produto) {
            case 'plano_saude':
                endpoint = '/apolices/plano_saude/';
                break;
            case 'seguro_vida':
                endpoint = '/apolices/seguro_vida/';
                break;
            case 'previdencia':
                endpoint = '/apolices/previdencia/';
                break;
            case 'consorcio':
                endpoint = '/apolices/consorcio/';
                break;
            case 'investimento':
                endpoint = '/apolices/investimento/';
                break;
            case 'seguro_profissional':
                endpoint = '/apolices/seguro_profissional/';
                break;
            case 'seguro_residencial':
                endpoint = '/apolices/seguro_residencial/';
                break;
            default:
                console.error('Produto não reconhecido.');
                return;
        }

        onSubmit(data, endpoint);
    };

    // Verificar o erro e abrir o modal se necessário
    useEffect(() => {
        if (errorMessage && errorMessage.includes("obrigatório")) {
            setIsModalOpen(true); // Abre o modal se houver erro de campos obrigatórios
        }
    }, [errorMessage]);

    const handleSaveClient = (updatedData: any) => {
        // Aqui você enviaria os dados atualizados para o backend
        setIsModalOpen(false);
        // Depois de atualizar o cliente, tente criar a apólice novamente
        onSubmitForm(updatedData);
    };

    return (
        <div className={styles.containerForm}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.header}>
                    <FaArrowLeft className={styles.backIcon} onClick={() => router.back()}/> {/* Ícone de voltar */}
                    <h1 className={styles.title}>
                        Criar Nova Apólice para <span className={styles.titleHeader}>{clientName}</span>
                    </h1>
                </div>

                <div className={styles.sessionCard}>
                    <h2 className={styles.sectionTitle}>Dados Gerais</h2>
                    <DadosGerais
                        register={register}
                        handleDropdownSelect={handleDropdownSelect}
                        produto={produto} // Passa o produto selecionado para o componente DadosGerais
                        initialValues={{
                            produto:  '',
                            seguradora:  '',
                        }}
                    />
                </div>
                <div className={styles.sessionCard}>

                    <h2 className={styles.sectionTitle}>Dados Específicos</h2>
                    <CamposEspecificos
                        produto={produto}
                        register={register}
                        handleDropdownSelect={handleDropdownSelect}
                        initialValues={{
                            produto: '',
                            acomodacao: '',
                            categoria: '',
                            contratacao: '',
                            tributacao: '',
                            abrangencia: '',
                            nomeFundo:'',
                            valorCarta:'',
                            valorInvestido:'',
                            beneficiario:'',
                            capitalSegurado:'',
                            franquia:'',
                            fundo:'',
                            observacoes :'',
                            subcategoria:'',
                            valorAcumulado:'',
                            valorReembolso:'',

                        }}
                    />
                </div>
                <div className={styles.sessionCard}>

                    <h2 className={styles.sectionTitle}>Dados Financeiros</h2>
                    <DadosFinanceiros
                        register={register}
                        handleDropdownSelect={handleDropdownSelect}
                        setValue={setValue}
                        watch={watch}
                        initialValues={{
                            premio_pago: '',
                            periodicidade_pagamento: '',
                            forma_pagamento: ''
                        }}
                    />

                </div>
                <div className={styles.sessionCard}>

                    <div className={styles.formGroup}>
                        <label htmlFor="arquivo">Importar Apólice:</label>
                        <input type="file" id="arquivo" accept=".pdf" onChange={handleFileChange}
                               className={styles.fileInput}/>
                    </div>
                </div>

                <label>Observações</label>
                <textarea {...register('observacoes')} className={styles.textarea}></textarea>

                <button type="submit" className={styles.submitButton}>Salvar Apólice</button>
                {errorMessage &&
                    <p className={styles.errorMessage}>{typeof errorMessage === 'string' ? errorMessage : 'Ocorreu um erro.'}</p>}
            </form>

            {/* Modal para capturar os campos faltantes */}
            <EditClientModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                initialData={{
                    email: '',
                    telefone: '',
                    contatos_adicionais: [] // 🔥 Certifique-se de que é um array
                }}
                onSave={handleSaveClient}
            />
        </div>
    );
};

export default ApoliceForm;
