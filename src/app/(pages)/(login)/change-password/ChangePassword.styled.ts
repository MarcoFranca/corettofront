import styled from 'styled-components';

export const PageWrapper = styled.div`
    height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #eef3fb, #dff4ff);
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const FormCard = styled.div`
    background: #fff;
    padding: 2.5rem 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    width: 100%;
    max-width: 420px;
`;

export const Title = styled.h1`
    text-align: center;
    color: #042a75;
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
`;

export const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const StyledInput = styled.input`
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #f9f9f9;
    font-size: 14px;

    &::placeholder {
        color: #999;
    }
`;

export const StyledButton = styled.button`
    padding: 12px;
    background-color: #4285f4;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #357ae8;
    }

    &:disabled {
        background-color: #a0c2f4;
        cursor: not-allowed;
    }
`;

export const Message = styled.p`
    text-align: center;
    margin-top: 1rem;
    font-size: 14px;
    font-weight: bold;
    color: #cc0000;
`;
