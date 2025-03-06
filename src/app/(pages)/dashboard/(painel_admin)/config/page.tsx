'use client';

import React from 'react';
import GoogleAccountSettings from "@/app/components/config/google/GoogleAccountSettings";
import PaymentCard from "@/app/components/config/pagamentos/PaymentCard";
import {ConfigContaint, Container} from "@/app/(pages)/dashboard/(painel_admin)/config/config.styled";

const UserSettings: React.FC = () => {
    return (
        <Container>
            <h1>⚙️ Configurações do Usuário</h1>

            <ConfigContaint>

                <GoogleAccountSettings />
                <PaymentCard
                    exibirLimites={true}
                />
                {/* Adicione outros componentes de configuração aqui */}
            </ConfigContaint>
        </Container>
    );
};

export default UserSettings;
