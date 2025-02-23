"use client";

import React, {useState} from "react";
import { useForm, UseFormSetValue, Path, PathValue } from "react-hook-form";
import { message, Steps } from "antd";
import StepDadosPrincipais from "./(steps)/StepDadosPrincipais";
import StepDetalhesApolice from "./(steps)/StepDetalhesApolice";
import StepCoberturas from "./(steps)/StepCoberturas";
import StepResumo from "./(steps)/StepResumo";
import UploadApolice from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/UploadApolice";
import { WizardFullContainer, StepContainer, ButtonGroup, StyledButton,} from "./ApoliceWizard.styles";
import api from "@/app/api/axios";
import {ApoliceFormData, ApoliceWizardProps, moneyFields, tipoApoliceParaEndpoint} from "@/types/ApolicesInterface";

const ApoliceWizard: React.FC<ApoliceWizardProps> = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const { handleSubmit, watch, setValue, control, register } = useForm<ApoliceFormData>({
        defaultValues: {
            cliente: "",
            tipoApolice: "",
            detalhes: {},
            coberturas: [],
            arquivoApolice: null,
        },
    });

    const tipoApolice = watch("tipoApolice");

    const setTypedValue: UseFormSetValue<ApoliceFormData> = (name, value) => {
        setValue(name as Path<ApoliceFormData>, value as PathValue<ApoliceFormData, Path<ApoliceFormData>>);
    };

    // 🔥 Função para converter checkboxes corretamente
    const formatCheckbox = (value: any) => {
        return value === true || value === "true";
    };

    // 🔥 Função para limpar valores vazios antes do envio
    const formatValue = (value: any) => {
        return value === "" || value === "undefined" || value === undefined ? null : value;
    };

    const onSubmit = async (data: ApoliceFormData) => {
        const formData = new FormData();

        // 🔥 Extraímos os dados antes de montar `formattedData`
        const { detalhes, coberturas, arquivoApolice, administradora, ...rest } = data;

        const endpoint = tipoApolice ? tipoApoliceParaEndpoint[tipoApolice] : null;

        if (!endpoint) {
            console.error("🚨 Tipo de apólice inválido ou não mapeado:", tipoApolice);
            message.error("Erro: Tipo de apólice inválido.");
            return;
        }

        // 🔥 Função para limpar valores de dinheiro formatados
        const cleanMoneyValue = (value: string | number) => {
            if (typeof value === "number") return value;
            if (typeof value === "string") {
                return Number(value.replace(/[^\d,]/g, "").replace(",", "."));
            }
            return null;
        };

        console.log("📂 Arquivo selecionado:", arquivoApolice);

        // 🔥 Ajuste para remover máscaras e garantir formatação correta dos detalhes
        const flattenedDetails = Object.entries(detalhes || {}).reduce((acc, [key, value]) => {
            acc[key] = moneyFields.includes(key) ? cleanMoneyValue(value) : formatValue(value);
            return acc;
        }, {} as Record<string, any>);

        // 🔥 Criamos o objeto final formatado
        const formattedData = {
            ...rest,
            ...flattenedDetails,

            administradora: administradora?.value ?? null, // ✅ Envia apenas o ID correto
            data_inicio: data.dataInicio || new Date().toISOString().split("T")[0],
            premio_pago: data.premioPago ? Number(data.premioPago) : 0,
            periodicidade_pagamento: data.periodicidadePagamento || "mensal",
            forma_pagamento: data.formaPagamento || "boleto",
            valor_cota: data.valorCota ? Number(data.valorCota) : 0,
            indice_correcao: data.indiceCorrecao || "IPCA",
            objetivo: data.objetivo || "Não informado",
            valor_parcela: data.valorParcela ? Number(data.valorParcela) : 0,
            coberturas: Array.isArray(coberturas) ? coberturas : [],

            cliente: typeof data.cliente === "object" && data.cliente !== null ? data.cliente.value : data.cliente,
            parceiro: formatValue(data.parceiro),
            data_vencimento: formatValue(data.dataVencimento),
            data_revisao: formatValue(data.dataRevisao),

            permitir_lance_livre: formatCheckbox(detalhes.permitir_lance_livre),
            permitir_lance_fixo: formatCheckbox(detalhes.permitir_lance_fixo),
            permitir_embutido_fixo: formatCheckbox(detalhes.permitir_embutido_fixo),
            permitir_embutido_livre: formatCheckbox(detalhes.permitir_embutido_livre),

            // 📌 **Campos extras**
            status: "ativa",
            estrategia: "usar lance fixo com embutido e 10% de recurso próprio",
            parcela_reduzida: true,
            data_ultimo_lance: "2025-02-04",
            tipo_lance: "fixo",
            detalhes_lance: "40%",
            aporte: 100000.00,
            lance_fixo_opcoes: [30, 40],
        };

        console.log("📡 Dados formatados para envio:", formattedData);

        // 🔥 Adicionamos os dados ao FormData
        Object.entries(formattedData).forEach(([key, value]) => {
            if (typeof value === "object" && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else if (value !== null) {
                formData.append(key, String(value));
            }
        });

        // 🔥 Adicionamos o arquivo ao FormData se existir
        if (arquivoApolice instanceof File) {
            console.log("📂 Anexando arquivo:", arquivoApolice.name);
            formData.append("arquivo", arquivoApolice);  // 🔥 Mudamos a chave para `arquivo`, pois é o nome do campo no backend
        }

        console.log("📡 Enviando dados da apólice para o backend...", Object.fromEntries(formData.entries()));

        try {
            const response = await api.post(endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // ✅ Obrigatório para envio correto de arquivos
                },
            });

            if (response.status !== 201) {
                throw new Error(`Erro ao cadastrar apólice: ${response.status}`);
            }

            message.success("Apólice cadastrada com sucesso!");
            onClose();
        } catch (error) {
            console.error("🚨 Erro ao enviar apólice:", error);
            message.error("Erro ao cadastrar apólice.");
        }
    };

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    // 📌 **Configuração dinâmica dos steps**
    const steps = [
        { title: "Dados Principais", content: <StepDadosPrincipais
                control={control}
                setValue={setTypedValue}
                register={register}
                watch={watch}  // 🔥 Agora passamos `watch` para o componente
            />
        },
        { title: "Detalhes", content: <StepDetalhesApolice control={control} setValue={setValue} register={register} tipoApolice={tipoApolice ?? ""} /> },
    ];

    if (tipoApolice === "Seguro de Vida") {
        steps.push(
            { title: "Coberturas", content: <StepCoberturas control={control} /> },
            { title: "Importação", content: <UploadApolice setValue={setValue} /> }
        );
    } else {
        steps.push({ title: "Importação", content: <UploadApolice setValue={setValue} /> });
    }

    steps.push({ title: "Resumo", content: <StepResumo watch={watch} /> });

    return (
        <WizardFullContainer>
            <Steps current={step} items={steps.map(({ title }) => ({ title }))} size="small" responsive={true} />

            <StepContainer>{steps[step].content}</StepContainer>

            <ButtonGroup>
                {step > 0 && (
                    <StyledButton onClick={handleBack} variant="secondary">
                        Voltar
                    </StyledButton>
                )}
                {step < steps.length - 1 ? (
                    <StyledButton onClick={handleNext}>Próximo</StyledButton>
                ) : (
                    <StyledButton onClick={handleSubmit(onSubmit)}>Finalizar</StyledButton>
                )}
            </ButtonGroup>
        </WizardFullContainer>
    );
};

export default ApoliceWizard;
