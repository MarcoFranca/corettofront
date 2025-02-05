import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { createLead } from '@/store/slices/leadsSlice';
import Modal from '@/app/components/Modal/simpleModal';
import Input from '@/app/components/global/Input';
import Button from '@/app/components/global/Button';
import { toast } from 'react-toastify';
import Select from 'react-select';
import InputMask from 'react-input-mask';
import api from '@/app/api/axios';
import styles from './LeadModal.module.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { AppDispatch } from '@/store';
import {Lead, LeadModalProps, OptionType, ProdutoOption, ProfissaoOption} from '@/types/interfaces';
import CadastrarProfissaoForm from '@/app/components/Modal/cliente/CadastrarProfissaoForm';
import { Profissao } from '@/types/interfaces';
import {AsyncPaginate, LoadOptions} from 'react-select-async-paginate';
import {fetchClientes} from "@/store/slices/clientesSlice";

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onRequestClose }) => {
    const dispatch: AppDispatch = useDispatch();

    // 📌 Estados do Formulário
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [genero, setGenero] = useState<'M' | 'F' | ''>('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');

    // 📌 Estados de Profissões
    const [profissaoPrincipal, setProfissaoPrincipal] = useState<ProfissaoOption | null>(null);
    const [subcategoria, setSubcategoria] = useState<ProfissaoOption | null>(null);
    const [profissoesPrincipais, setProfissoesPrincipais] = useState<ProfissaoOption[]>([]);
    const [subcategorias, setSubcategorias] = useState<ProfissaoOption[]>([]);

    // 📌 Estados de Indicação
    const [indicadoPorTipo, setIndicadoPorTipo] = useState<'cliente' | 'parceiro' | ''>('');
    const [indicadoPorId, setIndicadoPorId] = useState<string | null>(null);
    const [parceirosDisponiveis, setParceirosDisponiveis] = useState<ProfissaoOption[]>([]);
    const [cliente, setCliente] = useState<OptionType | null>(null);

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
            setProdutosDisponiveis(response.data.map((produto: any) => ({
                value: produto.id,
                label: produto.nome,
            })));
        } catch (error) {
            toast.error('😔 Erro ao carregar produtos de oportunidades.');
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

    // 📌 Função para Carregar Clientes com Paginação
    const loadClienteOptions: LoadOptions<OptionType, any, { page: number }> = async (
        searchQuery,
        loadedOptions,
        additional
    ) => {
        const { page = 1 } = additional || {}; // 🔥 Garante que `page` nunca seja undefined
        try {
            const response = await api.get(`/clientes/?search=${searchQuery || ''}&page=${page}&limit=100`);
            return {
                options: response.data.results.map((cliente: any) => ({
                    value: cliente.id,
                    label: `${cliente.nome} ${cliente.sobre_nome || ''}`,
                })),
                hasMore: !!response.data.next,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            toast.error('😔 Erro ao carregar clientes.');
            return { options: [], hasMore: false };
        }
    };

    const handleAddOportunidade = () => {
        if (produtoSelecionado.length === 0) {
            toast.error('⚠️ Selecione pelo menos um produto para adicionar.');
            return;
        }

        const novasOportunidades = produtoSelecionado.map((produto) => ({
            produto_interesse: produto.label, // Nome do produto
            prioridade: 'media', // Prioridade padrão
            descricao: 'Foco inicial', // Descrição padrão
        }));

        const oportunidadesFiltradas = novasOportunidades.filter(
            (novaOportunidade) =>
                !oportunidades.some(
                    (oportunidade) =>
                        oportunidade.produto_interesse === novaOportunidade.produto_interesse
                )
        );

        if (oportunidadesFiltradas.length === 0) {
            toast.warning('Todos os produtos selecionados já foram adicionados.');
            return;
        }

        setOportunidades((prev) => [...prev, ...oportunidadesFiltradas]);
        setProdutoSelecionado([]); // Reseta a seleção
    };

    const handleProfissaoPrincipalChange = (selectedOption: ProfissaoOption | null) => {
        setProfissaoPrincipal(selectedOption);

        if (selectedOption) {
            fetchSubcategorias(selectedOption.value);
        } else {
            setSubcategorias([]);
        }
    };

    const fetchSubcategorias = async (profissaoId: string) => {
        try {
            const response = await api.get(`/profissoes/${profissaoId}/subcategorias/`);
            setSubcategorias(
                response.data.map((subcategoria: any) => ({
                    value: subcategoria.id,
                    label: subcategoria.nome,
                }))
            );
        } catch (error) {
            toast.error('😔 Erro ao carregar subcategorias.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!genero) {
            setFieldErrors((prev) => ({ ...prev, genero: 'Por favor, selecione um gênero.' }));
            toast.error('⚠️ Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const formattedTelefone = telefone.replace(/\D/g, ''); // Remove caracteres não numéricos

        const oportunidadesUnicas = Array.from(
            new Set(oportunidades.map((o) => o.produto_interesse))
        ).map((produto_interesse) =>
            oportunidades.find((o) => o.produto_interesse === produto_interesse)
        );

        // 📌 Certificar que `indicado_por_cliente_id` ou `indicado_por_parceiro_id` são enviados corretamente
        const leadData: Partial<Lead> = {
            nome,
            sobre_nome: sobrenome || undefined,
            genero,
            telefone: formattedTelefone,
            email,
            profissao_id: subcategoria?.value || profissaoPrincipal?.value || undefined,
            ...(indicadoPorTipo === 'cliente' && cliente ? { indicado_por_cliente_id: cliente.value } : {}),
            ...(indicadoPorTipo === 'parceiro' && indicadoPorId ? { indicado_por_parceiro_id: indicadoPorId } : {}),
            oportunidades: oportunidadesUnicas,
        };

        console.log("📌 Enviando dados do lead para API:", leadData); // Debug

        try {
            await dispatch(createLead(leadData)).unwrap();
            toast.success('Lead cadastrado com sucesso! 🎉😃');
            onRequestClose();
            resetForm();
        } catch (error: any) {
            console.error("⚠️ Erro ao cadastrar lead:", error);
            if (error.response?.data) {
                setFieldErrors(error.response.data);
            } else {
                toast.error('⚠️ Erro ao cadastrar lead.');
            }
        }
    };

    const resetForm = () => {
        setNome('');
        setSobrenome('');
        setGenero('');
        setTelefone('');
        setEmail('');
        setProfissaoPrincipal(null);
        setSubcategoria(null);
        setIndicadoPorTipo('');
        setIndicadoPorId(null);
        setFieldErrors({});
    };

    return (
        <Modal show={isOpen} onClose={onRequestClose} title="Cadastrar Lead">
            <form onSubmit={handleSubmit} className={styles.form}>
                {/*indicações*/}
                <div className={styles.indicacaoSection}>
                    <fieldset className={styles.indicacaoFieldset}>
                        <legend className={styles.indicacaoLegend}>Indicação</legend>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioOption}>
                                <input
                                    type="radio"
                                    name="indicacao"
                                    value="cliente"
                                    checked={indicadoPorTipo === 'cliente'}
                                    onChange={() => {
                                        setIndicadoPorTipo('cliente');
                                        fetchClientes();
                                    }}
                                />
                                Cliente
                            </label>
                            <label className={styles.radioOption}>
                                <input
                                    type="radio"
                                    name="indicacao"
                                    value="parceiro"
                                    checked={indicadoPorTipo === 'parceiro'}
                                    onChange={() => {
                                        setIndicadoPorTipo('parceiro');
                                        fetchParceiros();
                                    }}
                                />
                                Parceiro
                            </label>
                        </div>
                        <div className={styles.selectWrapper}>
                            {indicadoPorTipo === 'cliente' && (
                                <AsyncPaginate
                                    value={cliente}
                                    loadOptions={loadClienteOptions}
                                    onChange={setCliente}
                                    additional={{ page: 1 }}
                                    placeholder="Selecione um cliente..."
                                    isSearchable
                                    debounceTimeout={300}
                                />


                            )
                            }
                            {indicadoPorTipo === 'parceiro' && (
                                <Select
                                    options={parceirosDisponiveis}
                                    value={parceirosDisponiveis.find((parceiro) => parceiro.value === indicadoPorId) || null}
                                    onChange={(option) => setIndicadoPorId(option?.value || null)}
                                    placeholder="Selecione um parceiro..."
                                    className={fieldErrors.indicado_por_parceiro_id ? styles.errorSelect : ''}
                                />
                            )}
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

                    <Input
                        label="Nome"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        className={fieldErrors.nome ? styles.error : ''}
                        errorMessage={fieldErrors.nome}
                    />
                    <Input
                        label="Sobrenome"
                        type="text"
                        value={sobrenome}
                        onChange={(e) => setSobrenome(e.target.value)}
                        className={fieldErrors.sobrenome ? styles.error : ''}
                        errorMessage={fieldErrors.sobrenome}
                        required={false}
                    />
                </div>
                <div className={styles.contatoContainer}>

                    <InputMask
                        mask="(99) 99999-9999"
                        value={telefone}
                        maskChar={null}
                        onChange={(e) => setTelefone(e.target.value)}
                    >
                        {(inputProps: any) => (
                            <Input
                                {...inputProps}
                                label="Telefone"
                                type="text"
                                className={fieldErrors.telefone ? styles.error : ''}
                                errorMessage={fieldErrors.telefone}
                                required
                            />
                        )}
                    </InputMask>
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={fieldErrors.email ? styles.error : ''}
                        errorMessage={fieldErrors.email}
                    />
                </div>
                <Select
                    options={[
                        {value: 'M', label: 'Masculino'},
                        {value: 'F', label: 'Feminino'},
                    ]}
                    value={
                        genero
                            ? {value: genero, label: genero === 'M' ? 'Masculino' : 'Feminino'}
                            : null
                    }
                    onChange={(selectedOption) =>
                        setGenero((selectedOption as ProfissaoOption)?.value as 'M' | 'F')
                    }
                    placeholder="Selecione o Gênero *"
                    classNamePrefix="custom-select"
                    className={fieldErrors.genero ? `${styles.errorSelect}` : ''}
                />
                {fieldErrors.genero && <div className={styles.errorMessage}>{fieldErrors.genero}</div>}
                <Select
                    options={profissoesPrincipais}
                    value={profissaoPrincipal}
                    onChange={handleProfissaoPrincipalChange}
                    placeholder="Selecione uma profissão..."
                    isSearchable
                    classNamePrefix="custom-select"
                />
                {subcategorias.length > 0 && (
                    <Select
                        options={subcategorias}
                        value={subcategoria}
                        onChange={(selectedOption) => setSubcategoria(selectedOption)}
                        placeholder="Selecione uma subcategoria..."
                        isSearchable
                    />
                )}
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
                                options={produtosDisponiveis}
                                isMulti
                                value={produtoSelecionado}
                                onChange={(option) => setProdutoSelecionado(option as ProdutoOption[])}
                                placeholder="Selecione um produto..."
                                classNamePrefix="custom-select"
                                className={styles.selectOpportunity}
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
                <Button variant="primary" type="submit">
                    Cadastrar Lead
                </Button>
            </form>
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
        </Modal>
    );
};

export default LeadModal;
