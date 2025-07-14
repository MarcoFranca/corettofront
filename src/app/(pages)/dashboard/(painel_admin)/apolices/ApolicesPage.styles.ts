import styled from "styled-components";
import ThemeToggle from "@/app/components/ui/Button/ThemeToggle";


export const ApolicesContainer = styled.div`
    padding: 24px;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

export const Title = styled.h2`
    font-size: 24px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.title};
`;

export const StyledButton = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: 600;
    color: #F8FAFC;
    background: linear-gradient(135deg, ${({ theme }) => 
            theme.colorsButton.primary}, 
    ${({ theme }) => theme.colorsButton.secondary});
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;

    &:hover {
        background: ${({ theme }) => theme.colors.button};
        transform: scale(1.05);
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: scale(0.98);
    }

    &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(255, 255, 255, 0.1);
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    

    &:hover::before {
        opacity: 1;
    }
`;

export const IconButton = styled.span`
    display: flex;
    align-items: center;
    font-size: 18px;
`;


export const FilterContainer = styled.div`
    margin-bottom: 24px;
`;

export const ContentContainer = styled.div`
    border-radius: 8px;
    background-color: #fff;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    height: 100%;
    min-height: 300px;
    overflow: auto;
`;
