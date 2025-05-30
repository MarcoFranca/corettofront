"use client";

import React from "react";
import { useFieldArray } from "react-hook-form";
import { DeleteOutlined } from "@ant-design/icons";
import {
    CoberturaGrid, CoberturaSection, RemoveButton, Input
} from "./StepCoberturas.styles";
import SelectCobertura from "@/app/components/ui/select/SelectCoberturas/SelectCoberturas";
import {FaPlus} from "react-icons/fa";
import {Button} from "antd";
import {
    MoneyInputStyled
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/PlanoSaude.styles";

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
                        <SelectCobertura
                            control={control}
                            name={`detalhes.coberturas.${index}.nome_id`}
                            label="🏷️ Nome da Cobertura"
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

                        <MoneyInputStyled
                            control={control}
                            setValue={setValue}
                            name={`detalhes.coberturas.${index}.capital_segurado_money`}
                            label="💰 Capital Segurado"
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

                        <Input
                            control={control}
                            setValue={setValue}
                            register={register}
                            name={`detalhes.coberturas.${index}.data_expiracao`}
                            label="📅 Data de Expiração"
                            type="date"
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
            <Button type="dashed" onClick={() => addCobertura({ nome: "", subclasse: "", capital_segurado: 0,  classe_ajuste: "", })} block>
                <FaPlus /> Adicionar Cobertura
            </Button>
        </CoberturaSection>
    );
};

export default StepCoberturas;
