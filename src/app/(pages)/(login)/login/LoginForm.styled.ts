// LoginForm.styled.ts
import styled from 'styled-components';
import Image from 'next/image';

export const FormWrapper = styled.div`
    width: 100%;
    max-width: 380px;
    background: #ffffff;
    padding: 2.5rem 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const StyledLogo = styled(Image)`
    width: 180px;
    height: auto;
    margin-bottom: 1.5rem;
`;

export const StyledInput = styled.input`
    width: 100%;
    padding: 12px;
    margin-bottom: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    font-size: 14px;

    &::placeholder {
        color: #999;
    }
`;

export const PasswordWrapper = styled.div`
    position: relative;
    width: 100%;
`;

export const TogglePasswordIcon = styled.span`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #777;
`;

export const StyledButton = styled.button`
    width: 100%;
    height: 44px; /* Fixar altura */
    padding: 0 20px;
    border: none;
    background-color: #4285f4;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    border-radius: 8px;
    margin-top: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:hover {
        background-color: #357ae8;
    }

    &:disabled {
        background-color: #a0c2f4;
        cursor: not-allowed;
    }
`;

export const Spinner = styled.div`
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;


export const Message = styled.p`
    margin-top: 1rem;
    color: red;
    font-weight: bold;
    text-align: center;
`;

export const LineContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin: 1.5rem 0;
`;

export const Line = styled.div`
    height: 1px;
    background-color: #ccc;
    flex-grow: 1;
`;

export const ForgotPassword = styled.a`
    font-size: 13px;
    margin-top: -0.5rem;
    color: #444;
    text-decoration: underline;
    cursor: pointer;
`;

export const RegisterBox = styled.div`
    margin-top: 1.5rem;
    text-align: center;
    font-size: 14px;

    a {
        color: #2163a5;
        font-weight: bold;
        text-decoration: none;
        margin-left: 5px;
    }
`;
