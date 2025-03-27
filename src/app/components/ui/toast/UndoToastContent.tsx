// components/ui/UndoToastContent.tsx
import React from "react";
import {toast} from "react-toastify";

interface UndoToastContentProps {
    message: string;
    onUndo: () => void;
    label?: string;
}

const UndoToastContent: React.FC<UndoToastContentProps> = ({ message, onUndo, label = "Desfazer" }) => {
    return (
        <span>
            {message}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // 👈 ESSENCIAL!
                    onUndo();
                    toast.dismiss();     // 👈 fecha manualmente
                }}
                style={{
                    marginLeft: 10,
                    border: 'none',
                    background: 'none',
                    color: '#00b96b',
                    cursor: 'pointer',
                    fontWeight: 600,
                }}
            >
  {label}
</button>

    </span>
    );
};

export default UndoToastContent;
