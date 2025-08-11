'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Checkbox, Alert, App, Typography, Space, message as antdMessage } from 'antd';
import api from '@/app/api/axios';
import termsHtmlV2 from '@/app/legal/text/terms_v1';
import privacyHtmlV1 from '@/app/legal/text/privacy_v1';
import dpaHtmlV1 from '@/app/legal/text/dpa_v1';

type Props = {
    open: boolean;
    version?: string;
    onClose?: () => void;
    loading?: boolean;
    onAccept?: () => Promise<void> | void;
};

const TermsConsentModal: React.FC<Props> = ({ open, version, onClose, loading: externalLoading, onAccept }) => {
    const { message: ctxMessage } = App.useApp();
    const msg = ctxMessage ?? antdMessage;

    const scrollBoxRef = useRef<HTMLDivElement>(null);
    const isMountedRef = useRef(true);

    const [acceptEnabled, setAcceptEnabled] = useState(false);
    const [agreeChecked, setAgreeChecked] = useState(false);
    const [internalLoading, setInternalLoading] = useState(false);
    const [currentVersion, setCurrentVersion] = useState<string>(version || '1.0');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const isLoading = typeof externalLoading === 'boolean' ? externalLoading : internalLoading;

    const reachedEnd = (el: HTMLDivElement) => {
        const { scrollTop, clientHeight, scrollHeight } = el;
        if (!scrollHeight || !clientHeight) return false;
        const nearBottom = scrollTop + clientHeight >= scrollHeight - 6;
        const maxScroll = Math.max(scrollHeight - clientHeight, 1);
        const percent = scrollTop / maxScroll;
        return nearBottom || percent >= 0.98;
    };

    useEffect(() => {
        if (open) {
            setAcceptEnabled(false);
            setAgreeChecked(false);
            setSubmitError(null);
        }
    }, [open]);

    useEffect(() => {
        isMountedRef.current = true;
        const fetchStatus = async () => {
            try {
                if (!open) return;
                if (version) {
                    setCurrentVersion(version);
                    return;
                }
                const { data } = await api.get('/profiles/terms/status/');
                if (!isMountedRef.current) return;
                setCurrentVersion(data?.current_version ?? '1.0');
            } catch {
                /* silencioso */
            }
        };
        fetchStatus();
        return () => { isMountedRef.current = false; };
    }, [open, version]);

    useEffect(() => {
        if (!open) return;
        const el = scrollBoxRef.current;
        if (!el) return;

        setAcceptEnabled(false);

        const notScrollable = el.scrollHeight - el.clientHeight <= 4;
        if (notScrollable) { setAcceptEnabled(true); return; }

        let stop = false;
        const tick = () => {
            if (stop) return;
            if (reachedEnd(el)) { setAcceptEnabled(true); stop = true; return; }
            requestAnimationFrame(tick);
        };
        const rafId = requestAnimationFrame(tick);
        return () => { stop = true; cancelAnimationFrame(rafId); };
    }, [open]);

    const handleInnerScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        if (!acceptEnabled && reachedEnd(el)) setAcceptEnabled(true);
    };

    const postAccept = async (url: string) => {
        return api.post(url, { version: currentVersion }, { timeout: 15000 });
    };

    const handleAccept = async () => {
        if (!agreeChecked) {
            msg.warning('Você precisa marcar a caixa de concordância.');
            return;
        }

        setSubmitError(null);

        // callback externo do hook (preferencial)
        if (onAccept) {
            try {
                await onAccept();
                msg.success('Termos aceitos com sucesso!');
                onClose?.();
            } catch (err: any) {
                const detail = err?.response?.data?.detail || err?.message || 'Não foi possível registrar o aceite.';
                setSubmitError(detail);
            }
            return;
        }

        // Fallback: POST interno
        setInternalLoading(true);
        const hide = msg.loading('Registrando aceite...', 0);

        try {
            // tenta com barra
            await postAccept('/profiles/terms/accept/');
        } catch (err1: any) {
            const status = err1?.response?.status;
            const code = err1?.code;
            if (status === 404 || status === 308 || status === 301 || code === 'ECONNABORTED') {
                // tenta sem barra
                try {
                    await postAccept('/profiles/terms/accept');
                } catch (err2: any) {
                    const detail = err2?.response?.data?.detail || err2?.message || 'Não foi possível registrar o aceite. Tente novamente.';
                    setSubmitError(detail);
                    hide();
                    setInternalLoading(false);
                    return;
                }
            } else {
                const detail = err1?.response?.data?.detail || err1?.message || 'Não foi possível registrar o aceite. Tente novamente.';
                setSubmitError(detail);
                hide();
                setInternalLoading(false);
                return;
            }
        }

        hide();
        setInternalLoading(false);
        msg.success('Termos aceitos com sucesso!');
        onClose?.();
    };

    const handlePrint = () => {
        window.open('/terms_of_service', '_blank', 'noopener');
        window.open('/privacy_policy', '_blank', 'noopener');
        window.open('/dpa', '_blank', 'noopener');
    };

    const scrollToSection = (id: string) => {
        const root = scrollBoxRef.current;
        if (!root) return;
        const el = root.querySelector<HTMLElement>(`#${id}`);
        if (!el) return;
        root.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose ?? (() => {})}
            footer={null}
            width={920}
            destroyOnClose
            title="Aceite dos Termos de Uso, Política de Privacidade e DPA"
            // styles={{ body: { maxHeight: 'unset', overflow: 'visible' } }}
        >
            <Alert
                type="info"
                showIcon
                message="Importante"
                description={<span>Este aceite será registrado com data, IP e user agent para fins de auditoria (LGPD).</span>}
                style={{ marginBottom: 16 }}
            />

            <Space align="center" style={{ width: '100%', justifyContent: 'space-between', marginBottom: 8 }}>
                <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                    Versão dos termos: <strong>{currentVersion}</strong>
                </Typography.Paragraph>

                <Space>
                    <Button size="small" onClick={() => window.open('/terms_of_service', '_blank', 'noopener')}>Ver Termos</Button>
                    <Button size="small" onClick={() => window.open('/privacy_policy', '_blank', 'noopener')}>Ver Privacidade</Button>
                    <Button size="small" onClick={() => window.open('/dpa', '_blank', 'noopener')}>Ver DPA</Button>
                    <Button size="small" onClick={handlePrint}>Abrir para Imprimir</Button>
                </Space>
            </Space>

            {/* Sumário – usa href="#" e handler em bloco para evitar avisos */}
            <div style={{ marginBottom: 8, fontSize: 13 }}>
                <strong>Sumário rápido:</strong>{' '}
                <a href="#"
                   onClick={(e) => { e.preventDefault(); scrollToSection('termos'); }}>
                    Termos
                </a>{' '}·{' '}
                <a href="#"
                   onClick={(e) => { e.preventDefault(); scrollToSection('privacidade'); }}>
                    Privacidade
                </a>{' '}·{' '}
                <a href="#"
                   onClick={(e) => { e.preventDefault(); scrollToSection('dpa'); }}>
                    DPA
                </a>
            </div>

            <div
                ref={scrollBoxRef}
                onScroll={handleInnerScroll}
                style={{
                    maxHeight: 420,
                    overflowY: 'auto',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: 16,
                    background: '#fff',
                }}
            >
                <div id="termos" dangerouslySetInnerHTML={{ __html: termsHtmlV2 }} />
                <hr style={{ margin: '28px 0', borderColor: '#eee' }} />
                <div id="privacidade" dangerouslySetInnerHTML={{ __html: privacyHtmlV1 }} />
                <hr style={{ margin: '28px 0', borderColor: '#eee' }} />
                <div id="dpa" dangerouslySetInnerHTML={{ __html: dpaHtmlV1 }} />
                <div style={{ height: 24 }} />
            </div>

            <Typography.Paragraph style={{ marginTop: 12, color: '#666' }}>
                Role até o final desta caixa para habilitar o botão de concordância. Ao aceitar, você consente com o tratamento
                de dados pessoais conforme os documentos acima e declara estar autorizado a inserir dados de titulares na
                plataforma.
            </Typography.Paragraph>

            {!!submitError && (
                <Alert
                    type="error"
                    showIcon
                    message="Não foi possível registrar o aceite"
                    description={submitError}
                    style={{ marginTop: 8 }}
                />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <Checkbox
                    checked={agreeChecked}
                    onChange={(e) => setAgreeChecked(e.target.checked)}
                    disabled={!acceptEnabled}
                >
                    Li e concordo com os Termos de Uso, a Política de Privacidade e o DPA
                </Checkbox>

                <div style={{ marginLeft: 'auto' }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
                    <Button
                        type="primary"
                        disabled={!acceptEnabled || !agreeChecked}
                        loading={isLoading}
                        onClick={handleAccept}
                    >
                        Aceito os Termos
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default TermsConsentModal;
