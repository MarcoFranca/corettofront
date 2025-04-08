// ProgressBars.tsx
'use client';

import React from 'react';
import { Progress } from 'antd';
import styled from 'styled-components';

interface MetaProgress {
    titulo: string;
    valorAtual: number;
    valorMeta: number;
}

interface Props {
    metas: MetaProgress[];
}

const LinhaContainer = styled.div`
  margin-top: 2rem;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MetaCard = styled.div`
  margin-bottom: 20px;
`;

const Titulo = styled.h4`
  margin-bottom: 0.5rem;
`;

const ProgressBars: React.FC<Props> = ({ metas }) => {
    return (
        <LinhaContainer>
            <h3>🎯 Progresso de Metas</h3>
            {metas.map((meta, index) => {
                const percentual = (meta.valorAtual / meta.valorMeta) * 100;
                return (
                    <MetaCard key={index}>
                        <Titulo>{meta.titulo}</Titulo>
                        <Progress percent={parseFloat(percentual.toFixed(1))} status="active" />
                    </MetaCard>
                );
            })}
        </LinhaContainer>
    );
};

export default ProgressBars;
