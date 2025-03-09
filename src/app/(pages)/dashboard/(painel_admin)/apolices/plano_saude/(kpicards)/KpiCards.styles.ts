import styled from "styled-components";

export const CardContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  padding: 20px;
  flex: 1;
  min-width: 180px;
  text-align: center;

  h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  p {
    font-size: 20px;
    font-weight: bold;
  }
`;

export const CardCharts = styled.div`
    display: flex;
    flex-direction: column;
    height: 300px;
    `;