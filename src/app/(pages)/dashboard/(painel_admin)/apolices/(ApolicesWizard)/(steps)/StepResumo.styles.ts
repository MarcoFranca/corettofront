// 📂 src/components/ApolicesWizard/steps/StepResumo.styles.ts
import styled from "styled-components";

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const ResumoCard = styled.div`
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

export const CoberturasList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #ddd;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;
