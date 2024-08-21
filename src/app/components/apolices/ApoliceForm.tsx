import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './ApoliceForm.module.css';
import DadosGerais from './DadosGerais';
import DadosFinanceiros from './DadosFinanceiros';
import CamposEspecificos from './CamposEspecificos';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import EditClientModal from '@/app/components/Modal/profile/EditClientModal'; // Assumindo que você tem esse modal implementado

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
                endpoint = '/apolices/previdencias/';
                break;
            case 'consorcio':
                endpoint = '/apolices/consorcios/';
                break;
            case 'investimento':
                endpoint = '/apolices/investimentos/';
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
        <>
            <form className={styles.form} onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.header}>
                    <FaArrowLeft className={styles.backIcon} onClick={() => router.back()} /> {/* Ícone de voltar */}
                    <h1 className={styles.title}>
                        Criar Nova Apólice para {clientName ? clientName : 'Carregando...'}
                    </h1>
                </div>

                <h2 className={styles.sectionTitle}>Dados Gerais</h2>
                <DadosGerais
                    register={register}
                    handleDropdownSelect={handleDropdownSelect}
                    produto={produto} // Passa o produto selecionado para o componente DadosGerais
                />

                <h2 className={styles.sectionTitle}>Dados Específicos</h2>
                <CamposEspecificos
                    produto={produto}
                    register={register}
                    handleDropdownSelect={handleDropdownSelect}
                />

                <h2 className={styles.sectionTitle}>Dados Financeiros</h2>
                <DadosFinanceiros
                    register={register}
                    handleDropdownSelect={handleDropdownSelect}
                />

                <div className={styles.formGroup}>
                    <label htmlFor="arquivo">Importar Apólice:</label>
                    <input type="file" id="arquivo" accept=".pdf" onChange={handleFileChange} className={styles.fileInput} />
                </div>

                <label>Observações</label>
                <textarea {...register('observacoes')} className={styles.textarea}></textarea>

                <button type="submit" className={styles.submitButton}>Salvar Apólice</button>
                {errorMessage && <p className={styles.errorMessage}>{typeof errorMessage === 'string' ? errorMessage : 'Ocorreu um erro.'}</p>}
            </form>

            {/* Modal para capturar os campos faltantes */}
            <EditClientModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                initialData={{}} // Aqui você pode passar os dados iniciais se necessário
                onSave={handleSaveClient}
            />
        </>
    );
};

export default ApoliceForm;
