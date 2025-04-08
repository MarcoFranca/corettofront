'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/api/axios';
import { Spin, Card, Tag, Statistic, Row, Col } from 'antd';

interface RelatorioNegociacoes {
    taxa_conversao_por_status: Record<string, { total: number; fechadas: number; taxa_conversao: string }>;
    tempo_medio_primeiro_contato: string;
    reunioes: {
        total: number;
        canceladas: number;
        remarcadas: number;
        nao_compareceu: number;
        taxa_cancelamento: string;
        taxa_remarcacao: string;
    };
    media_interacoes_para_fechamento: string;
    taxa_sucesso_por_temperatura: Record<string, { total: number; fechadas: number; taxa_sucesso: string }>;
    sugestao_temperatura_atual: { frio: number; morno: number; quente: number };
}

const RelatorioCompletoNegociacoes = () => {
    const [dados, setDados] = useState<RelatorioNegociacoes | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRelatorio() {
            try {
                const response = await api.get('relatorios/negociacoes/');
                setDados(response.data);
            } catch (error) {
                console.error("Erro ao buscar relatório:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchRelatorio();
    }, []);

    if (loading) return <Spin size="large" />;

    return (
        <div style={{ marginTop: 20 }}>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card>
                        <Statistic title="⏳ Tempo médio até 1º contato" value={dados?.tempo_medio_primeiro_contato || "N/A"} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="📞 Média de interações até fechamento" value={dados?.media_interacoes_para_fechamento || "N/A"} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="❌ Taxa de cancelamento" value={dados?.reunioes.taxa_cancelamento || "0%"} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="♻️ Taxa de remarcação" value={dados?.reunioes.taxa_remarcacao || "0%"} />
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 20 }}>
                <h3>🌡️ Distribuição atual da temperatura das negociações</h3>
                <Row gutter={16}>
                    {Object.entries(dados?.sugestao_temperatura_atual || {}).map(([key, value]) => (
                        <Col key={key}>
                            <Tag color={key === 'quente' ? 'red' : key === 'morno' ? 'orange' : 'blue'}>
                                {key.toUpperCase()}: {value}
                            </Tag>
                        </Col>
                    ))}
                </Row>
            </Card>

            <Card style={{ marginTop: 20 }}>
                <h3>📌 Taxa de Conversão por Status</h3>
                <Row gutter={[16, 16]}>
                    {Object.entries(dados?.taxa_conversao_por_status || {}).map(([key, info]) => (
                        <Col span={6} key={key}>
                            <Card bordered>
                                <Statistic
                                    title={key.replace('_', ' ').toUpperCase()}
                                    value={info.taxa_conversao}
                                    suffix={`(${info.fechadas}/${info.total})`}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>

            <Card style={{ marginTop: 20 }}>
                <h3>📌 Taxa de Sucesso por Temperatura</h3>
                <Row gutter={[16, 16]}>
                    {Object.entries(dados?.taxa_sucesso_por_temperatura || {}).map(([key, info]) => (
                        <Col span={6} key={key}>
                            <Card bordered>
                                <Statistic
                                    title={key.toUpperCase()}
                                    value={info.taxa_sucesso}
                                    suffix={`(${info.fechadas}/${info.total})`}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </div>
    );
};

export default RelatorioCompletoNegociacoes;
