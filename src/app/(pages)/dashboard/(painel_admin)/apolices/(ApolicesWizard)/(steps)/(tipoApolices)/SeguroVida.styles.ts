import styled from "styled-components";
import { Button } from "antd";

export const VidaGrid = styled.div`
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 1rem;
`;

export const OptionalSection = styled.div`
    padding: 1rem;
    border-radius: 6px;
    border: 1px dashed ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.background};
`;

// ✅ Botão Moderno para Adicionar Beneficiário
export const AddButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    margin-top: 1rem;
`;

// ✅ Ícone de Lixeira para Remover Beneficiário
export const RemoveButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-left: 1rem;
`;
