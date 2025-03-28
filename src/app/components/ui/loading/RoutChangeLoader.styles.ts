import styled from "styled-components";

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.20); /* ou transparente escuro */
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
`

