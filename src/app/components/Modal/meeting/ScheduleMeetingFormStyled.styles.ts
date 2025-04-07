// components/negociacao/ScheduleMeetingFormStyled.styles.ts
import styled from 'styled-components';

export const ModalContainer = styled.div`
  position: fixed;
  z-index: 2000;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);

  h3 {
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
    font-weight: 600;
    color: #042a75;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const FieldLabel = styled.label`
  font-weight: 500;
  font-size: 0.95rem;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #33cccc;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.6rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #33cccc;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    color: #444;
  }

  input[type="checkbox"] {
    transform: scale(1.2);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.5rem;
`;

export const PrimaryButton = styled.button`
  background-color: #042a75;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #03329b;
  }
`;

export const CancelButton = styled.button`
  background-color: #ccc;
  color: #333;
  border: none;
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #bbb;
  }
`;
