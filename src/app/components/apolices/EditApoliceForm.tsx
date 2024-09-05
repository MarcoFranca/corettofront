import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './ApoliceForm.module.css';
import DadosGerais from './DadosGerais';
import DadosFinanceiros from './DadosFinanceiros';
import CamposEspecificos from './CamposEspecificos';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaDownload, FaTrash } from 'react-icons/fa';
import EditClientModal from '@/app/components/Modal/profile/EditClientModal';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchApoliceDetalhe } from '@/store/slices/apoliceSlice';
import { Apolice } from '@/types/interfaces';
import { RootState } from '@/store';

interface ApoliceFormProps {
    apoliceId: string;
    produto: string;
    onSubmit: (data: any, endpoint: string) => void;
    clientId: string;
}

const ApoliceForm: React.FC<ApoliceFormProps> = ({ apoliceId, produto, onSubmit, clientId }) => {
    const { register, handleSubmit, setValue, watch } = useForm();
    const [file, setFile] = useState<File | null>(null);
    const [isFileDeleted, setIsFileDeleted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const apoliceDetalhe = useAppSelector((state: RootState) => state.apolices.apoliceDetalhe);

    // Carregar os dados da apólice ao montar o componente
    useEffect(() => {
        if (apoliceId && produto) {
            dispatch(fetchApoliceDetalhe({ produto, apoliceId }));
        }
    }, [dispatch, apoliceId, produto]);

    // Preencher os campos do formulário com os dados da apólice existente
    useEffect(() => {
        if (apoliceDetalhe) {
            setValue('numero_apolice', apoliceDetalhe.numero_apolice);
            setValue('seguradora', apoliceDetalhe.seguradora);
            setValue('data_inicio', apoliceDetalhe.data_inicio);
            setValue('data_vencimento', apoliceDetalhe.data_vencimento);
            setValue('premio_pago', apoliceDetalhe.premio_pago);
            setValue('forma_pagamento', apoliceDetalhe.forma_pagamento);
            setValue('periodicidade_pagamento', apoliceDetalhe.periodicidade_pagamento);
            setValue('observacoes', apoliceDetalhe.observacoes);
            // Preencher campos específicos
            if (produto === 'plano_saude') {
                setValue('categoria', apoliceDetalhe.categoria);
                setValue('acomodacao', apoliceDetalhe.acomodacao);
                // Continue preenchendo os outros campos conforme necessário
            }
        }
    }, [apoliceDetalhe, setValue]);

    // Função para atualizar os valores dos campos dropdown
    const handleDropdownSelect = (name: string, value: string) => {
        setValue(name, value);  // Atualiza o valor do campo no formulário
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]); // Atualiza o arquivo no estado
            setIsFileDeleted(false); // Se um novo arquivo for carregado, desmarque a exclusão
        }
    };

    const handleDeleteFile = () => {
        setFile(null); // Remove o arquivo novo carregado
        setIsFileDeleted(true); // Marca o arquivo existente como excluído
    };

    const onSubmitForm = (data: any) => {
        if (file) {
            data.arquivo = file; // Anexa o novo arquivo
        } else if (isFileDeleted) {
            data.arquivo = null; // Indica ao backend que o arquivo deve ser removido
        }

        let endpoint = `/apolices/${produto}/`; // Usar o endpoint de edição com o ID da apólice

        onSubmit(data, endpoint);
    };

    return (
        <div className={styles.containerForm}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.header}>
                    <FaArrowLeft className={styles.backIcon} onClick={() => router.back()} /> {/* Ícone de voltar */}
                    <h1 className={styles.title}>
                        Editar Apólice
                    </h1>
                </div>

                <div className={styles.sessionCard}>
                    <h2 className={styles.sectionTitle}>Dados Gerais</h2>
                    <DadosGerais
                        register={register}
                        handleDropdownSelect={handleDropdownSelect}
                        produto={produto}
                        initialValues={{
                            produto: apoliceDetalhe?.produto || '',
                            seguradora: apoliceDetalhe?.seguradora || ''
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
                            produto: apoliceDetalhe?.produto || '',
                            acomodacao: apoliceDetalhe?.acomodacao || '',
                            categoria: apoliceDetalhe?.categoria || '',
                            contratacao: apoliceDetalhe?.regime_contratacao || '',
                            tributacao: apoliceDetalhe?.regime_tributacao || '',
                            abrangencia: apoliceDetalhe?.abrangencia || '',
                            nomeFundo: apoliceDetalhe?.nome_fundo || '',
                            valorInvestido: apoliceDetalhe?.valor_investido || '',
                            valorCarta: apoliceDetalhe?.valor_carta || '',
                            valorReembolso: apoliceDetalhe?.valor_reembolso_consulta || '',
                            valorAcumulado: apoliceDetalhe?.valor_acumulado || '',
                            subcategoria: apoliceDetalhe?.subcategoria || '',
                            observacoes: apoliceDetalhe?.observacoes || '',
                            fundo: apoliceDetalhe?.fundo || '',
                            franquia: apoliceDetalhe?.franquia || '',
                            capitalSegurado: apoliceDetalhe?.capitalSegurado || '',
                            beneficiario: apoliceDetalhe?.beneficiario || '',
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
                            premio_pago: apoliceDetalhe?.premio_pago || '',
                            periodicidade_pagamento: apoliceDetalhe?.periodicidade_pagamento || '',
                            forma_pagamento: apoliceDetalhe?.forma_pagamento || ''
                        }}
                    />
                </div>

                <div className={styles.sessionCard}>
                    <div className={styles.formGroup}>
                        <label htmlFor="arquivo">Importar Apólice:</label>
                        {apoliceDetalhe?.arquivo && !isFileDeleted && (
                            <div className={styles.fileActions}>
                                <a href={apoliceDetalhe.arquivo} target="_blank" rel="noopener noreferrer">
                                    <FaDownload /> Download Apólice
                                </a>
                                <FaTrash className={styles.deleteIcon} onClick={handleDeleteFile} title="Excluir Arquivo" />
                            </div>
                        )}
                        {!apoliceDetalhe?.arquivo || isFileDeleted ? (
                            <input type="file" id="arquivo" accept=".pdf" onChange={handleFileChange} className={styles.fileInput} />
                        ) : null}
                    </div>
                </div>

                <label>Observações</label>
                <textarea {...register('observacoes')} className={styles.textarea}></textarea>

                <button type="submit" className={styles.submitButton}>Salvar Alterações</button>
            </form>

            {/* Modal para capturar os campos faltantes */}
            <EditClientModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                initialData={{}} // Aqui você pode passar os dados iniciais se necessário
                onSave={(updatedData: any) => { /* Implementação do save */ }}
            />
        </div>
    );
};

export default ApoliceForm;
