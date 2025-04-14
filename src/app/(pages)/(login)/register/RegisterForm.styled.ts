import styled from 'styled-components';
import Image from 'next/image';

export const FormWrapper = styled.div`
    width: 100%;
    max-width: 380px;
    background: #fff;
    padding: 2.5rem 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: center;
`;

export const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
`;

export const StyledLogo = styled(Image)`
    width: 180px;
    height: auto;
    margin: 0 auto 1.5rem;
`;

export const WelcomeText = styled.p`
    text-align: center;
    font-size: 14px;
    color: #444;
    margin-bottom: 1rem;
`;

export const StyledInput = styled.input`
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #f9f9f9;
    font-size: 14px;

    &::placeholder {
        color: #999;
    }
`;

export const InputWrapper = styled.div`
    position: relative;
`;

export const TogglePasswordIcon = styled.span`
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    cursor: pointer;
    color: #666;
`;

export const StyledButton = styled.button`
    width: 100%;
    height: 44px;
    border: none;
    background-color: #4285f4;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
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
    color: red;
    text-align: center;
    font-weight: bold;
    margin-top: 1rem;
`;

export const SwitchText = styled.p`
    text-align: center;
    font-size: 14px;
    margin-top: 1.5rem;

    a {
        color: #2163a5;
        font-weight: bold;
        text-decoration: none;
        margin-left: 4px;
    }
`;
