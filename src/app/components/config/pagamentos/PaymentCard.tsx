"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProfile, fetchSubUsers } from "@/store/slices/profileSlice";
import PaymentModal from "@/app/components/config/pagamentos/PaymentModal";
import Button from "@/app/components/ui/Button";
import { Card, CardTitle } from "./PaymentCard.styles";

const PaymentCard: React.FC<{ exibirLimites: boolean }> = ({ exibirLimites }) => {
    const dispatch: AppDispatch = useDispatch();
    const { data: profile, subUsers } = useSelector((state: RootState) => state.profile);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // 🔥 Buscar profile e subUsers ao carregar o componente
    useEffect(() => {
        if (!profile) dispatch(fetchProfile());
        if (!subUsers.length) dispatch(fetchSubUsers());
    }, [dispatch, profile, subUsers.length]);

    if (!profile) {
        return <Card><p>🔄 Carregando dados...</p></Card>;
    }

    const status = profile?.assinatura_status || "inactive";

    return (
        <Card>
            <CardTitle>
                <h3>🔖 Plano Atual</h3>
            </CardTitle>
            <p>
                <strong>Status:</strong>{" "}
                {status === "trialing"
                    ? "Em período de teste"
                    : status === "active"
                        ? "Ativo"
                        : "Inativo"}
            </p>
            <p><strong>Nome do Plano:</strong> {profile?.plano?.nome || "Nenhum plano escolhido"}</p>
            <p><strong>Preço:</strong> R$ {(Number(profile?.plano?.preco) || 0).toFixed(2)}</p>

            {exibirLimites && (
                <>
                    <p><strong>Limite de Subusuários:</strong> {profile?.plano?.limite_subusuarios || "N/A"}</p>
                    <p><strong>Subusuários Atuais:</strong> {subUsers.length} / {profile?.plano?.limite_subusuarios || "0"}</p>
                </>
            )}

            {/* 🔥 Botão para abrir o modal */}
            <Button onClick={() => setShowPaymentModal(true)}>
                Ver Pagamentos e Recibos
            </Button>

            {/* 🛒 Modal de Pagamentos */}
            <PaymentModal show={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
        </Card>
    );
};

export default PaymentCard;
