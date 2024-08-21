import styled from 'styled-components';

export const FichaContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #fff;
    padding: 20px;
    overflow: scroll;
    //border-radius: 12px;
    height: 100%;
    //margin: 20px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
    color: #333;

`;

export const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
`;

export const Field = styled.div`
    margin-bottom: 15px;
    font-size: 16px;
`;

export const Label = styled.span`
    font-weight: bold;
    color: #555;
    display: block;
    margin-bottom: 5px;
`;

export const ApoliceContainer = styled.div`
    height: 100vh;
`

export const FichaHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
`

export const StatusField = styled.div`
    margin-bottom: 20px;
    font-size: 16px;
`;

export const StatusVigente = styled.span`
    color: #fff;
    background-color: #28a745;
    padding: 5px 10px;
    border-radius: 12px;
`;

export const StatusCancelada = styled.span`
    color: #fff;
    background-color: #dc3545;
    padding: 5px 10px;
    border-radius: 12px;
`;

export const PDFContainer = styled.div`
    display: flex;
    align-self: center;
    max-width: 1400px;
    width: 100%;
    margin-top: 20px;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

export const PDFViewer = styled.iframe`
    display: flex;
    align-self: center;
    max-width: 1400px;
    width: 100%;
    height: 1400px;
    margin-top: 20px;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const BackButton = styled.div`
    margin-top: 20px;
    text-align: center;

    a {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        transition: background-color 0.3s;

        &:hover {
            background-color: #0056b3;
        }
    }
`;
