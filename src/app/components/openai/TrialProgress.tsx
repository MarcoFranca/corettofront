'use client';

import React, { useEffect, useState } from 'react';
import api from '@/app/api/axios';
import styled from 'styled-components';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Button, Modal, message } from 'antd';
import { FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const ChecklistItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 500;
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
`;

const StatusIcon = ({ ok }: { ok: boolean }) => (
    ok ? <CheckCircleFilled style={{ color: '#52c41a', fontSize: '18px' }} />
        : <CloseCircleFilled style={{ color: '#d9d9d9', fontSize: '18px' }} />
);

const InfoText = styled.p`
    margin-top: 20px;
    font-weight: 600;
    color: #389e0d;
    text-align: center;
`;

const StyledModal = styled(Modal)`
    .ant-modal-content {
        border-radius: 16px;
        padding: 24px;
        background: #ffffff;
        box-shadow: 0 0 0 4px #f0f5ff, 0 0 30px rgba(0, 0, 0, 0.08);
    }
    .ant-modal-header {
        border-radius: 16px 16px 0 0;
        //background-color: #f0f5ff;
    }
    .ant-modal-title {
        font-size: 20px;
        font-weight: bold;
        color: #042a75;
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;

export default function TrialProgress() {
    const [checklist, setChecklist] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchChecklist = async () => {
        try {
            const response = await api.get('/pagamentos/checklist-tokens-trial/');
            const checklistData = response.data.checklist;
            setChecklist(checklistData);

            const liberado = checklistData?.trial_tokens_liberados;

            if (!liberado) {
                setIsModalOpen(true);
            } else {
                localStorage.setItem('trialProgressSeen', 'true');
                setIsModalOpen(false);
            }
        } catch (err: any) {
            console.error("Erro ao carregar checklist:", err);
        }
    };

    const liberarTokens = async () => {
        try {
            const res = await api.post('/pagamentos/liberar-tokens-trial/');
            setChecklist(res.data.checklist);
            localStorage.setItem('trialProgressSeen', 'true');
            setIsModalOpen(false);
            message.success(res.data.detail);

            // 🎉 Efeito confetti
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
        } catch (err: any) {
            console.error("Erro ao liberar tokens:", err);
            message.warning(err.response?.data?.detail || 'Erro ao liberar tokens.');
        }
    };

    useEffect(() => {
        const hasSeen = localStorage.getItem('trialProgressSeen');

        if (!hasSeen) {
            fetchChecklist();
        }
    }, []);

    if (!checklist || checklist.trial_tokens_liberados) return null;

    const allReady = checklist.email_confirmado && checklist.plano_vinculado && checklist.cliente_stripe;

    return (
        <StyledModal
            title={<><FaRocket /> Desbloqueie o Poder da Sua Nova IA!</>}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            centered
            destroyOnClose
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
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

                <Button
                    type="primary"
                    block
                    size="large"
                    style={{ marginTop: 24, backgroundColor: '#042a75', borderColor: '#042a75', color: '#FFFFFF' }}
                    disabled={!allReady}
                    onClick={liberarTokens}
                >
                    Liberar Tokens 🏱
                </Button>

                <InfoText>🔹 Comece a usar a Cora agora e transforme seu atendimento!
                </InfoText>
            </motion.div>
        </StyledModal>
    );
}
