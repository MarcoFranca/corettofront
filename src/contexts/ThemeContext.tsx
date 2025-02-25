"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import {darkTheme, lightTheme} from "@/global/theme";
import {GlobalStyles} from "@/global/GlobalStyles";


// Criamos um contexto para gerenciar o tema
const ThemeContext = createContext({
    theme: lightTheme,
    toggleTheme: () => {},
});

export const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState(lightTheme);

    // 🚀 Carregar tema salvo no localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setTheme(darkTheme);
        }
    }, []);

    // 🔄 Alternar entre temas
    const toggleTheme = () => {
        const newTheme = theme.name === "light" ? darkTheme : lightTheme;
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme.name);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <GlobalStyles />  {/* ✅ Agora os estilos globais são aplicados aqui */}
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

// Criamos um hook para facilitar o uso do tema
export const useTheme = () => useContext(ThemeContext);
