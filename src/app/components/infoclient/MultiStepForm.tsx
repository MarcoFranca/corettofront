import React, { useEffect, useState } from 'react';
import { Steps, Button } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { RootState } from '@/store';
import {createCliente, fetchClienteDetalhe, updateCliente} from '@/store/slices/clientesSlice';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import styles from './MultiStepForm.module.css';

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
        sexo:'',
        dataNascimento: '',
        profissao: '',
        estadoCivil: '',
        nomeConjuge: '',
        dataNascimentoConjuge: '',
        profissaoConjuge: '',
        filhos: [],  // Array de filhos
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
        if (clientId) {
            dispatch(fetchClienteDetalhe(clientId));
        }
    }, [dispatch, clientId]);

    // Preenche os dados do formulário automaticamente quando o clienteDetalhe é carregado
    useEffect(() => {
        if (clienteDetalhe) {
            setFormData({
                nome: clienteDetalhe.nome || '',
                sobreNome: clienteDetalhe.sobre_nome || '',
                telefone: clienteDetalhe.telefone || '',
                email: clienteDetalhe.email || '',
                cpf: clienteDetalhe.cpf || '',  // Inclua o CPF se necessário
                dataNascimento: clienteDetalhe.data_nascimento || '',
                sexo: clienteDetalhe.sexo || '',  // Inclua o sexo se necessário
                profissao: clienteDetalhe.profissao || '',
                estadoCivil: clienteDetalhe.estado_civil || '',
                nomeConjuge: clienteDetalhe.conjuge?.nome || '',
                dataNascimentoConjuge: clienteDetalhe.conjuge?.data_nascimento || '',
                profissaoConjuge: clienteDetalhe.conjuge?.profissao || '',
                filhos: clienteDetalhe.filhos || [],
                custoMensal: clienteDetalhe.vida_financeira?.custo_mensal?.toString() || '',
                rendaMensal: clienteDetalhe.vida_financeira?.renda_mensal?.toString() || '',
                trabalho: clienteDetalhe.vida_financeira?.trabalho || '',
                nivelConcurso: clienteDetalhe.vida_financeira?.nivel_concurso || '',  // Ajuste conforme a lógica de preenchimento
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
                // Adicione outros campos se necessário, como `endereco`, `reunioes`, etc.
            });
        }
    }, [clienteDetalhe]);

    // Ajuste do handleChange para aceitar tanto strings quanto eventos
    const handleChange = (input: string) => (e: string | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let value: string | boolean;

        if (typeof e === 'string') {
            value = e;  // Para strings passadas diretamente
        } else {
            value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;  // Para eventos
        }

        setFormData({ ...formData, [input]: value });
    };

    const removeEmptyFields = (obj) => {
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
            if (clientId) {
                // Preparando os dados para envio ao backend
                let clienteData = {
                    nome: formData.nome,
                    sobre_nome: formData.sobreNome,
                    telefone: formData.telefone,
                    email: formData.email,
                    cpf: formData.cpf,
                    data_nascimento: formData.dataNascimento,
                    sexo: formData.sexo,
                    profissao: formData.profissao,
                    status: "ativo",

                    vida_financeira: {
                        custo_mensal: formData.custoMensal ? parseFloat(formData.custoMensal) : null,
                        renda_mensal: formData.rendaMensal ? parseFloat(formData.rendaMensal) : null,
                        trabalho: formData.trabalho,
                        nivel_concurso: formData.trabalho === 'concursado' ? formData.nivelConcurso : null,
                        local_trabalho: formData.localTrabalho || null,
                        moradia: formData.moradia || null,
                        valor_moradia: formData.moradia !== 'nao_tem' && formData.valorMoradia ? parseFloat(formData.valorMoradia) : null,
                        custo_filhos: formData.custoFilhos ? parseFloat(formData.custoFilhos) : null,
                        patrimonio: formData.patrimonio ? parseFloat(formData.patrimonio) : null,
                        dividas: formData.dividas ? parseFloat(formData.dividas) : null,
                        projetos_futuros: formData.projetosFuturos || null,
                    },

                    saude: {
                        peso: formData.peso ? parseFloat(formData.peso) : null,
                        altura: formData.altura ? parseFloat(formData.altura) : null,
                        tem_doenca_preexistente: formData.temDoencaPreexistente,
                        doenca_preexistente: formData.doencaPreexistente || null,
                        tem_historico_familiar_doencas: formData.temHistoricoFamiliarDoencas,
                        historico_familiar_doencas: formData.historicoFamiliarDoencas || null,
                    },

                    filhos: formData.filhos.map(filho => ({
                        nome: filho.nome,
                        data_nascimento: filho.dataNascimento,
                    })),

                    reunioes: formData.reunioes?.map(reuniao => ({
                        data_reuniao_agendada: reuniao.dataReuniaoAgendada,
                        horario_inicio: reuniao.horarioInicio,
                        horario_fim: reuniao.horarioFim,
                        assunto: reuniao.assunto,
                        local: reuniao.local,
                    })),
                };

                // Limpa os campos com valores nulos
                clienteData = removeEmptyFields(clienteData);

                // Atualizando cliente existente
                await dispatch(updateCliente({
                    id: clientId,
                    updatedCliente: clienteData,
                }));

                console.log('Dados atualizados:', formData);
            } else {
                console.error('Cliente ID não encontrado. Não é possível atualizar.');
            }
        } catch (error) {
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
        <div>
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
