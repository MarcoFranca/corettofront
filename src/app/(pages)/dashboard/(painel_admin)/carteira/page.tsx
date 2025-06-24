'use client';

import ClientesTable from "@/app/components/ListaClientes/ClientesTable";
import React from "react";
import {Container} from "./CarteiraPage.styles";

const CarteiraPage = () => {

    return (
        <Container>
            <h2>💼 Carteira de Clientes</h2>
            <ClientesTable/>
        </Container>
    );
};

export default CarteiraPage;
