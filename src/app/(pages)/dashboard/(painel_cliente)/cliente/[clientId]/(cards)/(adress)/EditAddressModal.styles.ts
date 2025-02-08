import styled from "styled-components";

export const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
`;

export const Row = styled.div`
    display: flex;
    gap: 10px;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;

    label {
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 5px;
        color: #333;
    }
`;

export const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
    }
`;

export const ModalActions = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`;

export const ConfirmButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #45a049;
  }
`;

export const CancelButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #e53935;
  }
`;
