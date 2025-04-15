'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Button, Form, Input, message, Spin } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import api from "@/app/api/axios";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  padding: 24px;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Logo = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  color: #042a75;
  font-weight: bold;
`;

const AdminLoginPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const loginRes = await api.post('/login/', {
                username: values.username,
                password: values.password,
            });

            const { access_token, refresh_token } = loginRes.data;

            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);

            const userRes = await api.get('/user_detail/', {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            const userGroups = userRes.data.groups || [];

            if (!userGroups.includes('root_admin') && !userGroups.includes('suporte')) {
                message.error('Acesso negado: você não faz parte da equipe interna.');
                return;
            }

            localStorage.setItem('user', JSON.stringify(userRes.data));
            message.success('Login administrativo realizado com sucesso!');
            router.push('/admin/dashboard');
        } catch (err: any) {
            message.error('Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <LoginBox>
                <Logo>CorretorLab Admin</Logo>
                <Form name="admin_login" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Informe o nome de usuário' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Usuário" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Informe a senha' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block disabled={loading}>
                            {loading ? <Spin size="small" /> : 'Entrar'}
                        </Button>
                    </Form.Item>
                </Form>
            </LoginBox>
        </Container>
    );
};

export default AdminLoginPage;
