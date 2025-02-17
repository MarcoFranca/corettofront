// TipoApoliceStep.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Select, Form } from 'antd';

const TipoApoliceStep: React.FC = () => {
    const { register } = useFormContext();

    return (
        <Form layout="vertical">
            <Form.Item label="Tipo de Apólice">
                <Select {...register('tipo_apolice')} placeholder="Selecione o tipo">
                    <Select.Option value="consorcio">Consórcio</Select.Option>
                    <Select.Option value="seguro_vida">Seguro de Vida</Select.Option>
                    <Select.Option value="plano_saude">Plano de Saúde</Select.Option>
                </Select>
            </Form.Item>
        </Form>
    );
};

export default TipoApoliceStep;

