import React, { useState } from "react";
import styled from "styled-components";
import {
    FaCopy, FaWhatsapp, FaEnvelope, FaFileDownload, FaEdit, FaSave,
    FaExclamationCircle, FaIdCard, FaCalendarAlt, FaUser, FaPhoneAlt, FaVenusMars
} from "react-icons/fa";
import { Cliente } from "@/types/interfaces";
import EditDocumentsModal
    from "@/app/(pages)/dashboard/(painel_cliente)/cliente/[clientId]/(cards)/(documents)/EditDocumentsModal";

const Card = styled.div`
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(4, 42, 117, 0.08);
    padding: 22px;
    margin-bottom: 18px;
    width: 100%;
    max-width: 920px;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
`;

const DadosGrid = styled.div`
    flex: 2;
    min-width: 280px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 24px;
    align-items: center;
    @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const ObsActionsContainer = styled.div`
    flex: 1;
    min-width: 260px;
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Label = styled.span`
    font-weight: 600;
    color: #042a75;
    min-width: 110px;
    display: flex;
    align-items: center;
    gap: 5px;
    svg { opacity: 0.7; }
`;

const Value = styled.span`
    color: #444;
    word-break: break-word;
`;

const EditIcon = styled(FaEdit)`
    color: #33cccc;
    margin-left: 6px;
    cursor: pointer;
    font-size: 1.08em;
    &:hover { color: #042a75; }
`;

const ObsArea = styled.div`
    background: #f9fafb;
    border-radius: 8px;
    padding: 13px 16px;
    min-height: 54px;
    font-size: 1rem;
    position: relative;
    margin-bottom: 2px;
`;

const EditBtn = styled.button`
    background: none;
    border: none;
    color: #33cccc;
    cursor: pointer;
    position: absolute;
    right: 14px;
    top: 13px;
    font-size: 1.08rem;
    &:hover { color: #042a75; }
`;

const Actions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const ActionBtn = styled.button`
    background: #33cccc;
    color: #fff;
    border: none;
    padding: 9px 18px;
    border-radius: 7px;
    font-size: 0.99rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    transition: background 0.2s;
    &:hover { background: #042a75; }
`;

const Pendencia = styled.div`
  background: #fff3f4;
  color: #e74c3c;
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 500;
`;

export default function DadosPropostaCardUX({ cliente }: { cliente: Cliente }) {
    const [obsEdit, setObsEdit] = useState(false);
    const [obsValue, setObsValue] = useState(cliente.observacoes || "");
    const [modalDocs, setModalDocs] = useState(false);

    // Pendências dinâmicas
    const pendencias = [
        !cliente.cpf && "CPF",
        !cliente.identidade && "Identidade",
        !cliente.data_nascimento && "Data Nasc.",
    ].filter(Boolean);

    // Copiar todos
    const copiarTodos = () => {
        const textoCopiado = `
Nome: ${cliente.nome} ${cliente.sobre_nome || ""}
CPF: ${cliente.cpf || "Não informado"}
RG: ${cliente.identidade || "Não informado"}
Data Nasc.: ${cliente.data_nascimento || "Não informado"}
Telefone: ${cliente.telefone || "Não informado"}
Email: ${cliente.email || "Não informado"}`.trim();
        navigator.clipboard.writeText(textoCopiado);
    };

    return (
        <Card>
            <DadosGrid>
                <Row>
                    <Label><FaIdCard />CPF:</Label>
                    <Value>{cliente.cpf || <i>Não informado</i>}
                        <EditIcon title="Editar documentos" onClick={() => setModalDocs(true)} />
                    </Value>
                </Row>
                <Row>
                    <Label><FaIdCard />Identidade:</Label>
                    <Value>{cliente.identidade || <i>Não informado</i>}</Value>
                </Row>
                <Row>
                    <Label><FaCalendarAlt />Data Nasc.:</Label>
                    <Value>{cliente.data_nascimento || <i>Não informado</i>}</Value>
                </Row>
                <Row>
                    <Label><FaUser />Nome da Mãe:</Label>
                    <Value>{cliente.nome_mae || <i>Não informado</i>}</Value>
                </Row>
                <Row>
                    <Label><FaPhoneAlt />Telefone:</Label>
                    <Value>{cliente.telefone || <i>Não informado</i>}</Value>
                </Row>
                <Row>
                    <Label><FaEnvelope />E-mail:</Label>
                    <Value>{cliente.email && cliente.email !== "nan" ? cliente.email : <i>Não informado</i>}</Value>
                </Row>
                <Row>
                    <Label><FaVenusMars />Estado Civil:</Label>
                    <Value>{cliente.estado_civil && cliente.estado_civil !== "nan" ? cliente.estado_civil : <i>Não informado</i>}</Value>
                </Row>
            </DadosGrid>

            {/* MODAL DE EDIÇÃO DOS DOCUMENTOS */}
            {modalDocs && (
                <EditDocumentsModal
                    isOpen={modalDocs}
                    onRequestClose={() => setModalDocs(false)}
                    cliente={cliente}
                />
            )}

            {/* Observações e ações rápidas */}
            <ObsActionsContainer>
                <div>
                    <b style={{ color: "#042a75" }}>Observações:</b>
                    <ObsArea>
                        {obsEdit ? (
                            <>
                <textarea
                    value={obsValue}
                    onChange={e => setObsValue(e.target.value)}
                    style={{ width: "100%", height: 50, resize: "none", fontSize: 15, borderRadius: 7, border: "1px solid #e0e6ef" }}
                />
                                <EditBtn onClick={() => setObsEdit(false)}><FaSave /></EditBtn>
                            </>
                        ) : (
                            <>
                                {obsValue || <i style={{ color: "#888" }}>Sem observações cadastradas</i>}
                                <EditBtn onClick={() => setObsEdit(true)}><FaEdit /></EditBtn>
                            </>
                        )}
                    </ObsArea>
                </div>

                <Actions>
                    <ActionBtn onClick={() => window.open(`https://wa.me/55${cliente.telefone?.replace(/\D/g, "")}`, "_blank")}>
                        <FaWhatsapp /> WhatsApp
                    </ActionBtn>
                    <ActionBtn onClick={() => window.open(`mailto:${cliente.email}`)}>
                        <FaEnvelope /> E-mail
                    </ActionBtn>
                    <ActionBtn>
                        <FaFileDownload /> Baixar PDF
                    </ActionBtn>
                    <ActionBtn onClick={copiarTodos}>
                        <FaCopy /> Copiar Todos
                    </ActionBtn>
                </Actions>

                {pendencias.length > 0 && (
                    <Pendencia>
                        <FaExclamationCircle />
                        Pendências: {pendencias.join(", ")}
                    </Pendencia>
                )}
            </ObsActionsContainer>
        </Card>
    );
}
