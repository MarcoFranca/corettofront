// 📂 src/components/ApolicesWizard/steps/StepDadosPrincipais.tsx
"use client";

import React, { useEffect, useState } from "react";
import SelectCliente from "@/app/components/ui/select/SelectCliente/SelectCliente";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import { FormGroup, StepSection, InputGrid, SectionTitle } from "./StepDadosPrincipais.styles";
import { UseFormSetValue, UseFormRegister } from "react-hook-form";
import { loadAdministradoraOptions } from "@/app/components/ui/select/selectUtils";
import { FaUser, FaBuilding, FaFileAlt, FaCalendarAlt, FaHashtag, FaHandshake } from "react-icons/fa";
import api from "@/app/api/axios";
import SelectAdministradora from "@/app/components/ui/select/SelectAdministradoras/SelectAdministradoras";
import { ApoliceFormData } from "@/types/ApolicesInterface";
import Select from "react-select";
import { toastError } from "@/utils/toastWithSound";

interface StepDadosPrincipaisProps {
    control: any;
    setValue: UseFormSetValue<ApoliceFormData>;
    register: UseFormRegister<ApoliceFormData>;
    watch: (name: string) => any;
    formState: { errors: any };
    parceirosDisponiveis: { value: string; label: string }[];
    setParceirosDisponiveis: React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>;
}

const StepDadosPrincipais: React.FC<StepDadosPrincipaisProps> = ({
                                                                     control,
                                                                     setValue,
                                                                     register,
                                                                     watch,
                                                                     formState: { errors },
                                                                     parceirosDisponiveis,
                                                                     setParceirosDisponiveis,
                                                                 }) => {
    const [produtos, setProdutos] = useState<{ value: string; label: string }[]>([]);
    const [administradoras, setAdministradoras] = useState<{ value: string; label: string }[]>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState<string | null>(null);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await api.get("/produtos/");
                setProdutos(
                    response.data.map((p: { nome: string }) => ({
                        value: p.nome,
                        label: p.nome,
                    }))
                );
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };
        fetchProdutos();
        fetchParceiros();
    }, []);

    const fetchParceiros = async () => {
        try {
            const response = await api.get("/parceiros/");
            setParceirosDisponiveis(
                response.data.map((parceiro: any) => ({
                    value: parceiro.id,
                    label: parceiro.nome,
                }))
            );
        } catch (error) {
            toastError("😔 Erro ao carregar parceiros.");
        }
    };

    useEffect(() => {
        const parceiro = watch("parceiro");
        if (parceiro?.value && parceiro?.label) {
            setParceirosDisponiveis((prev) => {
                const jaExiste = prev.some((p) => p.value === parceiro.value);
                return jaExiste ? prev : [...prev, parceiro];
            });
        }
    }, [watch("parceiro")]);

    useEffect(() => {
        if (produtoSelecionado) {
            loadAdministradoraOptions(produtoSelecionado).then((data) => setAdministradoras(data.options));
        } else {
            setAdministradoras([]);
        }
    }, [produtoSelecionado]);

    return (
        <>
            {/* 👥 Cliente & Parceiro */}
            <StepSection>
                <SectionTitle>👥 Cliente e Parceiro</SectionTitle>
                <InputGrid>
                    <FormGroup>
                        <SelectCliente
                            name="cliente"
                            label={<><FaUser /> Cliente</>}
                            control={control}
                            required
                            onChange={(selectedOption) => setValue("cliente", selectedOption || null)}
                        />
                        {errors.cliente && <p style={{ color: "red" }}>Selecione um cliente</p>}
                    </FormGroup>

                    <FormGroup>
                        <label
                            style={{
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "4px",
                                gap: "0.3rem",
                                color: "#007bff",
                            }}
                        >
                            <FaHandshake /> Parceiro (Indicação)
                        </label>
                        <Select
                            options={parceirosDisponiveis}
                            value={
                                parceirosDisponiveis.find(
                                    (p) => p.value === (watch("parceiro")?.value || watch("parceiro"))
                                ) || watch("parceiro")
                            }
                            onChange={(option) => setValue("parceiro", option || null)}
                            placeholder="Selecione um parceiro..."
                        />
                    </FormGroup>
                </InputGrid>
            </StepSection>

            {/* 📁 Produto e Administradora */}
            <StepSection>
                <SectionTitle>📁 Produto e Administradora</SectionTitle>
                <InputGrid>
                    <FormGroup>
                        <SelectCustom
                            name="tipoApolice"
                            label={<><FaFileAlt /> Tipo de Apólice</>}
                            options={produtos}
                            control={control}
                            required
                            onChange={(value) => {
                                const selected = Array.isArray(value) ? value[0] : value;
                                setProdutoSelecionado(selected);
                                setValue("tipoApolice", selected);
                            }}
                        />
                    </FormGroup>

                    <FormGroup>
                        <SelectAdministradora
                            name="administradora"
                            label={<><FaBuilding /> Administradora</>}
                            control={control}
                            required
                            loadOptions={loadAdministradoraOptions}
                            options={administradoras}
                            value={watch("administradora") || null}
                            onChange={(selectedOption) => {
                                setValue("administradora", selectedOption || null);
                            }}
                        />
                    </FormGroup>

                    <FormGroup>
                        <SelectCustom
                            control={control}
                            name="status"
                            label="📌 Status da Apólice"
                            options={[
                                { value: "ativa", label: "Ativa" },
                                { value: "atrasada", label: "Atrasada" },
                                { value: "saldado", label: "Saldado" },
                                { value: "cancelada", label: "Cancelada" },
                                { value: "falecimento", label: "Falecimento" },
                                { value: "inadimplente", label: "Inadimplente" },
                                { value: "doenca", label: "Doença" },
                                { value: "resgate", label: "Resgate" },
                            ]}
                            required
                        />
                    </FormGroup>
                </InputGrid>
            </StepSection>

            {/* 📅 Datas e Identificação */}
            <StepSection>
                <SectionTitle>📅 Datas e Identificação</SectionTitle>
                <InputGrid>
                    <FormGroup>
                        <FloatingMaskedInput
                            name="numero_apolice"
                            label={<><FaHashtag /> Número da Apólice</>}
                            control={control}
                            setValue={setValue}
                            register={register}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <FloatingMaskedInput
                            control={control}
                            name="data_inicio"
                            label={<><FaCalendarAlt /> Data de Início</>}
                            type="date"
                            register={register}
                            setValue={setValue}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <FloatingMaskedInput
                            control={control}
                            name="data_vencimento"
                            label={<><FaCalendarAlt /> Data de Vencimento</>}
                            type="date"
                            register={register}
                            setValue={setValue}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FloatingMaskedInput
                            control={control}
                            name="data_revisao"
                            label={<><FaCalendarAlt /> Data de Revisão</>}
                            type="date"
                            register={register}
                            setValue={setValue}
                        />
                    </FormGroup>
                </InputGrid>
            </StepSection>
        </>
    );
};

export default StepDadosPrincipais;
