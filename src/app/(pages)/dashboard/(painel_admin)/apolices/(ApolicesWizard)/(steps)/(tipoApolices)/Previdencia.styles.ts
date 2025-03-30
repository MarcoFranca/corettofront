// 📂 tipoApolices/Previdencia.styles.ts
import styled from "styled-components";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import SelectCustom from "@/app/components/ui/select/SelectCustom";

export const PrevidenciaGrid = styled.div`
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 1rem;
`;

export const Input = styled(FloatingMaskedInput)`
    margin-top: 15px;
`;

export const SelectStyled = styled(SelectCustom)`
    margin-top: 15px;
`;

export const SectionTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
    padding-bottom: 0.5rem;
`;
