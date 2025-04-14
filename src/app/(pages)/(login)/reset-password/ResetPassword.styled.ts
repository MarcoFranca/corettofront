import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';

export const FormWrapper = styled.div`
    height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #eef3fb, #dff4ff);
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const StyledForm = styled.form`
    max-width: 420px;
    width: 100%;
    background: #fff;
    padding: 2.5rem 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const StyledImage = styled(Image)`
    width: 80px;
    height: auto;
    margin-bottom: 1.5rem;
`;

export const StyledTitle = styled.h1`
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 0.5rem;
    color: #042a75;
`;

export const StyledParagraph = styled.p`
    font-size: 14px;
    color: #444;
    text-align: center;
    margin-bottom: 2rem;
`;

export const StyledInput = styled.input`
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #f9f9f9;
    font-size: 14px;
    margin-bottom: 1rem;

    &::placeholder {
        color: #999;
    }
`;

export const StyledButton = styled.button`
    width: 100%;
    height: 44px;
    border: none;
    background-color: #4285f4;
    color: white;
    font-size: 15px;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background-color: #357ae8;
    }

    &:disabled {
        background-color: #a0c2f4;
        cursor: not-allowed;
    }
`;

export const Message = styled.p`
    margin-top: 1.25rem;
    text-align: center;
    font-size: 14px;
    color: #cc0000;
    font-weight: bold;
`;

export const StyledLink = styled(Link)`
    font-size: 14px;
    color: #2163a5;
    font-weight: bold;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

export const BackToLogin = styled(Link)`
    margin-top: 1.5rem;
    font-size: 14px;
    text-align: center;
    padding: 12px;
    border-top: 1px solid #ccc;
    width: 100%;
    background: #f0f0f0;
    color: #494c4e;
    font-weight: 500;
    transition: 0.2s;

    &:hover {
        color: #999;
    }
`;

export const Spinner = styled.div`
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #fff;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    margin-left: 10px;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
