// src/app/components/Modal/profile/EditHealthModal.styles.ts
import styled from "styled-components";

export const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-top: 0.5rem;
`;

export const Label = styled.label`
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    color: #333;
    font-weight: 500;
`;

export const Input = styled.input`
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
    margin-top: 0.25rem;

    &:focus {
        border-color: #0070f3;
        outline: none;
    }
`;

export const TextArea = styled.textarea`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  margin-top: 0.25rem;
  min-height: 80px;
  resize: vertical;

  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`;
