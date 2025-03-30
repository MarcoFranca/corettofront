import styled from "styled-components";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";

export const SeguroProfissionalGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
    padding: 1rem;
`;

export const Input = styled(FloatingMaskedInput)`
    margin-top: 10px;
`;

export const SectionTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
`;

export const SwitchContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 10px;
`;
