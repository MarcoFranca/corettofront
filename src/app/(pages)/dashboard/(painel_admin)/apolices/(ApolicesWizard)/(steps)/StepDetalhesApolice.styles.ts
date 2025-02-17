// 📂 src/components/ApolicesWizard/steps/StepDetalhesApolice.styles.ts
import styled from "styled-components";
import { Input, Switch } from "antd";

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const StyledInput = styled(Input)`
  height: 40px;
  border-radius: 6px;
`;

export const StyledSwitch = styled(Switch)`
  margin-top: 5px;
`;
