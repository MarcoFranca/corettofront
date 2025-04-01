"use client";

import React, {useEffect, useState} from "react";
import { useForm, UseFormSetValue, Path, PathValue } from "react-hook-form";
import { message } from "antd";
import StepDadosPrincipais from "./(steps)/StepDadosPrincipais";
import StepDetalhesApolice from "./(steps)/StepDetalhesApolice";
import StepCoberturas from "./(steps)/StepCoberturas";
import StepResumo from "./(steps)/StepResumo";
import UploadApolice from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/UploadApolice";
import {
    WizardFullContainer,
    StepContainer,
    ButtonGroup,
    StyledButton,

    CustomSteps,
} from "./ApoliceWizard.styles";
import api from "@/app/api/axios";
import {
    ApoliceDetalhada,
    ApoliceFormData,
    ApoliceWizardProps,
    tipoApoliceParaEndpoint
} from "@/types/ApolicesInterface";
import {cleanMoneyValue, extrairDetalhesFromApolice, formattedDataBase, formattedDataByType} from "@/utils/apoliceData";
import {toastSuccess} from "@/utils/toastWithSound";


const ApoliceWizard: React.FC<ApoliceWizardProps> = ({ onClose, apolice }) => {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [parceirosDisponiveis, setParceirosDisponiveis] = useState<{ value: string; label: string }[]>([]);

    const {
        trigger,
        handleSubmit,
        watch,
        setValue,
        control,
        register,
        formState: { errors },
    } = useForm<ApoliceFormData>({
        mode: "onSubmit",
        defaultValues: {
            cliente: "",
            tipoApolice: "",
            detalhes: {},
            coberturas: [],
            arquivoApolice: null,
            data_vencimento: undefined,
            data_revisao: undefined,
        },
    });


    useEffect(() => {
        if (!apolice) return;
        console.log("primeiro passo",Number(apolice.premio_pago));
        console.log("primeiro passo", apolice.premio_pago);
        const premioNumber = apolice.premio_pago?Number(apolice.premio_pago): "";
        const premioFormatadoNumber = apolice.premio_pago? cleanMoneyValue(premioNumber): "";
        const premioFormatado = apolice.premio_pago? cleanMoneyValue(apolice.premio_pago): "";
        console.log("🧪 Valor limpo para setValue:", premioFormatado);
        console.log("🧪 Valor limpo para setValue number:", premioFormatadoNumber);
        // ✅ Aqui você vê o que chega do backend
        const loadParceiroSeNecessario = async (parceiroId: string) => {
            // verifica se já existe localmente
            const jaTemParceiro = parceirosDisponiveis.some(p => p.value === parceiroId);

            if (!jaTemParceiro) {
                try {
                    const response = await api.get(`/parceiros/${parceiroId}/`);
                    const parceiro = response.data;
                    const parceiroOption = { value: parceiro.id, label: parceiro.nome };

                    setParceirosDisponiveis(prev => [...prev, parceiroOption]);
                    setValue("parceiro", parceiroOption);
                } catch {
                    setValue("parceiro", { value: parceiroId, label: "Parceiro (ID)" });
                }
            } else {
                const parceiroExistente = parceirosDisponiveis.find(p => p.value === parceiroId);
                setValue("parceiro", parceiroExistente ?? null);
            }
        };

        if (apolice.parceiro) {
            const parceiroId: string =
                typeof apolice.parceiro === 'object' && 'id' in apolice.parceiro
                    ? String(apolice.parceiro.id)
                    : String(apolice.parceiro);

            loadParceiroSeNecessario(parceiroId);
        } else {
            setValue("parceiro", null);
        }
        console.log("🛰️ Apólice recebida para edição:", apolice);

        const isDetalhada = (apolice: any): apolice is ApoliceDetalhada => {
            return typeof apolice.cliente_nome === "string" && typeof apolice.administradora_nome === "string";
        };

        // 🧠 CLIENTE
        if (isDetalhada(apolice)) {
            // ✅ Cliente como objeto para o Select
            setValue("cliente", {
                value: apolice.cliente,
                label: `${apolice.cliente_nome || ""} ${apolice.cliente_sobre_nome || ""}`.trim(),
            });

            // 🏛 ADMINISTRADORA
            setValue("administradora", {
                value: apolice.administradora,
                label: apolice.administradora_nome || "",
            });
        } else {
            // Caso seja tipo simples (ex: vindo de cache ou formulário incompleto)
            if (apolice.cliente) {
                setValue("cliente", typeof apolice.cliente === "string" ? apolice.cliente : apolice.cliente);
            }
            if (apolice.administradora) {
                setValue("administradora", typeof apolice.administradora === "string" ? apolice.administradora : apolice.administradora);
            }
        }

        if (apolice.parceiro) {
            if (
                typeof apolice.parceiro === "object" &&
                "id" in apolice.parceiro &&
                "nome" in apolice.parceiro
            ) {
                const parceiroObj = apolice.parceiro as { id: string; nome: string };

                setValue("parceiro", {
                    value: parceiroObj.id,
                    label: parceiroObj.nome,
                });
            } } else if (typeof apolice.parceiro === 'string') {
            // Faz um fetch pro nome do parceiro
            api.get(`/parceiros/${apolice.parceiro}/`)
                .then((response: any) => {
                    const parceiro = response.data;
                const parceiroOption = {
                    value: parceiro.id,
                    label: parceiro.nome,
                };

                // ✅ Seta no formulário
                setValue("parceiro", parceiroOption);

                // ✅ Garante que está presente nas opções do Select
                setParceirosDisponiveis((prev) => {
                    const jaExiste = prev.some((p) => p.value === parceiroOption.value);
                    return jaExiste ? prev : [...prev, parceiroOption];
                });
            })
                .catch(() => {
                    const parceiroId = typeof apolice.parceiro === "string" ? apolice.parceiro : "";
                    setValue("parceiro", {
                        value: parceiroId,
                        label: "Parceiro (ID)",
                    });
                });
        }
        else {
            setValue("parceiro", null);
        }

        setValue("numero_apolice", apolice.numero_apolice);

        setValue("status", apolice.status);
        setValue("data_inicio", apolice.data_inicio ?? "");
        setValue("data_vencimento", apolice.data_vencimento || null);
        setValue("data_revisao", apolice.data_revisao || null);
        setValue("premio_pago", Number(apolice.premio_pago) ?? 0);
        setValue("periodicidade_pagamento", apolice.periodicidade_pagamento ?? "");
        setValue("forma_pagamento", apolice.forma_pagamento ?? "");
        setValue("observacoes", apolice.observacoes || "");
        if ("tipo_produto" in apolice) {
            setValue("tipoApolice", apolice.tipo_produto as string);
        }

        const detalhes = extrairDetalhesFromApolice(apolice as ApoliceDetalhada);
        // ✅ Ajusta coberturas para garantir `nome_id`
        if ("coberturas" in detalhes && Array.isArray(detalhes.coberturas)) {
            detalhes.coberturas = detalhes.coberturas.map((cobertura: any) => ({
                ...cobertura,
                nome_id: cobertura?.nome?.id ?? "",
            }));
        }
// ✅ Garante classe_ajuste como string (evita campo vazio quebrando o input)
        if ("classe_ajuste" in apolice) {
            detalhes.classe_ajuste = apolice.classe_ajuste ?? "";
        }

        setValue("detalhes", detalhes);
    }, [apolice, setValue]);


    const tipoApolice = watch("tipoApolice");

    const setTypedValue: UseFormSetValue<ApoliceFormData> = (name, value) => {
        setValue(name as Path<ApoliceFormData>, value as PathValue<ApoliceFormData, Path<ApoliceFormData>>);
    };

    // 🔥 Função para limpar valores vazios antes do envio
    const formatValue = (value: any) => {
        return value === "" || value === undefined ? null : value;
    };

    const onSubmit = async (data: ApoliceFormData) => {
        const isEditing = !!apolice;

        const endpoint = tipoApoliceParaEndpoint[data.tipoApolice as keyof typeof tipoApoliceParaEndpoint];
        setLoading(true);

        try {
            const formData = new FormData();

            // ✅ Obtém os dados base e adiciona os campos específicos baseados no tipo de apólice
            let formattedData = {
                ...formattedDataBase(data),
                ...(data.tipoApolice ? formattedDataByType[data.tipoApolice as keyof typeof formattedDataByType](data) : {}),
            };

            console.log("📡 Enviando apólice...", formattedData);

            // ✅ Adicionamos os beneficiários e coberturas para Seguro de Vida
            if (data.tipoApolice === "Seguro de Vida") {
                formattedData.beneficiarios = Array.isArray(data.detalhes.beneficiarios)
                    ? data.detalhes.beneficiarios.map(beneficiario => ({
                        nome: beneficiario.nome,
                        data_nascimento: beneficiario.data_nascimento,
                        percentual: Number(beneficiario.percentual),  // ✅ Garante que percentual seja número
                    }))
                    : [];

                formattedData.coberturas = Array.isArray(data.detalhes.coberturas)
                    ? data.detalhes.coberturas.map(cobertura => ({
                        nome_id: cobertura.nome_id,
                        subclasse: cobertura.subclasse,
                        capital_segurado: cleanMoneyValue(cobertura.capital_segurado),  // ✅ Garante que capital_segurado seja número
                        classe_ajuste: cobertura.classe_ajuste ?? "",  // ✅ Adicionado
                    }))
                    : [];
            }

            // ✅ Adicionamos os beneficiários apenas para Plano de Saúde
            if (
                data.tipoApolice === "Plano de Saúde" &&
                Array.isArray(data.detalhes.beneficiarios) &&
                data.detalhes.beneficiarios.length > 0
            ) {
                (formattedData as any).beneficiarios = data.detalhes.beneficiarios; // ✅ Envia como array
            }


            // ✅ Adiciona os dados ao `FormData`
            Object.entries(formattedData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (Array.isArray(value)) {
                        formData.append(key, JSON.stringify(value));  // ✅ Envia como array JSON
                    } else {
                        formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
                    }
                }
            });

            // ✅ Adiciona o arquivo se existir
            if (data.arquivoApolice instanceof File) {
                console.log("📂 Anexando arquivo:", data.arquivoApolice.name);
                formData.append("arquivo", data.arquivoApolice);
            }

            const parceiroId =
                data.parceiro && typeof data.parceiro === "object" && "value" in data.parceiro
                    ? (data.parceiro as { value: string }).value
                    : data.parceiro ?? null;

            formattedData.parceiro = parceiroId;

            console.log("🟢 Parceiro sendo enviado:", formattedData.parceiro);
            console.log("✅ Dados crus do formulário:", data);
            console.log("🧾 Valor de parceiro:", data.parceiro);
            console.log("📦 Formatado para envio:", formattedDataBase(data));

            // ✅ 1. Envia a apólice ao backend (com beneficiários inclusos)

            const response = isEditing
                ? await api.patch(`${endpoint}${apolice?.id}/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                : await api.post(endpoint, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

            if (![200, 201].includes(response.status)) {
                throw new Error(`Erro ao cadastrar apólice: ${response.status}`);
            }

            console.log("✅ Apólice e Beneficiários cadastrados com sucesso!");
            toastSuccess("✅ Apólice e Beneficiários cadastrados com sucesso!")
            message.success("Apólice cadastrada com sucesso!");
            onClose();
        } catch (error: any) {
            console.error("🚨 Erro ao enviar apólice:", error);

            if (error.response?.data) {
                console.error("💥 Erro detalhado do backend:", error.response.data);
                message.error(`Erro: ${JSON.stringify(error.response.data)}`);
            } else {
                message.error("Erro ao cadastrar apólice.");
            }
        }
        finally {
            setLoading(false);
        }
    };


    const handleNext = async () => {
        const isValid = await trigger();
        console.log("🔍 Erros antes de avançar:", errors);

        if (!isValid) {
            message.error("Preencha todos os campos obrigatórios antes de continuar.");
            return;
        }

        setStep((prev) => prev + 1);
    };


    const handleBack = () => setStep((prev) => prev - 1);

    // 📌 **Configuração dinâmica dos steps**
    const steps = [
        { title: "Dados Principais", content: (
                <StepDadosPrincipais
                    control={control}
                    setValue={setTypedValue}
                    register={register}
                    watch={watch}
                    formState={{ errors }}
                    parceirosDisponiveis={parceirosDisponiveis}
                    setParceirosDisponiveis={setParceirosDisponiveis}
                />
            )},

        { title: "Detalhes", content: <StepDetalhesApolice watch={watch} control={control} setValue={setValue} register={register} tipoApolice={tipoApolice ?? ""} /> },
    ];

    if (tipoApolice === "Seguro de Vida") {
        steps.push(
            { title: "Coberturas", content: <StepCoberturas watch={watch} control={control} setValue={setValue} register={register} tipoApolice={tipoApolice ?? ""} /> },
            { title: "Importação", content: <UploadApolice setValue={setValue} /> }
        );
    } else {
        steps.push({ title: "Importação", content: <UploadApolice setValue={setValue} /> });
    }

    steps.push({ title: "Resumo", content: <StepResumo watch={watch} /> });

    useEffect(() => {
        if (apolice) {
            setStep(0); // 🔥 Garante que começa do passo 0 ao editar
        }
    }, [apolice]);

    return (
        <WizardFullContainer>
            <CustomSteps current={step} items={steps.map(({ title }) =>
                ({ title }))} size="small" responsive={true} />

            <StepContainer>{steps[step]?.content ?? null}</StepContainer>

            <ButtonGroup>
                {step > 0 && (
                    <StyledButton onClick={handleBack} variant="secondary">
                        Voltar
                    </StyledButton>
                )}
                {step < steps.length - 1 ? (
                    <StyledButton onClick={handleNext}>Próximo</StyledButton>
                ) : (
                    <StyledButton onClick={handleSubmit(onSubmit)}>
                        {apolice ? "Salvar Alterações" : "Finalizar"}
                    </StyledButton>
                )}
            </ButtonGroup>
        </WizardFullContainer>
    );
};

export default ApoliceWizard;
