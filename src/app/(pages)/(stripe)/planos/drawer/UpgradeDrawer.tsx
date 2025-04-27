// app/components/upgrade/UpgradeDrawer.tsx
'use client';

import React, { useState } from 'react';
import { Drawer, Divider, Input, Button, message, Space } from 'antd';
import { FaRocket } from 'react-icons/fa';
import {
    InfoGroup,
    Label,
    Value,
    HighlightValue,
    SectionTitle
} from '@/app/(pages)/(stripe)/planos/modal/UpgradeModal.styles';
import { formatBRLCurrency } from '@/utils/maskUtils';
import api from '@/app/api/axios';

interface UpgradeDrawerProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    planoAtualNome: string;
    planoNovoNome: string;
    precoAtual?: number;
    precoNovo?: number;
    diasRestantes: number;
    valorProporcional?: number;
    desconto?: number;
    valorFinalAgora?: number;
    cupomAplicado?: string | null;
    descricaoCupom?: string;
    promotionCode?: string | null;   // <===== ADICIONAR ISSO!
}

export default function UpgradeDrawer(props: UpgradeDrawerProps) {
    const {
        open,
        onClose,
        onConfirm,
        planoAtualNome,
        planoNovoNome,
        precoAtual = 0,
        precoNovo = 0,
        diasRestantes,
        valorProporcional = 0,
        desconto = 0,
        cupomAplicado: cupomInicial
    } = props;

    const [cupom, setCupom] = useState('');
    const [descricaoCupom, setDescricaoCupom] = useState<string | null>(null);
    const [promotionCode , setPromotionCode]    = useState<string|null>(null);
    const [cupomAplicado, setCupomAplicado] = useState<string | null>(cupomInicial ?? null);
    const [descontoCupom, setDescontoCupom] = useState<number>(desconto);
    const [saving, setSaving] = useState(false);
    const [loadingCupom, setLoadingCupom] = useState(false);
    const brutoAgora = Number(valorProporcional ?? 0) - Number(descontoCupom ?? 0);
    const totalAgora  = brutoAgora > 0 ? brutoAgora : 0;

    const handleAplicarCupom = async () => {
        if (!cupom) return;
        try {
            setLoadingCupom(true);
            const { data } = await api.post('/pagamentos/aplicar-cupom/', { codigo_cupom: cupom.trim() });
            message.success(`Cupom ${data.cupom_aplicado} aplicado!`);
            setCupomAplicado(data.cupom_aplicado);
            setDescontoCupom(Number(data.desconto));
            setPromotionCode(data.promotion_code);
            setDescricaoCupom(data.descricao);          // <- novo state
            setCupom('');
        } catch (e: any) {
            message.error(e?.response?.data?.error || 'Não foi possível aplicar o cupom.');
        } finally {
            setLoadingCupom(false);
        }
    };

    const handleOk = async () => {
        try {
            setSaving(true);
            await onConfirm();
        } finally {
            setSaving(false);
        }
    };

    return (
        <Drawer
            open={open}
            onClose={onClose}
            title={<span><FaRocket /> Atualização de Plano</span>}
            width={450}
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="primary" loading={saving} onClick={handleOk}>
                        Confirmar Atualização
                    </Button>
                </div>
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
                <Label>Dias restantes:</Label>
                <Value>{diasRestantes} dias</Value>
            </InfoGroup>

            <InfoGroup>
                <Label>Valor proporcional:</Label>
                <Value>{formatBRLCurrency(valorProporcional)}</Value>
            </InfoGroup>

            {cupomAplicado && (
                <InfoGroup>
                    <Label>Desconto ({ descricaoCupom }):</Label>
                    <Value>- {formatBRLCurrency(descontoCupom)}</Value>
                </InfoGroup>
            )}


            <HighlightValue>
                Valor a pagar agora:&nbsp;{formatBRLCurrency(totalAgora)}
            </HighlightValue>

            <Divider />

            {/* Campo de cupom */}
            <Space.Compact style={{ marginBottom: 16, width: '100%' }}>
                <Input
                    style={{ width: '70%' }}
                    placeholder="Inserir cupom"
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                    disabled={!!cupomAplicado || loadingCupom}
                />
                <Button
                    type="primary"
                    onClick={handleAplicarCupom}
                    loading={loadingCupom}
                    disabled={!cupom || !!cupomAplicado}
                >
                    Aplicar
                </Button>
            </Space.Compact>

            <SectionTitle>A partir do próximo ciclo</SectionTitle>
            <InfoGroup>
                <Label>Valor mensal:</Label>
                <Value>{formatBRLCurrency(precoNovo)}</Value>
            </InfoGroup>
        </Drawer>
    );
}
