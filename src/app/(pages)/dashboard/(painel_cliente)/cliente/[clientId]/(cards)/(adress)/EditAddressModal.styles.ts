import styled from "styled-components";

export const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: relative; /* ✅ Garante que os ícones possam ser posicionados corretamente */

    label {
        font-weight: bold;
        color: #333;
    }

    svg {
        position: absolute;
        right: 10px; /* ✅ Alinha os ícones à direita */
        top: 50%;
        transform: translateY(-50%);
        color: #007bff;
    }
`;

export const Row = styled.div`
    display: flex;
    gap: 10px;
`;

export const ModalActions = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`;

export const ConfirmButton = styled.button`
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: #45a049;
    }
`;

export const CancelButton = styled.button`
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: #e53935;
    }
`;
