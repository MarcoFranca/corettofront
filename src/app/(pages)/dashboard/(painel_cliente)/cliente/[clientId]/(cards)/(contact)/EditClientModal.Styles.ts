// src/app/components/Modal/profile/EditClientModal.styles.ts
import styled, { keyframes } from "styled-components";
import InputMask from "react-input-mask"; // Máscara

// 🔹 Estilização do Container do Modal
export const ModalContainer = styled.div`
    //display: flex;
    //flex-direction: column;
    //gap: 16px;
`;

// 🔹 Estilização do Formulário
export const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 15px;
`;

// 🔹 Estilização dos Inputs e Labels
export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

// 🔹 Estilização da Área de Contatos Adicionais
export const AdditionalContacts = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const ContactRow = styled.div`
    display: flex;
    width: 100%;
`;

export const ContactSelect = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    height: 33px;
    gap: 8px;
    
    select {
        flex: 1;
        height: 100%;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
        margin: 0;
        cursor: pointer;        
    }

    input {
        flex: 1;
        padding: 8px;
        font-size: 0.9rem;
    }
`
// 🔥 Animação de "tremer" ao clicar
const shakeAnimation = keyframes`
    0% { transform: translateX(0); }
    20% { transform: translateX(-5px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
    100% { transform: translateX(0); }
`;

export const RemoveButton = styled.button`
    background-color: transparent;
    color: #f44336;
    border: none;
    cursor: pointer;
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
        transform: scale(1.3) rotate(-10deg); /* 🔄 Aumenta e gira um pouco */
        color: #d32f2f;
    }

    &:active {
        animation: ${shakeAnimation} 0.3s ease-in-out; /* 🎭 Tremer ao clicar */
    }
`;

export const AddButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 14px;
    margin-top: 10px;
    &:hover {
        background-color: #0056b3;
    }
`;

export const EmptyMessage = styled.p`
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
`;

export const PhoneInput = styled(InputMask)`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
`;
