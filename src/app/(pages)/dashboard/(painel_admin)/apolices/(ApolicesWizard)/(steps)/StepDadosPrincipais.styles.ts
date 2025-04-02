import styled from "styled-components";

export const StepSection = styled.div`
    margin-bottom: 2rem;
`;

export const SectionTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    color: #4a4a4a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
`;

export const InputGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.2rem;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
`;
