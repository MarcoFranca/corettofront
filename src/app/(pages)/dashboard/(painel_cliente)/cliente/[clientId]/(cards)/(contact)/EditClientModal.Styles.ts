// src/app/components/Modal/profile/EditClientModal.styles.ts
import styled from "styled-components";

// 🔹 Estilização do Container do Modal
export const ModalContainer = styled.div`
    background-color: white;
    max-width: 100%;
    z-index: 1000;
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
    margin-top: 20px;
    width: 100%;
`;

export const ContactRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 10px;
    margin-top: 8px;
    //background-color: #0c2859;
`;

export const RemoveButton = styled.button`
    background-color: transparent;
    border: none;
    color: red;
    font-size: 1.2rem;
    cursor: pointer;
    &:hover {
        transform: scale(1.1);
        transition: transform 0.3s ease-in-out;
    }
`;

export const AddButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
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

