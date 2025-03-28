// hooks/useConfirm.tsx
"use client";

import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@/services/hooks/hooks";
import { playSound } from "@/store/slices/soundSlice";
import { toastSuccess, toastError } from "@/utils/toastWithSound";
import UndoToastContent from "@/app/components/ui/toast/UndoToastContent";

interface UseConfirmOptions {
    title?: string;
    message?: string;
    okText?: string;
    cancelText?: string;
    sound?: string;
    successMessage?: string;
    minDuration?: number;
    onConfirm: () => Promise<void> | void;
    onCancel?: () => void;
    undo?: {
        label?: string;
        onUndo: () => void;
    };
}

export const sanitizeLeadForCreate = (lead: any): Partial<typeof lead> => {
    const cleanLead: Record<string, any> = {};

    Object.entries(lead).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            !(typeof value === "string" && value.trim() === "") &&
            key !== "id"
        ) {
            cleanLead[key] = value;
        }
    });

    return cleanLead;
};

export const useConfirm = () => {
    const dispatch = useAppDispatch();

    const confirm = ({
                         title = "Tem certeza?",
                         message = "Essa ação não poderá ser desfeita.",
                         okText = "Confirmar",
                         cancelText = "Cancelar",
                         sound = "delete",
                         successMessage = "Ação realizada com sucesso!",
                         minDuration = 600,
                         onConfirm,
                         onCancel,
                         undo,
                     }: UseConfirmOptions) => {
        Modal.confirm({
            title,
            content: message,
            okText,
            cancelText,
            okType: "danger",
            icon: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
            onOk: async () => {
                try {
                    dispatch(playSound(sound));

                    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
                    await Promise.all([onConfirm(), delay(minDuration)]);

                    if (undo) {
                        toastSuccess(
                            <UndoToastContent
                                message={successMessage}
                                onUndo={undo.onUndo}
                                label={undo.label}
                            />
                        );
                    } else {
                        toastSuccess(successMessage);
                    }
                } catch (err) {
                    toastError("Erro ao executar a ação.");
                    throw err;
                }
            },
            onCancel: () => {
                if (onCancel) onCancel();
            },
        });
    };

    return { confirm };
};
