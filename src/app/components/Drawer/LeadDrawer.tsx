"use client";
import { Drawer } from "antd";
import { useEffect } from "react";
import CadastroLeadForm from "@/app/components/forms/CadastroLeadForm";

interface LeadDrawerProps {
    open: boolean;
    onClose: () => void;
    onReload: () => void;
}

const LeadDrawer: React.FC<LeadDrawerProps> = ({ open, onClose, onReload }) => {
    // Se quiser um efeito sonoro ao abrir/fechar (opcional)
    useEffect(() => {
        if (open) {
            // playSound("openModal");
        } else {
            // playSound("closeModal");
        }
    }, [open]);

    return (
        <Drawer
            title="Cadastrar Novo Lead"
            width={640}
            open={open}
            onClose={onClose}
            destroyOnClose
            maskClosable
            bodyStyle={{ paddingBottom: 80 }}
        >
            <CadastroLeadForm
                onSuccess={() => {
                    onReload();
                    onClose();
                }}
            />
        </Drawer>
    );
};

export default LeadDrawer;
