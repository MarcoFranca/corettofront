"use client";

import React, { useState, useEffect } from "react";
import api from "@/app/api/axios";
import Button from "@/app/components/ui/Button";
import { FaTrash } from "react-icons/fa";
import { Container, InputContainer, Input, List, ListItem, DeleteButton, GlobalBadge } from "./CoberturaNomeConfig.styles";

const CoberturaNomeConfig: React.FC = () => {
    const [coberturas, setCoberturas] = useState<{ id: string; nome: string; show: boolean }[]>([]);
    const [novaCobertura, setNovaCobertura] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔹 Buscar coberturas cadastradas
    const fetchCoberturas = async () => {
        try {
            const response = await api.get("/coberturas/nome/");
            setCoberturas(response.data);
        } catch (error) {
            console.error("Erro ao buscar coberturas:", error);
        }
    };

    useEffect(() => {
        fetchCoberturas();
    }, []);

    // 🔹 Adicionar nova cobertura com garantia de resposta do backend
    const handleAddCobertura = async () => {
        if (!novaCobertura.trim() || loading) return;
        setLoading(true);  // ⏳ Evita múltiplos cliques

        try {
            await api.post("/coberturas/nome/", { nome: novaCobertura });

            console.log("cobertura:",novaCobertura)
            // 🔥 Aguarda a resposta e busca os dados mais recentes
            await fetchCoberturas();

            setNovaCobertura(""); // Limpa o campo
        } catch (error) {
            console.error("Erro ao adicionar cobertura:", error);
        } finally {
            setLoading(false);  // ✅ Finaliza o carregamento
        }
    };

    // 🔹 Excluir cobertura (Apenas se `show=false`)
    const handleDeleteCobertura = async (id: string) => {
        try {
            await api.delete(`/coberturas/nome/${id}/`);
            await fetchCoberturas(); // 🔥 Garante que a lista seja atualizada corretamente
        } catch (error) {
            console.error("Erro ao excluir cobertura:", error);
        }
    };

    return (
        <Container>
            <h3>🛡 Gerenciar Coberturas</h3>

            {/* 🔹 Input para nova cobertura */}
            <InputContainer>
                <Input
                    type="text"
                    value={novaCobertura}
                    onChange={(e) => setNovaCobertura(e.target.value)}
                    placeholder="Digite o nome da cobertura..."
                />
                <Button onClick={handleAddCobertura} disabled={loading}>
                    {loading ? "Adicionando..." : "Adicionar"}
                </Button>
            </InputContainer>

            {/* 🔹 Lista de coberturas cadastradas */}
            <List>
                {coberturas.length > 0 ? (
                    coberturas.map((cobertura) => (
                        <ListItem key={cobertura.id}>
                            <span>
                                {cobertura.nome}{" "}
                                {cobertura.show && <GlobalBadge>🌍 Global</GlobalBadge>}
                            </span>
                            {!cobertura.show && (  // 🔥 Apenas deletáveis se `show=false`
                                <DeleteButton onClick={() => handleDeleteCobertura(cobertura.id)}>
                                    <FaTrash />
                                </DeleteButton>
                            )}
                        </ListItem>
                    ))
                ) : (
                    <p>🔍 Nenhuma cobertura cadastrada.</p>
                )}
            </List>
        </Container>
    );
};

export default CoberturaNomeConfig;
