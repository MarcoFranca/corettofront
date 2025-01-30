import React, { useEffect, useState } from 'react';
import { Steps, Button } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { RootState } from '@/store';
import { fetchClienteDetalhe, updateCliente} from '@/store/slices/clientesSlice';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import styles from './MultiStepForm.module.css';
import { Cliente, Filho } from "@/types/interfaces";

const { Step } = Steps;

interface MultiStepFormProps {
    clientId: string; // Recebendo o clientId como prop
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ clientId }) => {
    const dispatch = useAppDispatch();
    const clienteDetalhe = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);
    const [current, setCurrent] = useState(0);

    const [formData, setFormData] = useState({
        nome: '',
        sobreNome: '',
        telefone: '',
        email: '',
        cpf:'',
        genero:'',
        data_nascimento: '',
        profissao: '',
        estadoCivil: '',
        nomeConjuge: '',
        dataNascimentoConjuge: '',
        profissaoConjuge: '',
        filhos: [] as Filho[],
        reunioes: [] as { dataReuniaoAgendada: string; horarioInicio: string; horarioFim: string; assunto: string; local: string }[],  // Tipo de `reunioes`
        custoMensal: '',  // Propriedades de vida financeira
        rendaMensal: '',
        trabalho: '',
        nivelConcurso: '',
        localTrabalho: '',
        moradia: '',
        valorMoradia: '',
        custoFilhos: '',
        patrimonio: '',
        dividas: '',
        projetosFuturos: '',
        peso: '',  // Propriedades de saúde
        altura: '',
        temDoencaPreexistente: false,
        doencaPreexistente: '',
        temHistoricoFamiliarDoencas: false,
        historicoFamiliarDoencas: '',
    });

    // Captura os dados do cliente assim que o componente for montado
    useEffect(() => {
        if (clientId && (!clienteDetalhe || clienteDetalhe.id !== clientId)) {
            // Só faz a requisição se o cliente ainda não estiver no estado ou o ID não corresponder
            dispatch(fetchClienteDetalhe(clientId));
        }
    }, [dispatch, clientId, clienteDetalhe]);

    // Preenche os dados do formulário automaticamente quando o clienteDetalhe é carregado
    useEffect(() => {
        if (clienteDetalhe) {
            setFormData({
                nome: clienteDetalhe.nome || '',
                sobreNome: clienteDetalhe.sobre_nome || '',
                telefone: clienteDetalhe.telefone || '',
                email: clienteDetalhe.email || '',
                cpf: clienteDetalhe.cpf || '',
                data_nascimento: clienteDetalhe.data_nascimento || '',
                genero: clienteDetalhe.genero || '',
                estadoCivil: clienteDetalhe.estado_civil || '',
                profissao: typeof clienteDetalhe.profissao === "object"
                    ? clienteDetalhe.profissao.nome
                    : clienteDetalhe.profissao || '',
                nomeConjuge: clienteDetalhe.conjuge?.nome || '',
                dataNascimentoConjuge: clienteDetalhe.conjuge?.data_nascimento || '',
                profissaoConjuge: clienteDetalhe.conjuge?.profissao || '',

                filhos: clienteDetalhe.filhos?.map((filho) => ({
                    id: filho.id,
                    nome: filho.nome,
                    data_nascimento: filho.data_nascimento || '', // Conversão correta
                })) ?? [],

                custoMensal: clienteDetalhe.vida_financeira?.custo_mensal?.toString() || '',
                rendaMensal: clienteDetalhe.vida_financeira?.renda_mensal?.toString() || '',
                trabalho: clienteDetalhe.vida_financeira?.trabalho || '',
                nivelConcurso: clienteDetalhe.vida_financeira?.nivel_concurso || '',
                localTrabalho: clienteDetalhe.vida_financeira?.local_trabalho || '',
                moradia: clienteDetalhe.vida_financeira?.moradia || '',
                valorMoradia: clienteDetalhe.vida_financeira?.valor_moradia?.toString() || '',
                custoFilhos: clienteDetalhe.vida_financeira?.custo_filhos?.toString() || '',
                patrimonio: clienteDetalhe.vida_financeira?.patrimonio?.toString() || '',
                dividas: clienteDetalhe.vida_financeira?.dividas?.toString() || '',
                projetosFuturos: clienteDetalhe.vida_financeira?.projetos_futuros || '',
                peso: clienteDetalhe.saude?.peso?.toString() || '',
                altura: clienteDetalhe.saude?.altura?.toString() || '',
                temDoencaPreexistente: clienteDetalhe.saude?.tem_doenca_preexistente || false,
                doencaPreexistente: clienteDetalhe.saude?.doenca_preexistente || '',
                temHistoricoFamiliarDoencas: clienteDetalhe.saude?.tem_historico_familiar_doencas || false,
                historicoFamiliarDoencas: clienteDetalhe.saude?.historico_familiar_doencas || '',
                reunioes: clienteDetalhe.reunioes || [],
            });
        }
    }, [clienteDetalhe]);



    const handleChange = (input: string) => (e: string | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let value: string | boolean;

        if (typeof e === 'string') {
            value = e;  // Para strings passadas diretamente
        } else {
            value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;  // Para eventos
        }

        setFormData({ ...formData, [input]: value });
    };

    const removeEmptyFields = (obj: any): any => {
        if (Array.isArray(obj)) {
            return obj.filter(item => item != null).map(item => removeEmptyFields(item));
        } else if (obj !== null && typeof obj === 'object') {
            return Object.fromEntries(
                Object.entries(obj)
                    .filter(([_, value]) => value != null && value !== "")
                    .map(([key, value]) => [key, removeEmptyFields(value)])
            );
        }
        return obj;
    };

    const handleSubmit = async () => {
        try {
            if (!clientId) {
                console.error('Cliente ID não encontrado. Não é possível atualizar.');
                return;
            }

            let clienteData: Partial<Cliente> = {
                nome: formData.nome,
                sobre_nome: formData.sobreNome,
                telefone: formData.telefone,
                email: formData.email,
                cpf: formData.cpf || undefined,
                data_nascimento: formData.data_nascimento || undefined,
                genero: formData.genero || undefined,
                profissao: clienteDetalhe?.profissao
                    ? { id: clienteDetalhe.profissao.id, nome: clienteDetalhe.profissao.nome }
                    : undefined,
                status: "ativo",

                vida_financeira: {
                    custo_mensal: formData.custoMensal ? parseFloat(formData.custoMensal) : undefined,
                    renda_mensal: formData.rendaMensal ? parseFloat(formData.rendaMensal) : undefined,
                    trabalho: formData.trabalho || undefined,
                    nivel_concurso: formData.trabalho === 'concursado' ? formData.nivelConcurso : undefined,
                    local_trabalho: formData.localTrabalho || undefined,
                    moradia: formData.moradia || undefined,
                    valor_moradia: formData.moradia !== 'nao_tem' && formData.valorMoradia
                        ? parseFloat(formData.valorMoradia)
                        : undefined,
                    custo_filhos: formData.custoFilhos ? parseFloat(formData.custoFilhos) : undefined,
                    patrimonio: formData.patrimonio ? parseFloat(formData.patrimonio) : undefined,
                    dividas: formData.dividas ? parseFloat(formData.dividas) : undefined,
                    projetos_futuros: formData.projetosFuturos || undefined,
                },

                saude: {
                    peso: formData.peso ? parseFloat(formData.peso) : undefined,
                    altura: formData.altura ? parseFloat(formData.altura) : undefined,
                    tem_doenca_preexistente: formData.temDoencaPreexistente,
                    doenca_preexistente: formData.doencaPreexistente || undefined,
                    tem_historico_familiar_doencas: formData.temHistoricoFamiliarDoencas,
                    historico_familiar_doencas: formData.historicoFamiliarDoencas || undefined,
                },

                // 🔥 **Correção no envio de filhos**
                filhos: formData.filhos?.map((filho) => ({
                    id: filho.id,
                    nome: filho.nome,
                    data_nascimento: filho.data_nascimento || '', // 🔥 Convertendo para `data_nascimento`
                })) ?? [],

                reunioes: formData.reunioes.map(reuniao => ({
                    dataReuniaoAgendada: reuniao.dataReuniaoAgendada,
                    horarioInicio: reuniao.horarioInicio,
                    horarioFim: reuniao.horarioFim,
                    assunto: reuniao.assunto,
                    local: reuniao.local,
                })),
            };

            clienteData = removeEmptyFields(clienteData);

            // Atualizando cliente existente
            await dispatch(updateCliente({
                id: clientId,
                updatedCliente: clienteData,
            }));

            console.log('Dados atualizados:', formData);
        } catch (error: any) {
            if (error.response) {
                console.error('Erro na resposta da API:', error.response.data);
            } else if (error.request) {
                console.error('Nenhuma resposta recebida da API:', error.request);
            } else {
                console.error('Erro ao configurar a requisição:', error.message);
            }
        }
    };


    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const onStepChange = (step: number) => {
        setCurrent(step);
    };

    const steps = [
        { title: 'Dados do Cliente', content: <Step1 handleChange={handleChange} formData={formData} setFormData={setFormData} /> },
        { title: 'Dados Financeiros', content: <Step2 handleChange={handleChange} formData={formData} /> },
        { title: 'Dados De Saúde', content: <Step3 handleChange={handleChange} formData={formData} /> },
        { title: 'Revisão Final', content: <Step4 handleSubmit={handleSubmit} formData={formData} /> },
    ];

    return (
        <div className={styles.container}>
            <Steps current={current} onChange={onStepChange} className={styles.steps}>
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className={styles.stepContent}>
                {steps[current].content}
                <div>
                    {current > 0 && (
                        <Button className={styles.buttonStep} style={{ margin: '0 8px' }} onClick={prev}>
                            Anterior
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button className={styles.buttonStep} type="primary" onClick={next}>
                            Próximo
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button className={styles.buttonStep} type="primary" onClick={handleSubmit}>
                            Enviar
                        </Button>
                    )}
                </div>
            </div>
            <div className={styles.stepsAction}>
            </div>
        </div>
    );
};

export default MultiStepForm;
