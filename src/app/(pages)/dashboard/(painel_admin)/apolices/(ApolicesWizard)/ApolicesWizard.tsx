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
        return value === "" || value === undefined ? null : value;
    };

    const formatUUID = (value: any) => {
        return value && typeof value === "object" ? value.value : value || null;
    };

    const formatDate = (date: string | null | undefined) => {
        return date ? date.split("T")[0] : null;
    };

    const formatNumber = (value: any) => {
        const num = Number(value);
        return isNaN(num) ? null : num;
    };

    const formatString = (value: any) => {
        return typeof value === "string" ? value.trim() : null;
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
            if (typeof value === "string") {
                return Number(value.replace(/[^\d,]/g, "").replace(",", "."));
            }
            return null;
        };

        const formatDate = (date: string | null | undefined) => {
            if (!date) return null;
            const parsedDate = new Date(date);
            return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString().split("T")[0];
        };

        console.log("📂 Arquivo selecionado:", arquivoApolice);

        // 🔥 Ajuste para remover máscaras e garantir formatação correta dos detalhes
        const flattenedDetails = Object.entries(detalhes || {}).reduce((acc, [key, value]) => {
            acc[key] = moneyFields.includes(key) ? cleanMoneyValue(value) : formatValue(value);
            return acc;
        }, {} as Record<string, any>);
console.log('vou mamar',data.valor_parcela)
        // 🔥 Criamos o objeto final formatado
        const formattedData = {
            cliente: formatUUID(data.cliente),
            administradora: formatUUID(data.administradora),
            parceiro: formatUUID(data.parceiro),

            numero_apolice: formatString(data.numero_apolice),
            status: formatString(data.status) || "ativa",

            data_inicio: formatDate(data.data_inicio),
            data_vencimento: formatDate(data.data_vencimento),
            data_revisao: formatDate(data.data_revisao),

            premio_pago: cleanMoneyValue(data.premio_pago), // 🔥 Garante que nunca é `null`
            periodicidade_pagamento: formatString(data.periodicidade_pagamento) || "mensal",
            forma_pagamento: formatString(data.forma_pagamento) || "boleto",
            observacoes: formatString(data.observacoes),

            coberturas: Array.isArray(data.coberturas) ? data.coberturas : [],

            // 📌 Campos de consórcio
            contemplada: data.contemplada || false,
            grupo: formatString(data.grupo),
            cota: formatString(data.cota),
            prazo: formatNumber(data.prazo) || 0, // 🔥 Nunca enviar `null`
            indice_correcao: formatString(data.indice_correcao),
            furo: formatNumber(data.furo) || 0,
            objetivo: formatString(data.objetivo),
            estrategia: formatString(data.estrategia),
            parcela_reduzida: data.parcela_reduzida ?? false,
            percentual_reducao_parcela: formatNumber(data.percentual_reducao_parcela),

            tipo_lance: formatString(data.tipo_lance),
            detalhes_lance: formatString(data.detalhes_lance),
            aporte: formatNumber(data.aporte),
            valor_parcela: cleanMoneyValue(data.valor_parcela || 0), // 🔥 Importante garantir um valor numérico válido
            parcelas_pagas: formatNumber(data.parcelas_pagas),
            historico_pagamentos: data.historico_pagamentos ?? {},
            historico_reajustes: data.historico_reajustes ?? {},

            permitir_lance_fixo: data.permitir_lance_fixo ?? false,
            permitir_lance_livre: data.permitir_lance_livre ?? false,
            permitir_embutido_fixo: data.permitir_embutido_fixo ?? false,
            permitir_embutido_livre: data.permitir_embutido_livre ?? false,
        };

        console.log("📡 Dados formatados para envio:", formattedData);

        Object.entries(formattedData).forEach(([key, value]) => {
            if (value === null || value === undefined) return; // Ignora valores indefinidos

            if (typeof value === "object" && !(value instanceof File)) {
                formData.append(key, JSON.stringify(value)); // Somente stringifica objetos (arrays, JSONs)
            } else {
                formData.append(key, String(value)); // Evita adicionar aspas extras em valores primitivos
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
