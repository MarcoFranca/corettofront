"use client";

import React from "react";
import { useFieldArray } from "react-hook-form";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import {
    CoberturaGrid, CoberturaSection, RemoveButton, AddButton, Input
} from "./StepCoberturas.styles";

interface StepCoberturasProps {
    control: any;
    setValue: any;   // ✅ Adicionado
    register: any;   // ✅ Adicionado
    watch:any;
    tipoApolice: string;
}

const StepCoberturas: React.FC<StepCoberturasProps> = ({ control, setValue, register }) => {
    const { fields: coberturas, append: addCobertura, remove: removeCobertura } = useFieldArray({
        control,
        name: "detalhes.coberturas",
    });

    return (
        <CoberturaSection>
            <h3>🛡️ Coberturas</h3>

            {coberturas.length === 0 && (
                <p style={{ fontStyle: "italic" }}>Nenhuma cobertura adicionada.</p>
            )}

            {coberturas.map((item, index) => (
                <div key={item.id}>
                    <CoberturaGrid>
                        {/* Nome da Cobertura (Selecionável) */}
                        <SelectCustom
                            control={control}
                            name={`detalhes.coberturas.${index}.nome_id`}  // ✅ Agora estamos garantindo que `nome_id` será corretamente identificado
                            label="🏷️ Nome da Cobertura"
                            options={[
                                { value: "0d6a372c-eacd-4302-abf5-15a16da733d3", label: "DIT - Diária por Incapacidade Temporária" },
                                { value: "e22cdd4a-733e-4b0c-85e2-fa0581a8019b", label: "Doenças Graves" },
                                { value: "199685cc-73e9-4889-bb96-2061be27011e", label: "Morte Acidental" },
                                { value: "bdb15f6f-932f-4b1e-a39c-6778b93f7481", label: "Cirurgia" },
                                { value: "9c00d6b6-c847-43f6-93c9-481b7d419354", label: "Perda de Autonomia Pessoal" },
                                { value: "1a2e0d83-3277-4981-a795-1a18427b5a2d", label: "Assistência Funeral" }
                            ]}
                            required
                        />

                        {/* Subclasse */}
                        <Input
                            control={control}
                            setValue={setValue}
                            register={register}
                            name={`detalhes.coberturas.${index}.subclasse`}
                            label="📂 Subclasse"

                        />

                        {/* Capital Segurado */}
                        <Input
                            control={control}
                            setValue={setValue}
                            register={register}
                            name={`detalhes.coberturas.${index}.capital_segurado`}
                            label="💰 Capital Segurado"
                            type="money"
                            required
                        />

                        <Input
                            control={control}
                            setValue={setValue}
                            register={register}
                            name={`detalhes.coberturas.${index}.classe_ajuste`}
                            label="⚖️ Classe de Ajuste"
                            required={false}
                        />

                        {/* Botão de Remover Cobertura */}
                        <RemoveButton
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => removeCobertura(index)}
                        />
                    </CoberturaGrid>
                </div>
            ))}

            {/* Botão Moderno para Adicionar Cobertura */}
            <AddButton
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => addCobertura({ nome: "", subclasse: "", capital_segurado: 0 })}
            >
                Adicionar Cobertura
            </AddButton>
        </CoberturaSection>
    );
};

export default StepCoberturas;
