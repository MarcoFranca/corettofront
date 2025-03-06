"use client";

import React, { useState } from "react";
import Modal from "@/app/components/Modal/simpleModal"; // 🔥 Certifique-se de que esse Modal existe!
import Button from "@/app/components/ui/Button";
import api from "@/app/api/axios";
import { toast } from "react-toastify";

interface PaymentModalProps {
    show: boolean;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ show, onClose }) => {
    const [loadingPortal, setLoadingPortal] = useState(false);
    const [errorPortal, setErrorPortal] = useState("");

    const handleOpenPortal = async () => {
        setLoadingPortal(true);
        setErrorPortal("");

        try {
            const response = await api.post("pagamentos/customer-portal/");
            const { url } = response.data;

            if (url) {
                window.location.href = url;
            } else {
                setErrorPortal("Erro ao redirecionar para o portal de pagamentos.");
            }
        } catch (err) {
            setErrorPortal("Erro ao abrir o portal do cliente.");
        } finally {
            setLoadingPortal(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose} title="Portal de Pagamentos">
            <p>Gerencie seus pagamentos e recibos através do portal.</p>

            <Button onClick={handleOpenPortal} disabled={loadingPortal}>
                {loadingPortal ? "Abrindo portal..." : "Acessar Portal de Pagamentos"}
            </Button>

            {errorPortal && <p style={{ color: "red", marginTop: "10px" }}>{errorPortal}</p>}
        </Modal>
    );
};

export default PaymentModal;
