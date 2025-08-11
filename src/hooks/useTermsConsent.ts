'use client';
import { useCallback, useState } from 'react';
import api from '@/app/api/axios';

type StatusResp = {
    current_version: string;
    accepted: boolean;
    accepted_at: string | null;
    must_accept: boolean;
};

export function useTermsConsent() {
    const [open, setOpen] = useState(false);
    const [version, setVersion] = useState('1.0');
    const [loading, setLoading] = useState(false);
    const [checkedOnce, setCheckedOnce] = useState(false); // evita loop de múltiplas chamadas

    const fetchStatus = useCallback(async () => {
        try {
            const { data } = await api.get<StatusResp>('/profiles/terms/status/');
            setVersion(data.current_version);
            // se precisa aceitar e ainda não exibimos neste ciclo, abre modal
            if (data.must_accept && !checkedOnce) {
                setOpen(true);
                setCheckedOnce(true);
            }
        } catch (e) {
            // silencioso: se falhar, não bloqueia a navegação
        }
    }, [checkedOnce]);

    const accept = useCallback(async () => {
        setLoading(true);
        try {
            await api.post('/profiles/terms/accept/', { version });
            setOpen(false);
        } finally {
            setLoading(false);
        }
    }, [version]);

    return { open, version, loading, fetchStatus, accept, close: () => setOpen(false) };
}
