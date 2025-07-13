"use client";

import React from "react";
import { Input, MoneyInputStyled } from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/PlanoSaude.styles";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import { Row, Col } from "antd";
import { combustivelOptions, categoriaVeiculoOptions, tipoCoberturaAutoOptions } from "@/utils/statusOptions"; // Crie opções padrão igual outros

interface SeguroAutoProps {
    control: any;
    setValue: any;
    register: any;
    watch: any;
}

const SeguroAuto: React.FC<SeguroAutoProps> = ({ control, setValue, register }) => {
    return (
        <div style={{ padding: "12px" }}>
            <Row gutter={16}>
                <Col span={12}>
                    <Input control={control} setValue={setValue} register={register} name="detalhes.marca" label="🚗 Marca" required />
                </Col>
                <Col span={12}>
                    <Input control={control} setValue={setValue} register={register} name="detalhes.modelo" label="🏷️ Modelo" required />
                </Col>
                <Col span={6}>
                    <MoneyInputStyled
                        control={control}
                        setValue={setValue}
                        name="premio_pago_money"
                        label="Prêmio Pago"
                        required
                    />
                </Col>
                <Col span={6}>
                    <Input control={control} setValue={setValue} register={register} type="number" name="detalhes.ano_fabricacao" label="Ano Fabricação" required />
                </Col>
                <Col span={6}>
                    <Input control={control} setValue={setValue} register={register} type="number" name="detalhes.ano_modelo" label="Ano Modelo" required />
                </Col>
                <Col span={6}>
                    <Input control={control} setValue={setValue} register={register} name="detalhes.placa" label="Placa" required />
                </Col>
                <Col span={6}>
                    <Input control={control} setValue={setValue} register={register} name="detalhes.chassi" label="Chassi" />
                </Col>
                <Col span={6}>
                    <Input control={control} setValue={setValue} register={register} name="detalhes.renavam" label="Renavam" />
                </Col>
                <Col span={6}>
                    <Input control={control} setValue={setValue} register={register} name="detalhes.cor" label="Cor" />
                </Col>
                <Col span={6}>
                    <SelectCustom control={control} name="detalhes.combustivel" label="Combustível" options={combustivelOptions} />
                </Col>
                <Col span={6}>
                    <SelectCustom control={control} name="detalhes.categoria_veiculo" label="Categoria" options={categoriaVeiculoOptions} />
                </Col>
                <Col span={6}>
                    <SelectCustom control={control} name="detalhes.tipo_cobertura" label="Tipo de Cobertura" options={tipoCoberturaAutoOptions} required />
                </Col>
                <Col span={6}>
                    <MoneyInputStyled control={control} setValue={setValue} name="detalhes.valor_veiculo" label="Valor do Veículo" required />
                </Col>
                <Col span={6}>
                    <MoneyInputStyled control={control} setValue={setValue} name="detalhes.valor_fipe" label="Valor FIPE" />
                </Col>
                <Col span={6}>
                    <Input control={control} setValue={setValue} register={register} name="detalhes.franquia" label="Franquia" required />
                </Col>
                <Col span={6}>
                    <Input control={control} setValue={setValue} register={register} name="detalhes.cep_pernoite" label="CEP Pernoite" />
                </Col>
                <Col span={6}>
                    <Input control={control} setValue={setValue} register={register} name="detalhes.cep_circulacao" label="CEP Circulação" />
                </Col>
                <Col span={6}>
                    <SelectCustom
                        control={control}
                        name="detalhes.possui_garagem"
                        label="Possui Garagem?"
                        options={[
                            { value: "true", label: "Sim" },
                            { value: "false", label: "Não" }
                        ]}
                    />
                </Col>
                <Col span={6}>
                    <SelectCustom
                        control={control}
                        name="detalhes.possui_rastreador"
                        label="Possui Rastreador?"
                        options={[
                            { value: "true", label: "Sim" },
                            { value: "false", label: "Não" }
                        ]}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default SeguroAuto;
