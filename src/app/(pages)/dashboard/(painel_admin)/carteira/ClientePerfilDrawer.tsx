// ClientePerfilDrawer.tsx
import React, { useEffect } from "react";
import { Drawer, Descriptions, Button, Tag } from "antd";
import { useAppSelector, useAppDispatch } from "@/services/hooks/hooks";
import { fetchClienteDetalhe } from "@/store/slices/clientesSlice";

// 🟢 INTERFACE CORRETA
export interface ClientePerfilDrawerProps {
    clienteId: string | null;
    open: boolean;
    onClose: () => void;
}

const ClientePerfilDrawer: React.FC<ClientePerfilDrawerProps> = ({
                                                                     clienteId,
                                                                     open,
                                                                     onClose
                                                                 }) => {
    const dispatch = useAppDispatch();
    const cliente = useAppSelector((state) => state.clientes.clienteDetalhe);

    useEffect(() => {
        if (open && clienteId) {
            dispatch(fetchClienteDetalhe(clienteId));
        }
    }, [open, clienteId, dispatch]);

    if (!cliente) return null;

    return (
        <Drawer
            title={`Cliente: ${cliente.nome} ${cliente.sobre_nome}`}
            placement="right"
            width={440}
            onClose={onClose}
            open={open}
        >
            <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Email">{cliente.email}</Descriptions.Item>
                <Descriptions.Item label="Telefone">{cliente.telefone}</Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Tag color="blue">{cliente.status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Apólices">{cliente.total_apolices}</Descriptions.Item>
                <Descriptions.Item label="Observações">{cliente.observacoes || "—"}</Descriptions.Item>
                {/* ...e mais o que quiser */}
            </Descriptions>
            <Button type="primary" style={{ marginTop: 16 }}>
                Nova Apólice
            </Button>
        </Drawer>
    );
};

export default ClientePerfilDrawer;
