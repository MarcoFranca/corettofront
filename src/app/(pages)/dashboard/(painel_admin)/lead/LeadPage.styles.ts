import styled from "styled-components";
import Image from "next/image";


export const Contairer = styled.div`
position: relative;    
`
export const ToggleContainer = styled.div`
    display: flex;
    position: absolute;
    top: 0;
    justify-content: center;
    background: ${({ theme }) => theme.colors.background};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    width: 100%;
    padding: 16px;
    align-items: center;
    margin-bottom: 16px;
    gap: 12px;
    z-index: 100;
`;



export const ToggleButton = styled.button<{ $active: boolean }>`
    padding: 10px 20px;
    border: none;
    border-radius: 6px;

    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    background-color: ${({ $active }) => ($active ? "#007bff" : "#f0f0f0")};
    color: ${({ $active }) => ($active ? "#fff" : "#333")};
    box-shadow: ${({ $active }) =>
            $active ? "0 4px 8px rgba(0, 123, 255, 0.2)" : "none"};

    &:hover {
        background-color: ${({ $active }) => ($active ? "#0056b3" : "#e0e0e0")};
    }
`;

export const LeadButton = styled(Image)`
    color: #fff;
    position: absolute;
    left: 50px;
    padding: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    max-width: 50px;
    height: auto;
    z-index: 9;
    
    @keyframes shake {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(-8deg); }
        50% { transform: rotate(8deg); }
        75% { transform: rotate(-3deg); }
        100% { transform: rotate(0deg); }
    }

    &:hover {
        animation: shake 0.5s ease-in-out;
    }
`
