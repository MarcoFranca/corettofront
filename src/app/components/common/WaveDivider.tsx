// src/app/components/common/WaveDivider.tsx
'use client';
import styled from 'styled-components';

export const WaveDivider = ({ rotate = false }) => {
    return (
        <DividerWrapper rotate={rotate}>
            <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                <path d="M0.00,49.98 C150.00,150.00 349.37,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" />
            </svg>
        </DividerWrapper>
    );
};

const DividerWrapper = styled.div<{ rotate?: boolean }>`
    width: 100%;
    height: 100px;
    overflow: hidden;
    line-height: 0;
    margin-top: -1px;
    background: linear-gradient(135deg, #eef3fb 0%, #dff4ff 100%);

    svg {
        transform: ${({ rotate }) => (rotate ? 'rotate(180deg)' : 'rotate(0deg)')};
        position: relative;
        display: block;
        width: calc(100% + 1.3px);
        height: 100px;
    }

    path {
        fill: #f5f9ff; // cor de fundo da próxima seção
    }
`;
