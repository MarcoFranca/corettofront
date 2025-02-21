// 📂 src/components/ApolicesWizard/steps/StepDadosPrincipais.tsx
"use client";

import React, {useEffect, useState} from "react";
import SelectCliente from "@/app/components/ui/select/SelectCliente/SelectCliente";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import { StepGrid, FormGroup } from "./StepDadosPrincipais.styles";
import { UseFormSetValue, UseFormRegister } from "react-hook-form";
import {ApoliceFormData} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/ApolicesWizard";
import {loadAdministradoraOptions, loadParceiroOptions} from "@/app/components/ui/select/selectUtils";
import { FaUser, FaBuilding, FaFileAlt, FaCalendarAlt, FaHandshake, FaHashtag } from "react-icons/fa";
import api from "@/app/api/axios";

interface StepDadosPrincipaisProps {
    control: any;
    setValue: UseFormSetValue<ApoliceFormData>; // ✅ Ajuste aqui para aceitar a tipagem correta
    register: UseFormRegister<ApoliceFormData>;
}


const StepDadosPrincipais: React.FC<StepDadosPrincipaisProps> = ({
                                                                     control,
                                                                     setValue,
                                                                     register,
                                                                 }) => {

    const [produtos, setProdutos] = useState<{ value: string; label: string }[]>([]);
    const [administradoras, setAdministradoras] = useState<{ value: string; label: string }[]>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState<string | null>(null);

    // 🔥 Buscar produtos da API ao carregar a página
    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await api.get("/produtos/");
                setProdutos(response.data.map((p: { nome: string }) => ({
                    value: p.nome,
                    label: p.nome,
                })));
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };
        fetchProdutos();
    }, []);

    // 🔥 Buscar administradoras sempre que um produto for selecionado
    useEffect(() => {
        if (produtoSelecionado) {
            loadAdministradoraOptions(produtoSelecionado).then((data) => setAdministradoras(data.options));
        } else {
            setAdministradoras([]);
        }
    }, [produtoSelecionado]);

    return (
        <StepGrid>
            {/* Cliente */}
            <FormGroup>
                <SelectCliente
                    name="cliente"
                    label={<><FaUser /> Cliente</>}
                    control={control}
                    required
                    onChange={(selectedOption) => setValue("cliente", selectedOption || null)} // ✅ Agora aceita { value, label }

                />

            </FormGroup>

            {/* Parceiro (Indicação) */}
            <FormGroup>
                <SelectCustom
                    name="parceiro"
                    label={<><FaHandshake /> Parceiro (Indicação)</>}
                    control={control}
                    isAsync={true}
                    loadOptions={loadParceiroOptions}
                />
            </FormGroup>

            {/* Tipo de Apólice */}
            <FormGroup>
                <SelectCustom
                    name="tipoApolice"
                    label={<><FaFileAlt /> Tipo de Apólice</>}
                    options={produtos}
                    control={control}
                    required
                    onChange={(value) => {
                        console.log(value)

                        // 🔥 Garantimos que `value` sempre será tratado corretamente
                        if (!value) {
                            setProdutoSelecionado(null);
                            console.log(value)
                            setValue("tipoApolice", "" as any);
                            return;
                        }

                        // 🔥 Se `value` for um array, pegamos apenas o primeiro item
                        const selected = Array.isArray(value) ? value[0] : value;

                        setProdutoSelecionado(selected);
                        setValue("tipoApolice", selected);
                    }}
                />

            </FormGroup>

            {/* Administradora */}
            <FormGroup>
                <SelectCustom
                    name="administradora"
                    label={<><FaBuilding /> Administradora</>}
                    control={control}
                    isAsync={true}
                    loadOptions={(search) => loadAdministradoraOptions(produtoSelecionado || "")}
                    required
                    onChange={(value) => {
                        if (!value || typeof value === "string") {
                            setValue("administradora", "" as any);
                            return;
                        }

                        if (Array.isArray(value)) {
                            console.warn("Esperado um único objeto, mas recebeu um array:", value);
                            setValue("administradora", "" as any);
                            return;
                        }

                        setValue("administradora", String(value));  // 🔥 Agora sempre enviamos uma string
                    }}
                />
            </FormGroup>

            {/* Número da Apólice */}
            <FormGroup>
                <FloatingMaskedInput
                    name="numeroApolice"
                    label={<><FaHashtag /> Número da Apólice</>}
                    control={control}
                    setValue={setValue}
                    register={register}
                    required
                />
            </FormGroup>

            {/* Datas */}
            <FormGroup>
                <FloatingMaskedInput
                    control={control}
                    name="dataInicio"
                    label={<><FaCalendarAlt /> Data de Início</>}
                    type="date"
                    register={register}
                    setValue={setValue}
                    required
                />
            </FormGroup>

            <FormGroup>
                <FloatingMaskedInput
                    name="dataVencimento"
                    label={<><FaCalendarAlt /> Data de Vencimento</>}
                    type="date"
                    control={control}
                    setValue={setValue}
                    register={register}
                />
            </FormGroup>

            <FormGroup>
                <FloatingMaskedInput
                    control={control}
                    name="dataRevisao"
                    label={<><FaCalendarAlt /> Data de Revisão</>}
                    type="date"
                    register={register}
                    setValue={setValue}
                />
            </FormGroup>
        </StepGrid>
    );
};

export default StepDadosPrincipais;
