import styled from "styled-components";

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
`;

export const Label = styled.label`
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 14px;
    color: #020f60;
    transition: all 0.2s ease-in-out;
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.2s ease;

    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

export const Required = styled.span`
    color: red;
    margin-left: 4px;
    font-size: 12px;
`;

/* 🔥 Floating Label Wrapper */
export const FloatingLabelWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;

    input {
        padding-top: 16px; /* Dá espaço para o label flutuar */
    }

    label {
        position: absolute;
        top: 50%;
        left: 12px;
        transform: translateY(-50%);
        background: white;
        padding: 0 4px;
        transition: all 0.2s ease-in-out;
        pointer-events: none;
    }

    input:focus ~ label,
    input:not(:placeholder-shown) ~ label {
        top: 0;
        font-size: 12px;
        color: #007bff;
    }
`;
