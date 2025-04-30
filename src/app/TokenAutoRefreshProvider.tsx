// app/TokenAutoRefreshProvider.tsx
'use client';

import { useTokenAutoRefresh } from '@/hooks/useTokenAutoRefresh';

export default function TokenAutoRefreshProvider() {
    useTokenAutoRefresh();
    return null; // Não renderiza nada
}
