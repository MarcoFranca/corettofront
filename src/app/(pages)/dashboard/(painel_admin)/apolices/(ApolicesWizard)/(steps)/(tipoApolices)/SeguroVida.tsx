import React from "react";
import { useFieldArray } from "react-hook-form";
import { DeleteOutlined } from "@ant-design/icons"; // ✅ Importando Ícones do Ant Design
import {
    Input, MoneyInputStyled
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/PlanoSaude.styles";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import {
    VidaGrid, OptionalSection, RemoveButton
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/SeguroVida.styles";
import {FaPlus} from "react-icons/fa";
import {Button} from "antd";
import {pagamentoOptions, parentescoOptions} from "@/utils/statusOptions";

interface SeguroVidaProps {
    control: any;
    setValue: any;
    watch: any;
    register: any;
}

const SeguroVida: React.FC<SeguroVidaProps> = ({ control, setValue, register }) => {
    const { fields: beneficiarios, append: addBeneficiario, remove: removeBeneficiario } = useFieldArray({
        control,
        name: "detalhes.beneficiarios",
    });

    return (
        <>
            <VidaGrid>
                <MoneyInputStyled
                    control={control}
                    setValue={setValue}
                    name="premio_pago_money"
                    label="💎 Prêmio Pago"
                    required
                />

                <Input
                    control={control}
                    setValue={setValue}
                    register={register}
                    name="detalhes.subcategoria"
                    label="📁 Categoria do Seguro"
                    required
                />
                <Input
                    control={control}
                    setValue={setValue}
                    register={register}
                    name="detalhes.classe_ajuste"
                    label="⚖️ Classe de Ajuste"
                />

                <SelectCustom
                    control={control}
                    name="forma_pagamento"
                    label="💰 Forma de Pagamento"
                    options={pagamentoOptions}
                    required
                />

                <SelectCustom
                    control={control}
                    name="periodicidade_pagamento"
                    label="🗓️ Periodicidade do Prêmio"
                    options={[
                        { value: "mensal", label: "Mensal" },
                        { value: "anual", label: "Anual" }
                    ]}
                    required
                />
            </VidaGrid>

            <OptionalSection>
                <h3>👨‍👩‍👧 Beneficiários</h3>
                {beneficiarios.map((item, index) => (
                    <div key={item.id}>
                        <VidaGrid>
                            <Input
                                control={control}
                                setValue={setValue}
                                register={register}
                                name={`detalhes.beneficiarios.${index}.nome`}
                                label="👤 Nome do Beneficiário"
                                required
                            />

                            <Input
                                name={`detalhes.beneficiarios.${index}.data_nascimento`}
                                label="🎂 Data de Nascimento"
                                type="date"
                                control={control}
                                setValue={setValue}
                                register={register}
                                required={false}
                            />

                            <SelectCustom
                                control={control}
                                name={`detalhes.beneficiarios.${index}.parentesco`}
                                label="🧬 Parentesco"
                                options={parentescoOptions}
                                required
                            />

                            <Input
                                control={control}
                                setValue={setValue}
                                register={register}
                                type="number"
                                name={`detalhes.beneficiarios.${index}.percentual`}
                                label="📊 Percentual"
                                onChange={(e) => {
                                    const value = Number(e.target.value) || 0;  // ✅ Converte para número
                                    setValue(`detalhes.beneficiarios.${index}.percentual`, value, { shouldValidate: true });
                                }}
                                required
                            />

                            {/* ✅ Ícone de lixeira para remover beneficiário */}
                            <RemoveButton
                                icon={<DeleteOutlined />}
                                onClick={() => removeBeneficiario(index)}
                            />
                        </VidaGrid>
                    </div>
                ))}
                {/* ✅ Botão Moderno para Adicionar Beneficiário */}
                <Button type="dashed" onClick={() => addBeneficiario({ nome: "", data_nascimento: "", percentual: 0 })} block>
                    <FaPlus /> Adicionar Beneficiário
                </Button>
            </OptionalSection>

        </>
    );
};

export default SeguroVida;
