import styled from "styled-components";

// 🔹 Container principal
export const Container = styled.div`
    margin-top: 20px;
    max-width: 1200px;
    width: 100%;
    height: 450px;
    overflow: hidden;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

// 🔹 Input e botão no mesmo layout
export const InputContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
`;

// 🔹 Input estilizado
export const Input = styled.input`
    flex: 1;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    outline: none;
    font-size: 14px;
    transition: border 0.3s ease;

    &:focus {
        border-color: #007bff;
    }
`;

// 🔹 Lista de coberturas
export const List = styled.ul`
    height: 80%;
    overflow: auto;
    list-style: none;
    //padding: 50px 0;
    //margin-bottom: 50px;
`;

// 🔹 Item de cobertura
export const ListItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #ddd;
    background: #f9f9f9;
    border-radius: 5px;
    margin-bottom: 8px;
    font-size: 14px;
    transition: background 0.3s ease;

    &:hover {
        background: #f1f1f1;
    }
`;

// 🔹 Botão de exclusão estilizado
export const DeleteButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: red;
    font-size: 16px;
    transition: color 0.3s ease;

    &:hover {
        color: darkred;
    }
`;

// 🔹 Badge para coberturas globais
export const GlobalBadge = styled.span`
    background: #007bff;
    color: white;
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 12px;
    margin-left: 8px;
    font-weight: bold;
`;
