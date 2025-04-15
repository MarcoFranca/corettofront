"use client";

import React from "react";
import { Drawer, Tabs, Descriptions, Tag } from "antd";
import { Cliente, NegociacaoCliente } from "@/types/interfaces";
import { ApoliceDetalhada } from "@/types/ApolicesInterface";

interface ClientePerfilDrawerProps {
    open: boolean;
    onClose: () => void;
    cliente: Cliente | null;
}

const ClientePerfilDrawer: React.FC<ClientePerfilDrawerProps> = ({ open, onClose, cliente }) => {
    if (!cliente) return null;

    const reunioes = cliente.relacionamentos?.reunioes ?? [];
    const negociacoes = cliente.relacionamentos?.negociacoes ?? [];
    const apolices: ApoliceDetalhada[] = cliente.apolices ?? [];

    return (
        <Drawer
            title={`Perfil: ${cliente.nome} ${cliente.sobre_nome || ""}`}
            placement="right"
            onClose={onClose}
            open={open}
            width={800}
            destroyOnClose
        >
            <Tabs defaultActiveKey="dados" items={[
                {
                    key: "dados",
                    label: "👤 Dados Principais",
                    children: (
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label="Nome completo">
                                {cliente.nome} {cliente.sobre_nome}
                            </Descriptions.Item>
                            <Descriptions.Item label="CPF">
                                {cliente.cpf || "Não informado"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Identidade">
                                {cliente.identidade || "Não informado"}{" "}
                                {cliente.tipo_identidade && `(${cliente.tipo_identidade})`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Data de nascimento">
                                {cliente.data_nascimento
                                    ? `${new Date(cliente.data_nascimento).toLocaleDateString("pt-BR")} ${cliente.idade ? `(${cliente.idade} anos)` : ""}`
                                    : "Não informado"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Gênero">
                                {cliente.genero === "M" ? "Masculino" : cliente.genero === "F" ? "Feminino" : "Não informado"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Profissão">
                                {cliente.profissao?.nome || "Não informado"}
                                {cliente.profissao?.categoria_pai_nome && (
                                    <span style={{ marginLeft: 8, fontStyle: "italic", color: "#888" }}>
            ({cliente.profissao?.categoria_pai_nome})
          </span>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Telefone">
                                {cliente.telefone || "Não informado"}
                                {(cliente.contatos_adicionais || []).length > 0 && (
                                    <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                                        {(cliente.contatos_adicionais || []).map((c, i) => (
                                            <li key={i}><strong>{c.tipo}:</strong> {c.valor}</li>
                                        ))}
                                    </ul>
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item label="E-mail">
                                {cliente.email || "Não informado"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Estado Civil">
                                {cliente.estado_civil || "Não informado"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Endereço">
                                {cliente.endereco ? (
                                    <>
                                        {cliente.endereco.logradouro}, {cliente.endereco.numero}
                                        {cliente.endereco.complemento && `, ${cliente.endereco.complemento}`}<br />
                                        {cliente.endereco.bairro} - {cliente.endereco.cidade}/{cliente.endereco.uf}<br />
                                        CEP: {cliente.endereco.cep}
                                    </>
                                ) : "Não informado"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color="blue">{cliente.status}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Status Reunião">
                                {cliente.status_reuniao
                                    ? <Tag color="purple">{cliente.status_reuniao}</Tag>
                                    : "Não definido"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Indicação">
                                {cliente.indicado_por_detalhes
                                    ? `${cliente.indicado_por_detalhes.tipo === "cliente" ? "Cliente" : "Parceiro"}: ${cliente.indicado_por_detalhes.nome}`
                                    : "Sem indicação"}
                            </Descriptions.Item>
                        </Descriptions>
                    )
                },
                {
                    key: "reunioes",
                    label: "📅 Reuniões",
                    children: (
                        <div>
                            {reunioes.length > 0 ? (
                                reunioes.map((reuniao, index) => (
                                    <div key={index}>
                                        <p><strong>{new Date(reuniao.start_time).toLocaleString("pt-BR")}</strong> - {reuniao.title}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhuma reunião registrada.</p>
                            )}
                        </div>
                    )
                },
                {
                    key: "negociacoes",
                    label: "📈 Negociações",
                    children: (
                        <div>
                            {negociacoes.length > 0 ? (
                                negociacoes.map((negociacao: NegociacaoCliente, idx) => (
                                    <div key={idx} style={{ marginBottom: 20 }}>
                                        <Descriptions
                                            bordered
                                            column={1}
                                            size="small"
                                            title={`Negociação #${idx + 1}`}
                                        >
                                            <Descriptions.Item label="Título">
                                                {negociacao.titulo || "—"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Status">
                                                <Tag color={negociacao.encerrada ? "red" : "blue"}>
                                                    {negociacao.status}
                                                </Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Interesse">
                                                {negociacao.interesse || "—"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Sugestão de Interesse">
                                                {negociacao.sugestao_interesse || "—"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Encerrada?">
                                                {negociacao.encerrada ? "✅ Sim" : "❌ Não"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Observações">
                                                {Array.isArray(negociacao.observacoes) && negociacao.observacoes.length > 0 ? (
                                                    <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
                                                        {negociacao.observacoes.map((obs, idxObs) => (
                                                            <li key={idxObs}>{obs}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <i>Nenhuma observação</i>
                                                )}

                                            </Descriptions.Item>
                                            <Descriptions.Item label="Reuniões">
                                                {negociacao.reunioes?.length > 0 ? (
                                                    <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
                                                        {negociacao.reunioes.map((r, idxR) => (
                                                            <li key={idxR}>
                                                                {new Date(r.start_time).toLocaleString("pt-BR")}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <i>Nenhuma reunião registrada</i>
                                                )}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhuma negociação ativa.</p>
                            )}
                        </div>
                    )
                },
                {
                    key: "apolices",
                    label: "📄 Apólices",
                    children: (
                        <div>
                            {apolices.length > 0 ? (
                                apolices.map((apolice, idx) => (
                                    <div key={idx}>
                                        <p><strong>Tipo:</strong> {apolice.tipo_produto}</p>
                                        <p><strong>Número:</strong> {apolice.numero_apolice || "—"}</p>
                                        <p><strong>Status:</strong> {apolice.status}</p>
                                        <hr />
                                    </div>
                                ))
                            ) : (
                                <p>Nenhuma apólice registrada.</p>
                            )}
                        </div>
                    )
                }
            ]}/>
        </Drawer>
    );
};

export default ClientePerfilDrawer;
