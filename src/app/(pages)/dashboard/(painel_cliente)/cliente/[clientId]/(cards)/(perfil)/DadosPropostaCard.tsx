import React from "react";
import styled from "styled-components";
import { FaCopy, FaFileDownload, FaExclamationTriangle, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { Cliente } from "@/types/interfaces";

// Função utilitária para copiar texto para clipboard
function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}

const Card = styled.div`
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 18px rgba(4, 42, 117, 0.09);
    padding: 24px;
    margin-bottom: 18px;
    min-width: 340px;
    max-width: 680px;
    width: 100%;
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 24px 32px;
    align-items: start;
    @media (max-width: 900px) { grid-template-columns: 1fr; }
`;


const FieldRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: 500;
  min-width: 98px;
  color: #042a75;
`;

const Value = styled.span`
  color: #222;
  font-size: 1rem;
  margin-right: 6px;
  flex: 1;
  word-break: break-all;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 4px;
  color: #33cccc;
  transition: color 0.2s;
  &:hover { color: #042a75; }
`;

const VipBadge = styled.span`
  background: #ffe082;
  color: #f4b400;
  border-radius: 8px;
  font-weight: bold;
  padding: 2px 8px;
  font-size: 0.96rem;
  margin-left: 8px;
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  color: #e74c3c;
  background: #fff5f5;
  padding: 6px 10px;
  border-radius: 6px;
  margin: 10px 0;
  font-size: 0.98rem;
  gap: 8px;
`;

const Actions = styled.div`
    display: flex;
    gap: 10px;
    margin: 14px 0 6px 0;
    flex-wrap: wrap;
`;
const ActionBtn = styled.button`
    background: #33cccc;
    color: #fff;
    border: none;
    padding: 8px 18px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    font-size: 0.97rem;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 116px;
    transition: background 0.2s;
    &:hover { background: #042a75; }
`;


const FileList = styled.div`
  margin: 10px 0 0 0;
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
  font-size: 0.96rem;
`;

const FileName = styled.span`
  flex: 1;
`;

export interface DocumentoCliente {
    id: string;
    nome: string;
    url: string;
    tipo: string;
    obrigatorio?: boolean;
}

interface Props {
    cliente: Cliente;
    documentos?: DocumentoCliente[]; // lista dos docs anexados
    onBaixarTudoPDF?: () => void;
}

const CAMPOS_OBRIGATORIOS = [
    { label: "CPF", value: (c: Cliente) => c.cpf },
    { label: "Identidade", value: (c: Cliente) => c.identidade },
    { label: "Data de Nascimento", value: (c: Cliente) => c.data_nascimento },
    { label: "Nome da Mãe", value: (c: Cliente) => c.nome_mae },
    { label: "Telefone", value: (c: Cliente) => c.telefone },
    { label: "E-mail", value: (c: Cliente) => c.email },
    { label: "Endereço", value: (c: Cliente) => c.endereco && `${c.endereco.logradouro || ""}, ${c.endereco.numero || ""} - ${c.endereco.bairro || ""}, ${c.endereco.cidade || ""}/${c.endereco.uf || ""} - ${c.endereco.cep || ""}` }
];

const CAMPOS_OPCIONAIS = [
    { label: "Profissão", value: (c: Cliente) => c.profissao?.nome },
    { label: "Estado civil", value: (c: Cliente) => c.estado_civil }
];

const DadosPropostaCard: React.FC<Props> = ({ cliente, documentos = [], onBaixarTudoPDF }) => {
    // Checagem de pendências obrigatórias
    const pendencias: string[] = CAMPOS_OBRIGATORIOS
        .filter(f => !f.value(cliente) || f.value(cliente) === "nan" || f.value(cliente) === "")
        .map(f => f.label);

    // Checa docs obrigatórios (exemplo: RG, CPF digitalizado)
    const DOCS_OBRIG = ["RG", "CPF"];
    const docNomes = documentos.map(d => d.tipo.toUpperCase());
    const docPendencias = DOCS_OBRIG.filter(nome => !docNomes.includes(nome));

    return (
        <Card>
            <h3 style={{ marginBottom: 10, color: "#042a75" }}>📑 Documentação Rápida</h3>

            {/* Campos obrigatórios */}
            {CAMPOS_OBRIGATORIOS.map((campo, idx) => (
                <FieldRow key={idx}>
                    <Label>{campo.label}:</Label>
                    <Value>{campo.value(cliente) || <i style={{ color: "#888" }}>Não informado</i>}</Value>
                    {campo.value(cliente) && campo.value(cliente) !== "nan" && (
                        <CopyButton title="Copiar" onClick={() => copyToClipboard(campo.value(cliente) as string)}>
                            <FaCopy />
                        </CopyButton>
                    )}
                </FieldRow>
            ))}

            {/* Campos opcionais */}
            {CAMPOS_OPCIONAIS.map((campo, idx) => (
                <FieldRow key={idx}>
                    <Label>{campo.label}:</Label>
                    <Value>{campo.value(cliente) || <i style={{ color: "#aaa" }}>Não informado</i>}</Value>
                </FieldRow>
            ))}

            {/* Badge de VIP */}
            {cliente.is_vip && <VipBadge>⭐ Cliente VIP</VipBadge>}

            {/* Botões de ação rápida */}
            <Actions>
                <ActionBtn onClick={() => window.open(`https://wa.me/55${cliente.telefone?.replace(/\D/g, "")}`, "_blank")}>
                    <FaWhatsapp /> WhatsApp
                </ActionBtn>
                <ActionBtn onClick={() => window.open(`mailto:${cliente.email}`)}>
                    <FaEnvelope /> E-mail
                </ActionBtn>
                {onBaixarTudoPDF && (
                    <ActionBtn onClick={onBaixarTudoPDF}>
                        <FaFileDownload /> Baixar PDF
                    </ActionBtn>
                )}
            </Actions>

            {/* Lista de documentos anexados */}
            {documentos.length > 0 && (
                <FileList>
                    <b>Documentos Anexados:</b>
                    {documentos.map(doc => (
                        <FileItem key={doc.id}>
                            <FileName>{doc.nome}</FileName>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                <ActionBtn as="span"><FaFileDownload />Baixar</ActionBtn>
                            </a>
                            <CopyButton title="Copiar link" onClick={() => copyToClipboard(doc.url)}>
                                <FaCopy />
                            </CopyButton>
                        </FileItem>
                    ))}
                </FileList>
            )}

            {/* Alertas de pendências */}
            {(pendencias.length > 0 || docPendencias.length > 0) && (
                <Alert>
                    <FaExclamationTriangle />
                    <span>
                        Pendências: {pendencias.concat(docPendencias).join(", ")}
                    </span>
                </Alert>
            )}
        </Card>
    );
};

export default DadosPropostaCard;
