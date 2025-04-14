import styled, {keyframes} from "styled-components";
import Image from "next/image";
import {FaRegEnvelopeOpen} from "react-icons/fa";

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f8fc;
    padding: 2rem;
`;

export const Card = styled.div`
    background: white;
    padding: 3rem 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    text-align: center;
    max-width: 480px;
    width: 100%;
`;

export const Logo = styled(Image)`
    margin: 0 auto 1.5rem;
    width: 280px;
`;

export const pulse = keyframes`
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
`;

export const EnvelopeIcon = styled(FaRegEnvelopeOpen)`
    font-size: 3rem;
    color: #33cccc;
    animation: ${pulse} 2s infinite;
    margin-bottom: 1rem;
`;

export const Title = styled.h1`
    font-size: 1.9rem;
    color: #042a75;
    margin-bottom: 0.75rem;
`;

export const Message = styled.p`
    font-size: 1.05rem;
    color: #555;
    margin-bottom: 2rem;
    line-height: 1.6;

    strong {
        color: #042a75;
    }
`;

export const ResendLink = styled.button`
    background-color: transparent;
    border: none;
    color: #2163a5;
    font-weight: bold;
    font-size: 0.95rem;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
        color: #33cccc;
    }
`;