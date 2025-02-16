import styled from "styled-components";

// 🔹 Container Principal
export const Container = styled.div`
    max-width: 1200px;
    margin: auto;
    padding: 20px;
`;

// 🔹 Título da Página
export const Title = styled.h2`
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
`;

// 🔹 Botão Estilizado
export const StyledButton = styled.button`
    background-color: #007bff;
    color: white;
    font-size: 16px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
    
    &:hover {
        background-color: #0056b3;
    }
`;

// 🔹 Loader e Mensagem de Erro
export const LoadingMessage = styled.p`
    text-align: center;
    font-size: 16px;
    color: #007bff;
`;

export const ErrorMessage = styled.p`
    text-align: center;
    font-size: 16px;
    color: red;
`;

