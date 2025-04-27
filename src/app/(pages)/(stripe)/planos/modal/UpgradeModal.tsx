// app/components/upgrade/UpgradeModal.tsx
'use client';

import React, { useState } from 'react';
import { Modal, Divider, Input, Button, Tooltip, message } from 'antd';
import { FaRocket } from 'react-icons/fa';
import {
    InfoGroup,
    Label,
    Value,
    HighlightValue,
    SectionTitle,
} from '@/app/(pages)/(stripe)/planos/modal/UpgradeModal.styles';
import { formatBRLCurrency } from '@/utils/maskUtils';
import api from '@/app/api/axios';

interface UpgradeModalProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => Promise<void>;   // <- para podermos aguardar
    planoAtualNome: string;
    planoNovoNome: string;
    precoAtual?: number;
    precoNovo?: number;
    diasRestantes: number;
    valorProporcional?: number;
    desconto?: number;
    valorFinalAgora?: number;
    /** Cupom que já veio da simulação  */
    cupomAplicado?: string | null;
}

/* ------------------------- COMPONENT ------------------------- */
export default function UpgradeModal(props: UpgradeModalProps) {
    const {
        open,
        onCancel,
        onConfirm,
        planoAtualNome,
        planoNovoNome,
        precoAtual = 0,
        precoNovo = 0,
        diasRestantes,
        valorProporcional = 0,
        desconto = 0,
        valorFinalAgora = 0,
        cupomAplicado: cupomInical,
    } = props;

    /* --- state local p/ cupom & loading --- */
    const [cupom, setCupom] = useState('');
    const [cupomAplicado, setCupomAplicado] = useState<string | null>(
        cupomInical ?? null
    );
    const [descontoCupom, setDescontoCupom] = useState<number>(desconto);
    const [saving, setSaving] = useState(false);

    /* --- aplicar cupom --- */
    const handleAplicarCupom = async () => {
        if (!cupom) return;
        try {
            const { data } = await api.post('/pagamentos/aplicar-cupom/', {
                codigo_cupom: cupom.trim(),
            });
            message.success(`Cupom ${data.cupom_aplicado} aplicado!`);
            setCupomAplicado(data.cupom_aplicado);
            setDescontoCupom(Number(data.desconto));
            setCupom('');
        } catch (e: any) {
            message.error(
                e?.response?.data?.error || 'Não foi possível aplicar o cupom.'
            );
        }
    };

    /* --- confirmar (mostra loading) --- */
    const handleOk = async () => {
        try {
            setSaving(true);
            await onConfirm();
        } finally {
            setSaving(false);
        }
    };

    /* --- render --- */
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            okText="Atualizar Plano"
            cancelText="Cancelar"
            centered
            closeIcon={false}
            confirmLoading={saving}
            title={
                <>
                    <FaRocket /> Atualização de Plano
                </>
            }
        >
            <SectionTitle>Planos</SectionTitle>
            <InfoGroup>
                <Label>Plano atual:</Label>
                <Value>
                    {planoAtualNome} — {formatBRLCurrency(precoAtual)}
                </Value>
            </InfoGroup>

            <InfoGroup>
                <Label>Novo plano:</Label>
                <Value>
                    {planoNovoNome} — {formatBRLCurrency(precoNovo)}
                </Value>
            </InfoGroup>

            <Divider />

            <SectionTitle>Proporcional deste ciclo</SectionTitle>
            <InfoGroup>
                <Label>
                    Dias restantes:{' '}
                    <Tooltip title="Dias que faltam até o fim do ciclo atual">
                        <span style={{ cursor: 'help' }}>🛈</span>
                    </Tooltip>
                </Label>
                <Value>{diasRestantes} dias</Value>
            </InfoGroup>

            <InfoGroup>
                <Label>Valor proporcional:</Label>
                <Value>{formatBRLCurrency(valorProporcional)}</Value>
            </InfoGroup>

            {cupomAplicado && (
                <InfoGroup>
                    <Label>Desconto ({cupomAplicado}):</Label>
                    <Value>- {formatBRLCurrency(descontoCupom)}</Value>
                </InfoGroup>
            )}

            <HighlightValue>
                Valor a pagar agora:&nbsp;
                {formatBRLCurrency(valorFinalAgora - descontoCupom)}
            </HighlightValue>

            <Divider />

            {/* ------- Cupom Input ------- */}
            <Input.Group compact style={{ marginBottom: 16 }}>
                <Input
                    style={{ width: '70%' }}
                    placeholder="Inserir cupom de desconto"
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                    disabled={!!cupomAplicado}
                />
                <Button
                    type="primary"
                    onClick={handleAplicarCupom}
                    disabled={!cupom || !!cupomAplicado}
                >
                    Aplicar Cupom
                </Button>
            </Input.Group>

            <SectionTitle>A partir do próximo ciclo</SectionTitle>
            <InfoGroup>
                <Label>Valor mensal:</Label>
                <Value>{formatBRLCurrency(precoNovo)}</Value>
            </InfoGroup>
        </Modal>
    );
}
