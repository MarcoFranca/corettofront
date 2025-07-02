import styled from "styled-components";

export const DrawerFormWrapper = styled.div`
  padding: 8px 0 24px 0;
`;

export const Section = styled.div`
  margin-bottom: 24px;
`;

export const Fieldset = styled.fieldset`
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 18px 18px 10px 18px;
  margin-bottom: 20px;
`;

export const Legend = styled.legend`
  font-size: 1.15rem;
  font-weight: 600;
  color: #042a75;
  margin-bottom: 6px;
  background: #f6fbff;
  border-radius: 8px;
  padding: 0 10px;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 10px;
`;

export const SelectDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1rem;
  font-weight: 500;
`;

export const ResetIndicacao = styled.button`
  margin-left: 16px;
  font-size: 0.95rem;
  color: #1677ff;
  background: none;
  border: none;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

export const NameContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

export const ContatoContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

export const OpportunitySection = styled.div`
  margin-top: 18px;
`;

export const OpportunityGrid = styled.div`
  margin-bottom: 10px;
`;

export const OpportunityItem = styled.div`
  background: #f4faff;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 5px;
  font-size: 0.95rem;
`;

export const OpportunityButtonContainer = styled.div`
  margin-top: 10px;
`;

export const AddOpportunityButton = styled.button`
  display: flex;
  align-items: center;
  background: #33cccc;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #029fa3; }
`;

export const CadastrarProfissao = styled.button`
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  background: #eee;
  color: #042a75;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #d9f5ff; }
`;

export const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 0.96rem;
  margin-top: 4px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  background: #042a75;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 1.12rem;
  font-weight: 700;
  margin-top: 18px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover { background: #0650e0; }
  &:disabled { background: #c5cbe2; }
`;
