// 📂 src/components/ApolicesWizard/steps/StepDadosPrincipais.styles.ts
import styled from "styled-components";
import { Input, Select } from "antd";

// export const StepContainer = styled.div`
//     display: flex;
//     width: 100%;
//     height: 100%;
//     flex-direction: column;
//     gap: 1.5rem;
// `;

export const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;


// export const FormGroup = styled.div`
//     display: flex;
//     flex-direction: column;
// `;

export const Label = styled.label`
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
`;

export const StyledInput = styled(Input)`
    height: 40px;
    border-radius: 6px;
`;

export const StyledSelect = styled(Select)`
    width: 100%;
    height: 40px;
    border-radius: 6px;
`;
