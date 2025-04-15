'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, Col, Row, Typography, Spin, message } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const DashboardContainer = styled.div`
    padding: 24px;
`;

const CardStyled = styled(Card)`
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const DashboardPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

            if (!token) {
                message.error('Token não encontrado. Faça login novamente.');
                setLoading(false);
                return;
            }

            try {
                const instance = axios.create({
                    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const res = await instance.get('/core-admin/dashboard/');
                setData(res.data);
            } catch (err) {
                console.error('Erro ao buscar dashboard:', err);
                message.error('Erro ao carregar dados do painel.');
            } finally {
                setLoading(false);
            }
        };

        if (typeof window !== 'undefined') {
            fetchData();
        }
    }, []);

    if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

    return (
        <DashboardContainer>
            <Title level={2}>Painel Interno</Title>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <CardStyled>
                        <UserOutlined style={{ fontSize: 24 }} />
                        <Title level={4}>Usuários</Title>
                        <p>{data?.usuarios_total ?? '—'}</p>
                    </CardStyled>
                </Col>
                <Col span={8}>
                    <CardStyled>
                        <TeamOutlined style={{ fontSize: 24 }} />
                        <Title level={4}>Clientes</Title>
                        <p>{data?.clientes_total ?? '—'}</p>
                    </CardStyled>
                </Col>
                <Col span={8}>
                    <CardStyled>
                        <FileTextOutlined style={{ fontSize: 24 }} />
                        <Title level={4}>Apólices</Title>
                        <p>{data?.apolices_total ?? '—'}</p>
                    </CardStyled>
                </Col>
                <Col span={8}>
                    <CardStyled>
                        <CalendarOutlined style={{ fontSize: 24 }} />
                        <Title level={4}>Tarefas Agendadas</Title>
                        <p>{data?.tarefas_ativas ?? '—'}</p>
                    </CardStyled>
                </Col>
                <Col span={8}>
                    <CardStyled>
                        <ClockCircleOutlined style={{ fontSize: 24 }} />
                        <Title level={4}>Reuniões (7 dias)</Title>
                        <p>{data?.reunioes_proximas ?? '—'}</p>
                    </CardStyled>
                </Col>
            </Row>
        </DashboardContainer>
    );
};

export default DashboardPage;
