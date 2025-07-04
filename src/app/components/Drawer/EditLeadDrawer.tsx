"use client";
import { Drawer } from "antd";
import EditLeadForm from "@/app/components/forms/EditLeadForm";

interface EditLeadDrawerProps {
    open: boolean;
    onClose: () => void;
    cliente: any; // Use o tipo Cliente se tiver tipado
    onSuccess?: () => void; // Para dar reload na lista se quiser
}

const EditLeadDrawer: React.FC<EditLeadDrawerProps> = ({ open, onClose, cliente, onSuccess }) => {
    return (
        <Drawer
            title="Editar Lead"
            width={640}
            open={open}
            onClose={onClose}
            destroyOnClose
            maskClosable
            styles={{ body: { paddingBottom: 80 } }} 
        >
            {/* Formulário de edição */}
            <EditLeadForm cliente={cliente} onSuccess={onSuccess || onClose} />
        </Drawer>
    );
};

export default EditLeadDrawer;
