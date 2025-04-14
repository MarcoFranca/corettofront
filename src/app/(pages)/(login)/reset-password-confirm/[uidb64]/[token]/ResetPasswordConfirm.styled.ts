import styled from 'styled-components';

export const FormWrapper = styled.div`
  height: 100vh;
  width: 100%;
    background: linear-gradient(135deg, #eef3fb, #dff4ff);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledForm = styled.form`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StyledTitle = styled.h1`
  text-align: center;
  font-size: 1.5rem;
  color: #042a75;
`;

export const StyledInput = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: #f9f9f9;

  &::placeholder {
    color: #999;
  }
`;

export const StyledButton = styled.button`
  padding: 12px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #357ae8;
  }

  &:disabled {
    background-color: #a0c2f4;
    cursor: not-allowed;
  }
`;

export const Spinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Message = styled.p`
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
  color: #d32f2f;
`;
