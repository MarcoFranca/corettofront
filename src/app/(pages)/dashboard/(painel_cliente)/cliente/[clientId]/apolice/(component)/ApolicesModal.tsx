import React, { useState } from "react";
import api from "@/app/api/axios";

interface ApolicesModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: () => void;
}

const ApolicesModal: React.FC<ApolicesModalProps> = ({ isOpen, onRequestClose, onSave }) => {
    const [dados, setDados] = useState({ produto: "", seguradora: "", premio_pago: "" });

    const handleSubmit = async () => {
        try {
            await api.post("/apolices/", dados);
            onSave();
            onRequestClose();
        } catch (error) {
            console.error("Erro ao cadastrar apólice:", error);
        }
    };

    return isOpen ? (
        <div className="modal">
            <h3>Nova Apólice</h3>
        <input type="text" placeholder="Produto" onChange={(e) => setDados({ ...dados, produto: e.target.value })} />
    <input type="text" placeholder="Seguradora" onChange={(e) => setDados({ ...dados, seguradora: e.target.value })} />
    <input type="number" placeholder="Valor" onChange={(e) => setDados({ ...dados, premio_pago: e.target.value })} />
    <button onClick={handleSubmit}>Salvar</button>
        <button onClick={onRequestClose}>Cancelar</button>
        </div>
) : null;
};

export default ApolicesModal;
