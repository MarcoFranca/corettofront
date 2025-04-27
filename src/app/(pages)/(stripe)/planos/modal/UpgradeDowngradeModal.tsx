// UpgradeDowngradeModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Spin, Input, Button, message } from 'antd';
import api from '@/app/api/axios';

interface UpgradeDowngradeModalProps {
    open: boolean;
    onClose: () => void;
    planoAtualId: string;
    planoNovoId: string;
    subscriptionId: string;
}

interface SimulacaoResponse {
    valor_proporcional: number;
    valor_proximo_mes: number;
    desconto_aplicado?: string;
    novo_checkout_url?: string;
}

const UpgradeDowngradeModal: React.FC<UpgradeDowngradeModalProps> = ({ open, onClose, planoAtualId, planoNovoId, subscriptionId }) => {
    const [simulacao, setSimulacao] = useState<SimulacaoResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [cupom, setCupom] = useState('');
    const [reloading, setReloading] = useState(false);

    const fetchSimulacao = async (codigoPromo?: string) => {
        setLoading(true);
        try {
            const response = await api.post('/pagamentos/simular-troca-plano/', {
                plano_atual_id: planoAtualId,
                plano_novo_id: planoNovoId,
                subscription_id: subscriptionId,
                promotion_code: codigoPromo || null,
            });
            setSimulacao(response.data);
        } catch (error) {
            console.error(error);
            message.error('Erro ao simular troca de plano.');
        } finally {
            setLoading(false);
        }
    };

    const handleAplicarCupom = () => {
        if (!cupom) return;
        setReloading(true);
        fetchSimulacao(cupom).then(() => setReloading(false));
    };

    const handleConfirmarTroca = async () => {
        if (simulacao?.novo_checkout_url) {
            window.location.href = simulacao.novo_checkout_url;
        } else {
            try {
                await api.post('/pagamentos/trocar-plano/', {
                    plano_id: planoNovoId,
                });
                message.success('Plano alterado com sucesso!');
                window.location.reload();
            } catch (error) {
                console.error(error);
                message.error('Erro ao trocar de plano.');
            }
        }
    };

    useEffect(() => {
        if (open) {
            fetchSimulacao();
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title="Confirme sua troca de plano"
            centered
            destroyOnClose
        >
            {loading || !simulacao ? (
                <div style={{ textAlign: 'center' }}>
                    <Spin />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <p><strong>Pagamento proporcional hoje:</strong> R$ {(simulacao.valor_proporcional / 100).toFixed(2).replace('.', ',')}</p>
                        <p><strong>Valor no próximo ciclo:</strong> R$ {(simulacao.valor_proximo_mes / 100).toFixed(2).replace('.', ',')}</p>
                        {simulacao.desconto_aplicado && (
                            <p><strong>Desconto aplicado:</strong> {simulacao.desconto_aplicado}</p>
                        )}
                    </div>
                    <Input
                        placeholder="Inserir código de cupom"
                        value={cupom}
                        onChange={(e) => setCupom(e.target.value)}
                        suffix={<Button loading={reloading} onClick={handleAplicarCupom} size="small">Aplicar</Button>}
                    />
                    <Button type="primary" onClick={handleConfirmarTroca} block>
                        Confirmar Alteração
                    </Button>
                </div>
            )}
        </Modal>
    );
};

export default UpgradeDowngradeModal;
