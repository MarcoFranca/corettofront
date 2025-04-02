import styled from "styled-components";
import { Button } from "antd";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";

export const CoberturaGrid = styled.div`
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 1rem;
`;

export const CoberturaSection = styled.div`
    padding: 1rem;
    border-radius: 6px;
    border: 1px dashed ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.background};
`;

// ✅ Botão Moderno para Adicionar Cobertura
export const AddButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    margin-top: 1rem;
`;

// ✅ Ícone de Lixeira para Remover Cobertura
export const RemoveButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    border-radius: 50%;
    margin-left: 1rem;
`;

export const Input = styled(FloatingMaskedInput)`
    margin-top: 15px;
`