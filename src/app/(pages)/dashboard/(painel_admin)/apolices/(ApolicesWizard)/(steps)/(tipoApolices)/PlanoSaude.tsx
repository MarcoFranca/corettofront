import React, { useState } from 'react';
import { Controller } from "react-hook-form";
import {
    PlanoSaudeGrid,
    SectionTitle,
    Input,
    OptionalSection,
    SwitchContainer,
    SwitchLabel
} from "./PlanoSaude.styles";
import { Switch, Button } from "antd";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import { FaPlus, FaTrash } from "react-icons/fa";

interface PlanoSaudeProps {
    control: any;
    setValue: any;
    register: any;
    watch: any;
}

const tipoContratanteOptions = [
    { value: "PF", label: "Pessoa Física" },
    { value: "PJ", label: "Pessoa Jurídica" },
];

const parentescoOptions = [
    { value: "Titular", label: "Titular" },
    { value: "Conjuge", label: "Cônjuge" },
    { value: "Filho", label: "Filho" },
    { value: "Enteado", label: "Enteado" },
    { value: "Pai/Mãe", label: "Pai/Mãe" },
    { value: "Outro", label: "Outro" },
];

const PlanoSaude: React.FC<PlanoSaudeProps> = ({ control, setValue, register, watch }) => {
    const [beneficiarios, setBeneficiarios] = useState([{ id: 0, nome: "", idade: "", parentesco: "" }]);

    // Adicionar um novo beneficiário
    const handleAddBeneficiario = () => {
        setBeneficiarios([...beneficiarios, { id: Date.now(), nome: "", idade: "", parentesco: "" }]);
    };

    // Remover beneficiário
    const handleRemoveBeneficiario = (id: number) => {
        setBeneficiarios(beneficiarios.filter(beneficiario => beneficiario.id !== id));
    };

    return (
        <>
            <SectionTitle>📋 Informações do Plano</SectionTitle>
            <PlanoSaudeGrid>
                <Input control={control} setValue={setValue}
                       register={register}
                       name="detalhes.premio_pago"
                       label="💎 Prêmio Pago (Valor do Plano)"
                       type="money" required />

                <Input control={control} setValue={setValue} register={register}
                       name="detalhes.categoria" label="📁 Categoria do Plano"
                       required />

                <SelectCustom control={control} name="detalhes.acomodacao" label="🏥 Acomodação"
                              options={[{ value: "Apartamento", label: "Apartamento" }, { value: "Enfermaria", label: "Enfermaria" }]} required />

                <SelectCustom control={control} name="detalhes.abrangencia" label="📍 Abrangência"
                              options={[{ value: "Nacional", label: "Nacional" }, { value: "Estadual", label: "Estadual" }, { value: "Regional", label: "Regional" }]} required />
            </PlanoSaudeGrid>

            <OptionalSection>
                <SectionTitle>👤 Dados do Contratante</SectionTitle>
                <PlanoSaudeGrid>
                    <SelectCustom control={control} name="detalhes.tipo_contratante" label="🧑‍💼 Tipo de Contratante"
                                  options={tipoContratanteOptions} required />

                    <Input control={control} setValue={setValue} register={register}
                           name="detalhes.cpf_cnpj" label="🔢 CPF/CNPJ"
                           required />
                </PlanoSaudeGrid>
            </OptionalSection>

            <OptionalSection>
                <SectionTitle>⚙️ Configurações Opcionais</SectionTitle>
                <PlanoSaudeGrid>
                    <Input control={control} setValue={setValue} register={register}
                           name="detalhes.valor_reembolso_consulta" label="💰 Reembolso Consulta (R$)"
                           type="money" />

                    <SwitchContainer>
                        <Controller name="detalhes.coparticipacao" control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <>
                                            <Switch checked={value} onChange={onChange} />
                                            <SwitchLabel>Coparticipação</SwitchLabel>
                                        </>
                                    )} />
                    </SwitchContainer>
                </PlanoSaudeGrid>
            </OptionalSection>

            {/* 🔹 Beneficiários */}
            <OptionalSection>
                <SectionTitle>👨‍👩‍👧 Beneficiários do Plano</SectionTitle>

                {beneficiarios.map((beneficiario, index) => (
                    <PlanoSaudeGrid key={beneficiario.id}>
                        <Input control={control} setValue={setValue} register={register}
                               name={`detalhes.beneficiarios[${index}].nome`} label="👤 Nome do Beneficiário" required />

                        <Input
                            name={`detalhes.beneficiarios.${index}.data_nascimento`}
                            label="🎂 Data de Nascimento"
                            type="date"
                            control={control}
                            setValue={setValue}
                            register={register}
                            required={false}
                        />

                        <SelectCustom control={control} name={`detalhes.beneficiarios[${index}].parentesco`} label="🧬 Parentesco"
                                      options={parentescoOptions} required />

                        <Button danger type="primary" onClick={() => handleRemoveBeneficiario(beneficiario.id)}>
                            <FaTrash /> Remover
                        </Button>
                    </PlanoSaudeGrid>
                ))}

                <Button type="dashed" onClick={handleAddBeneficiario} block>
                    <FaPlus /> Adicionar Beneficiário
                </Button>
            </OptionalSection>
        </>
    );
};

export default PlanoSaude;
