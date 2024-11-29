import styled from "styled-components";

// Container principal
// export const DashboardLayout = styled.main`
//     display: flex;
//     flex-direction: row;
//     box-sizing: border-box;
//     height: 100vh;
//     //overflow: auto;
// `;
// .dashboardLayout {
//     box-sizing: border-box;
//     display: flex;
//     flex-direction: row;
//     height: 100vh;
//     width: 100vw;
// }


// Contêiner das cartas
export const CardsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    margin-top: 20px;
    width: 100%;
    max-width: 1200px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;

// Estilo das cartas
export const Card = styled.div`
    background: #ffffff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 300px;
    max-width: 400px;
    width: 100%;

    h3 {
        margin: 0;
        color: #333;
    }

    p {
        margin: 5px 0;
        color: #555;
    }
`;

// Título da carta
export const CardTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dad0d0;
    padding-bottom: 10px;
    margin-bottom: 15px;
`;

// Botão genérico
export const Button = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

// Contêiner da tabela
export const SubuserTableContainer = styled.div`
    background: #ffffff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 1200px;
    margin-top: 20px;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

// Tabela de usuários
export const SubuserTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;

    th,
    td {
        border: 1px solid #e0e0e0;
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #f0f4f8;
        font-weight: bold;
    }

    tr:hover {
        background-color: #f9fbfd;
    }
`;

// Botão da tabela
export const TableButton = styled.button`
    background-color: #d9534f;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c9302c;
    }
`;

// Formulário de subusuários
export const SubuserForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;

    input {
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
    }

    button {
        align-self: flex-start;
    }
`;
