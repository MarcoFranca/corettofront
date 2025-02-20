import styled from "styled-components";

// Container principal do input
export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
`;

// Wrapper para efeito flutuante
export const FloatingLabelWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;

    input {
        padding-top: 16px; /* Dá espaço para o label flutuar */
    }
`;

// Wrapper para rótulo fixo (quando floatLabel=false)
export const StaticLabelWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

// Estilo do input
export const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s ease-in-out;

    &:focus {
        border-color: #007bff;
        outline: none;
    }

    &:focus ~ label,
    &:not(:placeholder-shown) ~ label {
        top: -7px;
        font-size: 14px;
        color: #007bff;
        background-color: white;
    }
`;

// Rótulo do input (flutuante)
export const Label = styled.label`
    background: transparent;
    padding: 0 4px;
    transition: all 0.3s ease-in-out;
    pointer-events: none;
    font-size: 16px;
    color: #888;

    &.float {
        position: absolute;
        top: 12px;
        left: 12px;
        font-size: 14px;
        color: #888;
    }

    &.static-label {
        position: relative;
        top: 0;
        left: 0;
        transform: none;
        font-size: 16px;
        color: #007bff;
        margin-bottom: 4px; /* 🔥 Agora o rótulo fica fixo acima do input */
    }
`;

// Indicador de campo obrigatório
export const Required = styled.span`
    color: red;
    margin-left: 4px;
    font-size: 12px;
`;

// Mensagem de erro
export const ErrorMessage = styled.p`
    color: red;
    font-size: 12px;
    margin-top: 4px;
`;


