'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Tag, Skeleton } from 'antd';
import api from "@/app/api/axios";

interface RelatorioData {
    taxa_conversao_por_status: Record<string, any>;
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
    taxa_sucesso_por_temperatura: Record<string, any>;
    sugestao_temperatura_atual: Record<string, number>;
}

const IndicadoresNegociacoes: React.FC = () => {
    const [dados, setDados] = useState<RelatorioData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('relatorios/negociacoes/').then((res) => {
            setDados(res.data);
            setLoading(false);
        });
    }, []);

    if (loading || !dados) return <Skeleton active paragraph={{ rows: 3 }} />;

    return (
        <div style={{
            marginBottom: 16,
            justifyContent: 'center',
            width: 'auto', display: 'flex'}}>
            <Row gutter={16} style={{
                display: "flex",
                width:'100%',
                alignItems: 'center',
                justifyContent: 'space-between'}}>
                <Col span={4}>
                    <Card>
                        <Statistic title="⏳ Tempo Médio até 1º Contato" value={dados.tempo_medio_primeiro_contato} />
                    </Card>
                </Col>
                <Col span={5}>
                    <Card>
                        <Statistic title="📞 Média Interações até Fechamento" value={dados.media_interacoes_para_fechamento} />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic title="❌ Taxa Cancelamento" value={dados.reunioes.taxa_cancelamento} />
                    </Card>
                </Col>
                <Col span={3}>
                    <Card>
                        <Statistic title="♻️ Taxa Remarcação" value={dados.reunioes.taxa_remarcacao} />
                    </Card>
                </Col>
                <Col span={7}>
                    <Card title="🌡️ Temperatura Atual das Negociações">
                        <div style={{ display: 'flex', gap: 16 }}>
                            {Object.entries(dados.sugestao_temperatura_atual).map(([nivel, quantidade]) => (
                                <Tag
                                    key={nivel}
                                    color={nivel === 'quente' ? 'red' : nivel === 'morno' ? 'orange' : 'blue'}
                                    style={{ fontSize: 16, padding: '4px 12px' }}
                                >
                                    {nivel.toUpperCase()}: {quantidade}
                                </Tag>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
            </Row>
        </div>
    );
};

export default IndicadoresNegociacoes;
