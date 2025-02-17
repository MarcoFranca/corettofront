// PagamentoStep.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, Form, DatePicker } from 'antd';

const PagamentoStep: React.FC = () => {
    const { register } = useFormContext();

    return (
        <Form layout="vertical">
            <Form.Item label="Forma de Pagamento">
                <Input {...register('pagamento.forma')} placeholder="Ex: Cartão, Boleto" />
            </Form.Item>
            <Form.Item label="Data de Início">
                <DatePicker {...register('pagamento.data_inicio')} style={{ width: '100%' }} />
            </Form.Item>
        </Form>
    );
};

export default PagamentoStep;
