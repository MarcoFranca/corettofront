'use client';

import React, { useEffect, useState } from 'react';
import api from '@/app/api/axios';
import styled from 'styled-components';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Button, Modal, message } from 'antd';

const ChecklistItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
`;

const StatusIcon = ({ ok }: { ok: boolean }) => (
    ok ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#d9d9d9' }} />
);

const InfoText = styled.p`
    margin-top: 16px;
    font-weight: bold;
    color: #52c41a;
`;

export default function TrialProgress() {
    const [checklist, setChecklist] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(true);

    const fetchChecklist = async () => {
        try {
            const response = await api.post('/pagamentos/liberar-tokens-trial/');
            setChecklist(response.data.checklist);
            message.success(response.data.detail);
        } catch (err: any) {
            setChecklist(err.response?.data?.checklist || null);
            message.warning(err.response?.data?.detail || 'Não foi possível liberar tokens.');
        }
    };

    useEffect(() => {
        fetchChecklist();
    }, []);

    if (!checklist) return null;

    const allReady = checklist.email_confirmado && checklist.plano_vinculado && checklist.cliente_stripe;

    return (
        <Modal
            title="🎯 Etapas para liberar 10 tokens de IA"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <ChecklistItem>
                <StatusIcon ok={checklist.email_confirmado} />
                E-mail confirmado
            </ChecklistItem>
            <ChecklistItem>
                <StatusIcon ok={checklist.plano_vinculado} />
                Plano vinculado
            </ChecklistItem>
            <ChecklistItem>
                <StatusIcon ok={checklist.cliente_stripe} />
                Conta vinculada ao Stripe
            </ChecklistItem>

            {checklist.trial_tokens_liberados ? (
                <InfoText>✅ Tokens já foram liberados!</InfoText>
            ) : (
                <Button
                    type="primary"
                    disabled={!allReady}
                    onClick={fetchChecklist}
                >
                    Liberar Tokens
                </Button>
            )}
        </Modal>
    );
}
