// hooks/useLeadBackup.ts
"use client";

import { useRef } from "react";
import { Cliente } from "@/types/interfaces";

export const useLeadBackup = () => {
    const backups = useRef<Record<string, Cliente>>({});

    const saveBackup = (id: string, data: Cliente) => {
        backups.current[id] = data;
    };

    const getBackup = (id: string): Cliente | undefined => {
        return backups.current[id];
    };

    const restoreBackup = (id: string, restoreFn: (lead: Cliente) => void) => {
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