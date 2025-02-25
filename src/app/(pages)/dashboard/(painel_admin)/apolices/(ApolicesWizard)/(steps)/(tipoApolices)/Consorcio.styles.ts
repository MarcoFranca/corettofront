// 📂 src/components/ApolicesWizard/steps/tipoApolices/Consorcio.styles.ts
import styled from "styled-components";
import { Checkbox } from "antd";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";

export const ConsorcioGrid = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
`;

export const Input = styled(FloatingMaskedInput)`
    margin-top: 15px;
    
`

export const SectionTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    color: #4a4a4a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 0.5rem;
`;

export const OptionalSection = styled.div`
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 6px;
    border: 1px dashed #d0d0d0;
    background-color: #f9f9f9;
`;

export const PaymentSection = styled(OptionalSection)`
    background-color: #f3faff;
    border-color: #a5d8ff;
    margin-top: 1rem;
`;

export const TextArea = styled.textarea`
    width: 100%;
    height: 100px;
    padding: 0.6rem;
    border-radius: 6px;
    border: 1px solid #d0d0d0;
    font-size: 1rem;
    resize: vertical;
    &:focus {
        outline-color: #1890ff;
    }
`;

export const CheckboxContainer = styled.div`
    padding: 1rem;
    background-color: #f7f9fc;
    border-radius: 12px;
    border: 1px solid #dce3f5;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease-in-out;
    .ant-btn {
        border-radius: 8px;
        transition: all 0.3s;
        &:hover {
            background-color: #e0f7fa;
            border-color: #00acc1;
            color: #00796b;
            transform: translateY(-2px);
        }

        &.ant-btn-default {
            background-color: #ffffff;
            color: #00796b;
        }
    }
`;

export const CheckboxGroupStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #dce3f5;
    background-color: #f7f9fc;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
`;

export const StyledCheckbox = styled(Checkbox)`
  font-size: 0.95rem;
    width: 45%;
  color: #2c3e50;
  .ant-checkbox-inner {
    border-radius: 4px;
  }

  &:hover {
    color: #1890ff;
    .ant-checkbox-inner {
      border-color: #1890ff;
    }
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #1890ff;
    border-color: #1890ff;
  }
`;

export const CheckboxTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
`;



