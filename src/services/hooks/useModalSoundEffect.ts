// hooks/useModalSoundEffect.ts
"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/services/hooks/hooks";
import { playSound } from "@/store/slices/soundSlice";

/**
 * Hook que dispara som ao abrir e fechar modais com base no estado booleano `isOpen`.
 */
export const useModalSoundEffect = (isOpen: boolean) => {
    const dispatch = useAppDispatch();
    const wasOpen = useRef<boolean>(isOpen);

    useEffect(() => {
        if (wasOpen.current !== isOpen) {
            dispatch(playSound(isOpen ? "openModal" : "closeModal"));
            wasOpen.current = isOpen;
        }
    }, [isOpen, dispatch]);
};
