import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
`

export const Board = styled.div`
    display: flex;
    margin-top: 4.5rem;
    padding: 16px 0;
`

export const StackedColumns = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: start;
    height: 100%;
`

export const StackedColumnsVerticalSup = styled.div`
    display: flex;
    height: 40vh;
`