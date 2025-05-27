// components/ObservacaoCell.tsx
import React, { useState } from "react";
import { Tooltip, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface ObservacaoCellProps {
    obs: string;
    onSave: (newObs: string) => Promise<void>;
}

const ObservacaoCell: React.FC<ObservacaoCellProps> = ({ obs, onSave }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(obs || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        await onSave(value);
        setLoading(false);
        setEditing(false);
    };

    if (editing) {
        return (
            <div style={{ minWidth: 220 }}>
        <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            style={{ width: "100%" }}
            rows={3}
            autoFocus
        />
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <Button type="primary" size="small" loading={loading} onClick={handleSave}>Salvar</Button>
                    <Button size="small" onClick={() => setEditing(false)}>Cancelar</Button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Tooltip title={obs && obs.length > 60 ? obs : undefined} placement="topLeft">
        <span style={{
            maxWidth: 200,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block"
        }}>
          {obs ? (obs.length > 60 ? `${obs.slice(0, 60)}...` : obs) : (
              <span style={{ color: "#aaa" }}>Sem observação</span>
          )}
        </span>
            </Tooltip>
            <Button
                icon={<EditOutlined />}
                size="small"
                type="text"
                onClick={e => { e.stopPropagation(); setEditing(true); }}
                title={obs ? "Editar observação" : "Adicionar observação"}
            />
        </div>
    );
};

export default ObservacaoCell;
