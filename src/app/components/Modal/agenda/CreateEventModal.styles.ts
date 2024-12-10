import styled from 'styled-components';

// Wrapper principal do formulário
export const ModalContent = styled.div`
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 0 auto;
`;

// Título do modal
export const Title = styled.h2`
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
`;

// Estilo dos labels
export const Label = styled.label`
    display: flex;
    flex-direction: column;
    font-size: 16px;
    color: #555;
    margin-bottom: 15px;

    input, textarea, select {
        margin-top: 8px;
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 4px;
        transition: border-color 0.3s;

        &:focus {
            border-color: #3174ad;
            outline: none;
        }
    }

    textarea {
        resize: vertical;
        min-height: 80px;
    }
`;

// Botões do modal
export const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    button {
        padding: 10px 15px;
        font-size: 14px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:disabled {
            cursor: not-allowed;
            background-color: #ccc;
        }
    }

    .save {
        background-color: #3174ad;
        color: #fff;

        &:hover {
            background-color: #245f90;
        }
    }

    .cancel {
        background-color: #f5f5f5;
        color: #555;

        &:hover {
            background-color: #e2e2e2;
        }
    }
`;
