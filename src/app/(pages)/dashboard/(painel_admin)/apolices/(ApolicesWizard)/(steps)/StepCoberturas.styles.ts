// 📂 src/components/ApolicesWizard/steps/StepCoberturas.styles.ts
import styled from "styled-components";
import { Input, Button } from "antd";

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

export const CoberturaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #f7f7f7;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

export const RemoveButton = styled(Button)`
  color: #ff4d4f;
  border: none;
  &:hover {
    color: #d9363e;
  }
`;

export const AddButton = styled(Button)`
  width: 100%;
  background-color: #1890ff;
  color: white;
  &:hover {
    background-color: #40a9ff;
  }
`;
