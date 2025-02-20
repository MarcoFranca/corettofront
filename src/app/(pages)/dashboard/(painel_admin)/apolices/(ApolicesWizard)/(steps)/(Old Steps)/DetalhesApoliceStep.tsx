/* DetalhesApoliceStep.tsx - Passo 3: Detalhes da Apólice */
import React from 'react';
import { Input, DatePicker, Form } from 'antd';
import { Controller } from 'react-hook-form';

const DetalhesApoliceStep = ({ control }: { control: any }) => (
    <div>
        <h3>📑 Detalhes da Apólice</h3>
        <Form.Item label="Número da Apólice">
            <Controller name="numeroApolice" control={control} render={({ field }) => <Input {...field} />} />
        </Form.Item>
        <Form.Item label="Data de Início">
            <Controller name="dataInicio" control={control} render={({ field }) => <DatePicker {...field} />} />
        </Form.Item>
    </div>
);
export default DetalhesApoliceStep;

