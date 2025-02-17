// 📂 src/components/ApolicesWizard/steps/StepCoberturas.tsx
"use client";

import React from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
    StepContainer,
    FormGroup,
    Label,
    StyledInput,
    CoberturaItem,
    RemoveButton,
    AddButton,
} from "./StepCoberturas.styles";

interface StepCoberturasProps {
    control: any;
}

const StepCoberturas: React.FC<StepCoberturasProps> = ({ control }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "coberturas",
    });

    return (
        <StepContainer>
            <Label>Adicione as coberturas para o Seguro de Vida:</Label>

            {fields.length === 0 && (
                <p style={{ fontStyle: "italic" }}>Nenhuma cobertura adicionada.</p>
            )}

            {fields.map((item, index) => (
                <CoberturaItem key={item.id}>
                    <FormGroup>
                        <Label>Descrição:</Label>
                        <Controller
                            name={`coberturas.${index}.descricao`}
                            control={control}
                            render={({ field }) => (
                                <StyledInput {...field} placeholder="Descrição da cobertura" />
                            )}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Valor (R$):</Label>
                        <Controller
                            name={`coberturas.${index}.valor`}
                            control={control}
                            render={({ field }) => (
                                <StyledInput {...field} type="number" placeholder="Valor" />
                            )}
                        />
                    </FormGroup>

                    <RemoveButton
                        icon={<DeleteOutlined />}
                        onClick={() => remove(index)}
                    />
                </CoberturaItem>
            ))}

            <AddButton
                icon={<PlusOutlined />}
                onClick={() =>
                    append({
                        descricao: "",
                        valor: "",
                    })
                }
            >
                Adicionar Cobertura
            </AddButton>
        </StepContainer>
    );
};

export default StepCoberturas;
