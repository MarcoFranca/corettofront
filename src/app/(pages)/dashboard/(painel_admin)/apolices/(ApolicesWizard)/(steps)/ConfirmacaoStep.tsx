/* ConfirmacaoStep.tsx - Passo 5: Revisão */
import React from 'react';
import { Descriptions, Button } from 'antd';

const ConfirmacaoStep = ({ values, onSubmit }: { values: any; onSubmit: () => void }) => (
    <div>
        <h3>📃 Revisão da Apólice</h3>
        <Descriptions bordered>
            <Descriptions.Item label="Número da Apólice">{values.numeroApolice}</Descriptions.Item>
            <Descriptions.Item label="Data de Início">{values.dataInicio?.format('DD/MM/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Coberturas">{values.coberturas?.join(', ')}</Descriptions.Item>
        </Descriptions>
        <Button type="primary" onClick={onSubmit}>✅ Confirmar</Button>
    </div>
);
export default ConfirmacaoStep;
