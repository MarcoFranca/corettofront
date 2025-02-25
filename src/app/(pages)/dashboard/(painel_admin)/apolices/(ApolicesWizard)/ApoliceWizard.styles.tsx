// 📂 src/components/ApolicesWizard/ApoliceWizard.styles.ts
import styled from "styled-components";
import {Drawer, Steps} from "antd";


const { Step } = Steps;

// 🔥 Estilos Personalizados para os Steps
export const CustomSteps = styled(Steps)`
    .ant-steps-item-title {
        font-size: 55px;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.text};
        transition: color 0.3s ease-in-out;
    }

    .ant-steps-item-description {
        font-size: 12px;
        color: ${({ theme }) => theme.colors.text};
        opacity: 0.7;
    }

    /* Ícones dos Steps */
    .ant-steps-item-icon {
        background-color: ${({ theme }) => theme.colors.background};
        border-radius: 50%;
        transition: all 0.3s ease-in-out;
    }

    .ant-steps-item-icon:hover {
        transform: scale(1.1);
        box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
    }

    /* Passo ATUAL */
    .ant-steps-item-process .ant-steps-item-icon {
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
        font-weight: bold;
        border: 2px solid ${({ theme }) => theme.colors.primary};
    }

    .ant-steps-item-process .ant-steps-item-title {
        font-weight: bold;
        color: ${({ theme }) => theme.colors.primary};
    }

    /* Passo CONCLUÍDO */
    .ant-steps-item-finish .ant-steps-item-icon {
        background-color: ${({ theme }) => theme.colors.success};
        color: white;
        border: 2px solid ${({ theme }) => theme.colors.success};
    }

    .ant-steps-item-finish .ant-steps-item-title {
        color: ${({ theme }) => theme.colors.success};
        font-weight: bold;
    }

    /* Passo FUTURO */
    .ant-steps-item-wait .ant-steps-item-icon {
        background-color: ${({ theme }) => theme.colors.border};
        color: ${({ theme }) => theme.colors.text};
        border: 2px solid ${({ theme }) => theme.colors.border};
    }

    .ant-steps-item-wait .ant-steps-item-title {
        color: ${({ theme }) => theme.colors.text};
    }

    /* Linha de Conexão */
    .ant-steps-item-tail {
        border-color: ${({ theme }) => theme.colors.primary};
    }
`;


export const DrawerContainer = styled(Drawer)`
    .ant-drawer-content {
        background-color: ${({ theme }) => theme.colors.background}; /* ✅ Aplica o background */
    }

    .ant-drawer-header {
        background-color: ${({ theme }) => theme.colors.secondary}; /* ✅ Estiliza o cabeçalho */
        color: ${({ theme }) => theme.colors.text}; /* ✅ Altera a cor do título */
        font-size: 20px;
        font-weight: bold;
        padding: 16px 16px 16px 48px;
    }

    .ant-drawer-body {
        padding: 0;
        transition: all 0.3s ease-in-out
    }

    .ant-drawer-close {
        color: ${({ theme }) => theme.colors.text}; /* ✅ Altera a cor do botão "X" */
        font-size: 15px;
        transition: color 0.3s ease;

        &:hover {
            color: ${({ theme }) => theme.colors.error}; /* ✅ Muda a cor ao passar o mouse */
        }
    }

`;

export const WizardFullContainer = styled.div`
    height: 100% ;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.background};
    padding: 2rem;
    overflow-y: auto;
`;

export const StepContainer = styled.div`
    background-color: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    margin: 2rem 0;
`;

export const StepGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const StepTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 0.5rem;
`;

export const StepSubtitle = styled.p`
    font-size: 0.95rem;
    color: #7f8c8d;
    margin-bottom: 1.5rem;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
`;

export const StyledButton = styled.button<{ variant?: "secondary" }>`
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
    background-color: ${({ variant }) =>
            variant === "secondary" ? "#d9d9d9" : "#1890ff"};
    color: ${({ variant }) => (variant === "secondary" ? "#333" : "#fff")};
    &:hover {
        background-color: ${({ variant }) =>
                variant === "secondary" ? "#bfbfbf" : "#40a9ff"};
    }
`;
