import React, { useState } from "react";
import {
    MoreOutlined,
    PlusOutlined,
    WhatsAppOutlined,
    CalendarOutlined,
    EditOutlined,
    SolutionOutlined
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { QuickActionsWrapper, FloatingActions, QuickActionBtn } from "./QuickActions.styles";

const QuickActions: React.FC<{
    onNovaApolice: () => void;
    onWhatsApp: () => void;
    onNovaReuniao: () => void;
    onEdit: () => void;
    onNegociacao: () => void;
}> = ({ onNovaApolice, onWhatsApp, onNovaReuniao, onEdit, onNegociacao }) => {
    const [show, setShow] = useState(false);

    // Fecha no mobile ao perder o foco
    const handleBlur = () => setTimeout(() => setShow(false), 120);

    return (
        <QuickActionsWrapper
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            tabIndex={0}
            onFocus={() => setShow(true)}
            onBlur={handleBlur}
            style={{ marginLeft: 8 }}
        >
            <QuickActionBtn shape="circle" icon={<MoreOutlined />} />
            <FloatingActions $show={show}>
                <Tooltip title="Nova Apólice"><QuickActionBtn icon={<PlusOutlined />} onClick={onNovaApolice} /></Tooltip>
                <Tooltip title="WhatsApp"><QuickActionBtn icon={<WhatsAppOutlined />} onClick={onWhatsApp} /></Tooltip>
                <Tooltip title="Nova Reunião"><QuickActionBtn icon={<CalendarOutlined />} onClick={onNovaReuniao} /></Tooltip>
                <Tooltip title="Negociações"><QuickActionBtn icon={<SolutionOutlined />} onClick={onNegociacao} /></Tooltip>
                <Tooltip title="Editar Cliente"><QuickActionBtn icon={<EditOutlined />} onClick={onEdit} /></Tooltip>
            </FloatingActions>
        </QuickActionsWrapper>
    );
};

export default QuickActions;
