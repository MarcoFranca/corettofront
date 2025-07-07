'use client';
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormSection, Grid2 } from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(drawer)/edit/EditClientDrawer.styles";
import { Input, Switch } from "antd";
import {Cliente} from "@/types/interfaces";

interface Props {
    cliente: Cliente;
}

export default function EditSaudeSection({ cliente }: Props) {
    const { control, setValue, register } = useFormContext();

    return (
        <FormSection>
            <Grid2>
                <Controller
                    name="peso"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} type="number" placeholder="Peso (kg)" />
                    )}
                />
                <Controller
                    name="altura"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} type="number" step="0.01" placeholder="Altura (m)" />
                    )}
                />
                <Controller
                    name="doenca_preexistente"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Doença preexistente" />
                    )}
                />
                <Controller
                    name="tem_doenca_preexistente"
                    control={control}
                    render={({ field }) => (
                        <Switch checked={field.value} onChange={field.onChange} checkedChildren="Sim" unCheckedChildren="Não" />
                    )}
                />
                <Controller
                    name="historico_familiar_doencas"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Histórico familiar de doenças" />
                    )}
                />
                <Controller
                    name="tem_historico_familiar_doencas"
                    control={control}
                    render={({ field }) => (
                        <Switch checked={field.value} onChange={field.onChange} checkedChildren="Sim" unCheckedChildren="Não" />
                    )}
                />
            </Grid2>
        </FormSection>
    );
}
