import styled from "styled-components";

export const ModalContainer = styled.div`
    padding: 20px;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const ModalActions = styled.div`
    display: flex;
    width: 100%;  /* ✅ Ocupa toda a largura */
    margin-top: 10px;
`;

export const FullWidthButton = styled.button`
    width: 100%;  /* ✅ Garante que o botão ocupe 100% */
    text-align: center;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px; /* Adiciona espaço entre o ícone e o texto */
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
        //background-color: #ccc;
        opacity: ${({ disabled }) => (disabled ? 0.5 : 1)}; // 🔥 Deixa o botão "apagado" se desabilitado
        cursor: not-allowed;    
    }

    .spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top: 4px solid #fff;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        animation: spin 1s linear infinite;
        margin-left: 10px; /* Ajuste o espaçamento do spinner */
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

