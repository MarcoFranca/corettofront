// 📂 src/components/ApolicesWizard/ApoliceWizard.styles.ts
import styled from "styled-components";

export const WizardFullContainer = styled.div`
    height: 100% ;
    display: flex;
    flex-direction: column;
    background-color: #f7f9fc;
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
