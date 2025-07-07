import React from "react";
import { FaStar } from "react-icons/fa";
import { Cliente } from "@/types/interfaces";
import {Card} from "antd";

interface Props {
    cliente: Cliente;
}

export default function ClientProfileInfoCard({ cliente }: Props) {
    function renderValue(label: string, value: string | undefined | null) {
        return (
            <div style={{
                display: "flex", gap: 8, alignItems: "center", marginBottom: 8,
                fontSize: 15
            }}>
                <span style={{ minWidth: 90, fontWeight: 500, color: "#0a3166" }}>{label}:</span>
                <span style={{ color: "#222" }}>{value || "Não informado"}</span>
            </div>
        );
    }

    return (
        <Card title="Informações do Cliente">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cliente.is_vip && (
                    <span style={{
                        color: "#f4b400", fontWeight: "bold", display: "flex", alignItems: "center", gap: 5, marginTop: 4
                    }}>
            <FaStar /> Cliente VIP
          </span>
                )}
                {renderValue("Nome", `${cliente.nome} ${cliente.sobre_nome}`)}
                {renderValue("Telefone", cliente.telefone)}
                {renderValue("E-mail", cliente.email && cliente.email !== "nan" ? cliente.email : "")}
                {renderValue("Profissão", cliente.profissao?.nome)}
                {renderValue("Status", cliente.status)}
            </div>
            {/* Endereço */}
            {cliente.relacionamentos?.endereco && (
                <>
                    <h4 style={{ marginTop: 18, marginBottom: 8, color: "#0a3166" }}>Endereço</h4>
                    {renderValue("Cidade", cliente.relacionamentos.endereco.cidade)}
                    {renderValue("UF", cliente.relacionamentos.endereco.uf)}
                    {renderValue("Bairro", cliente.relacionamentos.endereco.bairro)}
                    {renderValue("CEP", cliente.relacionamentos.endereco.cep)}
                </>
            )}
            {/* Observações */}
            {cliente.observacoes && (
                <div style={{ marginTop: 18 }}>
                    <h4 style={{ color: "#0a3166" }}>Observações</h4>
                    <p style={{ background: "#f6f8fa", borderRadius: 8, padding: 12 }}>{cliente.observacoes}</p>
                </div>
            )}
        </Card>
    );
}
