
import styled from "styled-components";

export const Container = styled.div`
  padding: 1rem;
`;

export const Title = styled.h3`
  margin-bottom: 1rem;
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const Textarea = styled.textarea`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: vertical;
`;

export const Button = styled.button`
  background-color: #042a75;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0640a8;
  }
`;

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ActivityItem = styled.div`
  border: 1px solid #eee;
  padding: 0.75rem;
  border-radius: 4px;
  background: #f9f9f9;
`;

export const Label = styled.label`
  font-weight: 600;
`;
