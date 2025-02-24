// 📂 src/components/ApolicesWizard/steps/StepDadosPrincipais.tsx
"use client";

import React, {useEffect, useState} from "react";
import SelectCliente from "@/app/components/ui/select/SelectCliente/SelectCliente";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import { StepGrid, FormGroup } from "./StepDadosPrincipais.styles";
import { UseFormSetValue, UseFormRegister } from "react-hook-form";
import {loadAdministradoraOptions, loadParceiroOptions} from "@/app/components/ui/select/selectUtils";
import { FaUser, FaBuilding, FaFileAlt, FaCalendarAlt, FaHandshake, FaHashtag } from "react-icons/fa";
import api from "@/app/api/axios";
import SelectAdministradora from "@/app/components/ui/select/SelectAdministradoras/SelectAdministradoras";
import {ApoliceFormData} from "@/types/ApolicesInterface";

interface StepDadosPrincipaisProps {
    control: any;
    setValue: UseFormSetValue<ApoliceFormData>; // ✅ Ajuste aqui para aceitar a tipagem correta
    register: UseFormRegister<ApoliceFormData>;
    watch: (name: string) => any;  // 🔥 Adicionado `watch`
    formState: { errors: any }; // ✅ Adicionado `formState` com `errors`
}


const StepDadosPrincipais: React.FC<StepDadosPrincipaisProps> = (
    {
        control,
        setValue,
        register,
        watch, // 🔥 Agora recebemos `watch`
        formState: { errors }, // ✅ Extraindo os erros corretamente
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
                {errors.cliente && <p style={{ color: "red", fontSize: "12px" }}>Selecione um cliente</p>}
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
                {errors.tipoApolice && <p style={{ color: "red", fontSize: "12px", position: 'relative' }}>
                    Selecione um Parceiro</p>}
            </FormGroup>

            {/* Administradora */}
            <FormGroup>
                <SelectAdministradora
                    name="administradora"
                    label={<><FaBuilding /> Administradora</>}
                    control={control}
                    required
                    loadOptions={loadAdministradoraOptions}
                    options={administradoras ?? []} // ✅ Garante que `options` nunca seja `undefined`
                    value={watch("administradora") || null} // ✅ Agora exibe `{ value, label }` corretamente
                    onChange={(selectedOption) => {
                        console.log("🔥 Administradora selecionada:", selectedOption);
                        setValue("administradora", selectedOption ? { value: selectedOption.value, label: selectedOption.label } : null); // ✅ Agora armazenamos `{ value, label }`
                    }}
                />
                {errors.administradora && <p style={{ color: "red", fontSize: "12px", position: 'relative' }}>
                    Selecione uma Administradora</p>}
            </FormGroup>

            {/* Número da Apólice */}
            <FormGroup>
                <FloatingMaskedInput
                    name="numero_apolice"
                    label={<><FaHashtag /> Número da Apólice</>}
                    control={control}
                    setValue={setValue}
                    register={register}
                    required
                />
                {errors.numero_apolice && <p style={{ color: "red", fontSize: "12px", position: 'relative' }}>
                    Digito o Número da Apólice</p>}
            </FormGroup>

            {/* Datas */}
            <FormGroup>
                <FloatingMaskedInput
                    control={control}
                    name="data_inicio"
                    label={<><FaCalendarAlt /> Data de Início</>}
                    type="date"
                    register={register}
                    setValue={setValue}
                    required
                    errorMessage={errors.data_inicio && 'Selecione uma Data de Inicio'}
                />
                {/*{errors.data_inicio && <p style={{ color: "red", fontSize: "12px", position: 'relative' }}>*/}
                {/*    Selecione um Data de Inicio</p>}*/}
            </FormGroup>

            <FormGroup>
                <FloatingMaskedInput
                    {...register("data_vencimento")}
                    name="data_vencimento"
                    label={<><FaCalendarAlt /> Data de Vencimento</>}
                    type="date"
                    control={control}
                    setValue={setValue}
                    register={register}
                    required={false}
                />
            </FormGroup>

            <FormGroup>
                <FloatingMaskedInput
                    {...register("data_revisao")} // 🔥 Garantindo que não seja obrigatório
                    control={control}
                    name="data_revisao"
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
