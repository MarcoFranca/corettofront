// hooks/useModalSound.ts
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/services/hooks/hooks";
import { playSound } from "@/store/slices/soundSlice";

/**
 * Hook para tocar som ao abrir ou fechar modais.
 * Exemplo de uso: useModalSound(isOpen)
 */
export const useModalSound = (isOpen: boolean) => {
    const dispatch = useAppDispatch();
    const prevState = useRef<boolean>(isOpen);

    useEffect(() => {
        if (prevState.current !== isOpen) {
            dispatch(playSound(isOpen ? "openModal" : "closeModal"));
            prevState.current = isOpen;
        }
    }, [isOpen, dispatch]);
};
