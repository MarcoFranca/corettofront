"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import styled from "styled-components";

const ToggleButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.button};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 50%;
    transition: 0.3s ease-in-out;

    &:hover {
        color: #F8FAFC;
    }
`;

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <ToggleButton onClick={toggleTheme} aria-label="Alternar tema">
            {theme.name === "light" ? <FaSun /> : <FaMoon />}
        </ToggleButton>
    );
}
