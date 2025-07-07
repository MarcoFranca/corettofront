'use client';
import React, {useEffect} from "react";
import {useFormContext} from "react-hook-form";
import { EnvironmentOutlined, HomeOutlined, NumberOutlined, ApartmentOutlined, PushpinOutlined } from "@ant-design/icons";
import { FormSection, Grid2 } from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/EditClientDrawer.styles";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import {buscaEnderecoPorCEP} from "@/utils/cep";
import {message} from "antd";
import CEPInput from "@/app/components/ui/input/CEPInput";



export default function EditAddressSection() {
    const { control, setValue, register, watch } = useFormContext();
// Observe o campo CEP
    const cepValue = watch("cep") || "";

    useEffect(() => {
        // Só busca se for 8 dígitos (ignorando máscara)
        const rawCEP = cepValue.replace(/\D/g, "");
        if (rawCEP.length === 8) {
            buscaEnderecoPorCEP(rawCEP)
                .then(data => {
                    // Só preenche se o campo ainda estiver vazio, ou quer sobrescrever sempre?
                    setValue("logradouro", data.logradouro || "");
                    setValue("bairro", data.bairro || "");
                    setValue("cidade", data.localidade || "");
                    setValue("uf", data.uf || "");
                })
                .catch(() => {
                    message.error("CEP não encontrado.");
                    setValue("logradouro", "");
                    setValue("bairro", "");
                    setValue("cidade", "");
                    setValue("uf", "");
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cepValue]); // Executa sempre que o CEP mudar

    return (
        <FormSection>
            <Grid2>
                <FloatingMaskedInput
                    name="logradouro"
                    label={
                        <>
                            <EnvironmentOutlined /> Logradouro
                        </>
                    }
                    control={control}
                    setValue={setValue}
                    register={register}
                />
                <FloatingMaskedInput
                    name="numero"
                    label={
                        <>
                            <NumberOutlined /> Número
                        </>
                    }
                    control={control}
                    setValue={setValue}
                    register={register}
                />
                <FloatingMaskedInput
                    name="complemento"
                    label={
                        <>
                            <ApartmentOutlined /> Complemento
                        </>
                    }
                    control={control}
                    setValue={setValue}
                    register={register}
                />
                <FloatingMaskedInput
                    name="bairro"
                    label={
                        <>
                            <HomeOutlined /> Bairro
                        </>
                    }
                    control={control}
                    setValue={setValue}
                    register={register}
                />
                <FloatingMaskedInput
                    name="cidade"
                    label={
                        <>
                            <PushpinOutlined /> Cidade
                        </>
                    }
                    control={control}
                    setValue={setValue}
                    register={register}
                />
                <FloatingMaskedInput
                    name="uf"
                    label="UF"
                    control={control}
                    setValue={setValue}
                    register={register}
                />

                <CEPInput
                    name="cep"
                    label="CEP"
                    control={control}
                    setValue={setValue}
                />

            </Grid2>
        </FormSection>
    );
}
