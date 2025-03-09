import styled from "styled-components";

export const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
`;

export const Card = styled.div`
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 5px 15px rgba(0,0,0,0.1);
    text-align: center;

    h3 {
        margin-bottom: 10px;
        font-size: 1rem;
        font-weight: 500;
        color: #666;
    }

    p {
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
    }
`;

export const ChartContainer = styled.div`
    margin: 30px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    //height: 250px;
    width: 50%;
    
`;
