// hooks/useLeadBackup.ts
"use client";

import { useRef } from "react";
import { Lead } from "@/types/interfaces";

export const useLeadBackup = () => {
    const backups = useRef<Record<string, Lead>>({});

    const saveBackup = (id: string, data: Lead) => {
        backups.current[id] = data;
    };

    const getBackup = (id: string): Lead | undefined => {
        return backups.current[id];
    };

    const restoreBackup = (id: string, restoreFn: (lead: Lead) => void) => {
        const data = getBackup(id);
        if (data) {
            restoreFn(data);
            delete backups.current[id];
        }
    };

    return {
        saveBackup,
        getBackup,
        restoreBackup,
    };
};