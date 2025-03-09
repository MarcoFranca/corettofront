'use client';

import React from 'react';
import GoogleAccountSettings from "@/app/components/config/google/GoogleAccountSettings";
import PaymentCard from "@/app/components/config/pagamentos/PaymentCard";
import {ConfigContaint, Container} from "@/app/(pages)/dashboard/(painel_admin)/config/config.styled";
import CoberturaNomeConfig from "@/app/(pages)/dashboard/(painel_admin)/config/coberturas/CoberturaNomeConfig";

const UserSettings: React.FC = () => {
    return (
        <Container>
            <h1>⚙️ Configurações do Usuário</h1>

            <ConfigContaint>

                <GoogleAccountSettings />
                <PaymentCard
                    exibirLimites={true}
                />
                {/* 🔥 Gerenciamento de Coberturas */}
            </ConfigContaint>
                <CoberturaNomeConfig />
        </Container>
    );
};

export default UserSettings;
