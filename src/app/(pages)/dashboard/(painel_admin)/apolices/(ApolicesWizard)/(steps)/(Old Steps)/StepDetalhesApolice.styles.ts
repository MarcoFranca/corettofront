import styled from "styled-components";
import { Switch, Button } from "antd";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";

export const StepContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Input = styled(FloatingMaskedInput)`
    margin-top: 15px;
`


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

// ✅ Adicionamos o `StyledButton`
export const StyledButton = styled(Button)`
  background-color: #1890ff;
  color: white;
  border-radius: 5px;
  margin-top: 10px;
  &:hover {
    background-color: #40a9ff;
  }
`;
