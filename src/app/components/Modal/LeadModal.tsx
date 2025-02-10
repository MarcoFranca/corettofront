import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { createLead } from '@/store/slices/leadsSlice';
import Modal from '@/app/components/Modal/simpleModal';
import FloatingMaskedInput from '@/app/components/ui/input/FloatingMaskedInput';
import { toast } from 'react-toastify';
import Select from 'react-select';
import api from '@/app/api/axios';
import styles from './LeadModal.module.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { AppDispatch } from '@/store';
import {Lead, LeadModalProps, ProdutoOption, ProfissaoOption} from '@/types/interfaces';
import CadastrarProfissaoForm from '@/app/components/Modal/cliente/CadastrarProfissaoForm';
import { Profissao } from '@/types/interfaces';
import StandardModal from "@/app/components/Modal/StandardModal";
import {useForm} from "react-hook-form";
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset;
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import SelectProfissao from "@/app/components/ui/select/SelectProfissao/SelectProfissao";
import SelectCliente from "@/app/components/ui/select/SelectCliente/SelectCliente";

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onRequestClose }) => {
    const dispatch: AppDispatch = useDispatch();

    // 📌 Estados do Formulário
    const [isSubmittingblock, setIsSubmitting] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // 📌 Estados de Profissões
    const [profissoesPrincipais, setProfissoesPrincipais] = useState<ProfissaoOption[]>([]);

    // 📌 Estados de Indicação
    const [indicadoPorTipo, setIndicadoPorTipo] = useState<'cliente' | 'parceiro' | ''>('');
    const [indicadoPorId, setIndicadoPorId] = useState<string | null>(null);
    const [parceirosDisponiveis, setParceirosDisponiveis] = useState<ProfissaoOption[]>([]);

    // 📌 Estados de Oportunidades
    const [produtosDisponiveis, setProdutosDisponiveis] = useState<{ value: string; label: string }[]>([]);
    const [oportunidades, setOportunidades] = useState<any[]>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoOption[]>([]);

    // 📌 Estados para Modais e Erros
    const [isProfissaoModalOpen, setProfissaoModalOpen] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});


    // 📌 Carregar Dados no Modal
    useEffect(() => {
        if (isOpen) {
            fetchProfissoes();
            fetchParceiros();
            fetchProdutosDisponiveis();
        }
    }, [isOpen]);

    // 📌 Funções de Carregamento de Dados
    const fetchProdutosDisponiveis = async () => {
        try {
            const response = await api.get('/produtos-oportunidades/');
            return response.data.map((produto: any) => ({
                value: produto.id,
                label: produto.nome,
            }));
        } catch (error) {
            toast.error('😔 Erro ao carregar produtos de oportunidades.');
            return [];
        }
    };


    const fetchParceiros = async () => {
        try {
            const response = await api.get('/parceiros/');
            setParceirosDisponiveis(response.data.map((parceiro: any) => ({
                value: parceiro.id,
                label: parceiro.nome,
            })));
        } catch (error) {
            toast.error('😔 Erro ao carregar parceiros.');
        }
    };

    const fetchProfissoes = async () => {
        try {
            const response = await api.get('/profissoes/');
            setProfissoesPrincipais(response.data.map((profissao: any) => ({
                value: profissao.id,
                label: profissao.nome,
            })));
        } catch (error) {
            toast.error('😔 Erro ao carregar profissões.');
        }
    };

    const handleAddOportunidade = () => {
        if (produtoSelecionado.length === 0) {
            toast.error('⚠️ Selecione pelo menos um produto para adicionar.');
            return;
        }

        const novasOportunidades = produtoSelecionado.map((produto) => ({
            produto_interesse: produto.label,
            prioridade: 'media',
            descricao: 'Foco inicial',
        }));

        const novasOportunidadesUnicas = novasOportunidades.filter(
            (nova) => !oportunidades.some((o) => o.produto_interesse === nova.produto_interesse)
        );

        if (novasOportunidadesUnicas.length === 0) {
            toast.warning('⚠️ Todos os produtos selecionados já foram adicionados.');
            return;
        }

        setOportunidades((prev) => [...prev, ...novasOportunidadesUnicas]);
        setProdutoSelecionado([]);
    };

    const methods = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            nome: "",
            sobrenome: "",
            genero: "",
            telefone: "",
            email: "",
            profissao_id: "", // 🔥 Garante que "profissao_id" está registrado no formulário
        },
    });

    const {
        register,
        setValue,
        reset,
        formState: { isValid, isSubmitting }
    } = methods;

    const handleFormSubmit = async (data: any) => {
        if (isSubmittingblock) return;
        setIsSubmitting(true);

        try {
            console.log("📌 Enviando lead...", data);

            // 🔥 Removendo caracteres não numéricos do telefone
            const formattedTelefone = data.telefone.replace(/\D/g, '');

            // 🔥 Garantindo oportunidades únicas
            const oportunidadesUnicas = Array.from(
                new Set(oportunidades.map((o) => o.produto_interesse))
            ).map((produto_interesse) =>
                oportunidades.find((o) => o.produto_interesse === produto_interesse)
            );

            // 🔥 Preparando dados para envio
            const leadData: Partial<Lead> = {
                nome: data.nome,
                sobre_nome: data.sobrenome || undefined,
                genero: data.genero,
                telefone: formattedTelefone,
                email: data.email,
                profissao_id: data.profissao_id || null,
                oportunidades: oportunidadesUnicas,

                // 🔥 Aqui garantimos que apenas o ID do cliente é enviado para a API
                ...(indicadoPorTipo === "cliente" && data.indicado_por_cliente_id
                    ? { indicado_por_cliente_id: data.indicado_por_cliente_id.value } // 🔥 Pega apenas o ID
                    : {}),
                ...(indicadoPorTipo === "parceiro" && indicadoPorId
                    ? { indicado_por_parceiro_id: indicadoPorId }
                    : {}),
            };

            console.log("📌 Enviando dados do lead para API:", leadData);

            // 🔥 Validação antes do envio
            if (!data.genero) {
                setToastMessage({ type: "error", message: "⚠️ Por favor, selecione um gênero." });
                setIsSubmitting(false);
                return;
            }

            await new Promise((resolve) => setTimeout(resolve, 2000)); // 🔥 Simula um delay de 2s
            await dispatch(createLead(leadData)).unwrap();

            setToastMessage({ type: "success", message: "Lead cadastrado com sucesso! 🎉" });
            reset();
            onRequestClose();
        } catch (error: any) {
            console.error("⚠️ Erro ao cadastrar lead:", error);
            setToastMessage({ type: "error", message: "⚠️ Erro ao cadastrar lead." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <StandardModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title="Cadastrar Lead"
            onSubmit={methods.handleSubmit(handleFormSubmit)} // ✅ Agora está correto!
            buttonText="Cadastrar Lead"
            buttonIcon={<AiOutlinePlus />}
            methods={methods}
            toastMessage={toastMessage} // 🔥 Passamos a mensagem para o modal
        >
            {/* Indicação */}
            <div className={styles.indicacaoSection}>
                <fieldset className={styles.indicacaoFieldset}>
                    <legend className={styles.indicacaoLegend}>Indicação</legend>
                    <div className={styles.radioGroup}>
                        <label className={styles.radioOption}>
                            <input
                                type="radio"
                                name="indicacao"
                                value="cliente"
                                checked={indicadoPorTipo === "cliente"}
                                onChange={() => setIndicadoPorTipo("cliente")}
                            />
                            Cliente
                        </label>
                        <label className={styles.radioOption}>
                            <input
                                type="radio"
                                name="indicacao"
                                value="parceiro"
                                checked={indicadoPorTipo === "parceiro"}
                                onChange={() => setIndicadoPorTipo("parceiro")}
                            />
                            Parceiro
                        </label>
                    </div>

                    <div className={styles.selectWrapper}>
                        {indicadoPorTipo === "cliente" ? (
                            <SelectCliente
                                name="indicado_por_cliente_id"
                                control={methods.control}
                                placeholder="Selecione um cliente"
                                required
                                showLabel={false}
                                errorMessage={fieldErrors.indicado_por_cliente_id}
                            />
                        ) : indicadoPorTipo === "parceiro" ? (
                            <Select
                                options={parceirosDisponiveis}
                                value={parceirosDisponiveis.find((parceiro) => parceiro.value === indicadoPorId)}
                                onChange={(option) => setIndicadoPorId(option?.value || null)}
                                placeholder="Selecione um parceiro..."
                                className={fieldErrors.indicado_por_parceiro_id ? styles.errorSelect : ""}
                            />
                        ) : null}
                    </div>
                </fieldset>

                {(fieldErrors.indicado_por_cliente_id || fieldErrors.indicado_por_parceiro_id) && (
                    <div className={styles.errorMessage}>
                        {fieldErrors.indicado_por_cliente_id || fieldErrors.indicado_por_parceiro_id}
                    </div>
                )}
            </div>
                {/*indicações*/}

                <div className={styles.nameContainer}>

                    <FloatingMaskedInput
                        label="Primeiro Nome"
                        name="nome"
                        type="text"
                        register={register}
                        setValue={setValue}
                        control={methods.control}
                        required
                        errorMessage={fieldErrors.nome}
                    />
                    <FloatingMaskedInput
                        label="Sobre Nome"
                        name="sobrenome"
                        type="text"
                        register={register}
                        setValue={setValue}
                        control={methods.control}
                        errorMessage={fieldErrors.sobrenome}
                    />

                </div>
                <div className={styles.contatoContainer}>

                    <FloatingMaskedInput
                        label="Telefone"
                        name="telefone"
                        type="text"
                        mask="(99) 99999-9999"
                        register={register}
                        setValue={setValue}
                        control={methods.control}
                        required
                        errorMessage={fieldErrors.telefone}
                    />
                    <FloatingMaskedInput
                        label="Email"
                        name="email"
                        type="email"
                        register={register}
                        setValue={setValue}
                        control={methods.control}
                        errorMessage={fieldErrors.email}
                    />
                </div>
            <SelectCustom
                name="genero"
                control={methods.control}
                label="Gênero"
                showLabel={false} // 🔥 Com label
                placeholder="Selecione um gênero"
                options={[
                    { value: "M", label: "Masculino" },
                    { value: "F", label: "Feminino" },
                ]}
                required
                errorMessage={fieldErrors.genero}
            />

            {fieldErrors.genero && <div className={styles.errorMessage}>{fieldErrors.genero}</div>}
            <SelectProfissao
                name="profissao_id"
                control={methods.control}
                placeholder="Selecione a profissão"
                required
                showLabel={false}
                errorMessage={fieldErrors.profissao_id}
            />

            <button
                    type="button"
                    onClick={() => setProfissaoModalOpen(true)}
                    className={styles.cadastrarProfissao}
                >
                    <AiOutlinePlus style={{marginRight: '5px'}}/>
                    Cadastrar Nova Profissão
                </button>
                {/*oportunidades*/}
                <div className={styles.opportunitySection}>
                    <fieldset className={styles.indicacaoFieldset}>
                        <legend className={styles.indicacaoLegend}>Oportunidades</legend>
                        <div className={styles.opportunityGrid}>
                            <Select
                                options={produtosDisponiveis} // 🔥 Agora não carrega tudo de uma vez
                                isMulti
                                value={produtoSelecionado}
                                onChange={(option) => setProdutoSelecionado(option as ProdutoOption[])}
                                placeholder="Selecione um produto..."
                                classNamePrefix="custom-select"
                                className={styles.selectOpportunity}
                                onFocus={async () => {
                                    if (produtosDisponiveis.length === 0) {
                                        const produtos = await fetchProdutosDisponiveis();
                                        setProdutosDisponiveis(produtos); // 🔥 Carrega os produtos apenas uma vez
                                    }
                                }}
                            />

                        </div>
                        {oportunidades.map((oportunidade, index) => (
                            <div key={index} className={styles.opportunityItem}>
                                <p>
                                    <strong>Produto:</strong> {oportunidade.produto_interesse}
                                </p>
                            </div>
                        ))}
                    </fieldset>
                    <div className={styles.opportunityButtonContainer}>
                        <button
                            type="button"
                            onClick={handleAddOportunidade}
                            className={styles.addOpportunityButton}
                        >
                            <AiOutlinePlus style={{marginRight: '5px' }} />
                            Adicionar Oportunidade
                        </button>
                    </div>
                    <div className={styles.opportunityList}>
                    </div>
                </div>
            {isProfissaoModalOpen && (
                <Modal
                    show={isProfissaoModalOpen}
                    onClose={() => setProfissaoModalOpen(false)}
                    title="Cadastrar Nova Profissão"
                >
                    <div className={styles.form}>
                        <CadastrarProfissaoForm
                            onSuccess={(novaProfissao: Profissao) => {
                                setProfissoesPrincipais((prev) => [
                                    ...prev,
                                    {value: novaProfissao.id, label: novaProfissao.nome},
                                ]);
                                setProfissaoModalOpen(false);
                            }}
                        />
                    </div>
                </Modal>
            )}
        </StandardModal>
    );
};

export default LeadModal;
