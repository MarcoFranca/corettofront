'use client'
import ClientDetailPage from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/ClientDetailPage";
import styled from "styled-components";

const Container = styled.div`
    padding: 38px 32px 32px 32px;
    background: #f8fbff;
    min-height: 100vh;
    justify-content: center;
    width: 100%;
    align-items: center;
`;

const ClientPage = () => {
    return (
        <Container >
            <ClientDetailPage />
        </Container>
    )
};

export default ClientPage;
