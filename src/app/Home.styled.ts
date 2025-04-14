import styled from "styled-components";

export const HomeContainer = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f9ff;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 4rem 1.5rem;
  }
`;

export const HomeMain = styled.main`
    width: 100%;
    display: flex;
    flex-direction: column;
`;


