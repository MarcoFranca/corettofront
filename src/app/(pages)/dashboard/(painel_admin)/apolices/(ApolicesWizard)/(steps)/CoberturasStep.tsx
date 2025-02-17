/* CoberturasStep.tsx - Passo 4: Coberturas */
import React from 'react';
import { Checkbox, Form } from 'antd';
import { Controller } from 'react-hook-form';

const CoberturasStep = ({ control }: { control: any }) => (
    <div>
        <h3>✅ Coberturas</h3>
        <Form.Item label="Coberturas Incluídas">
            <Controller
                name="coberturas"
                control={control}
                render={({ field }) => (
                    <Checkbox.Group {...field} options={['Básica', 'Acidentes', 'Roubo', 'Incêndio']} />
                )}
            />
        </Form.Item>
    </div>
);
export default CoberturasStep;

