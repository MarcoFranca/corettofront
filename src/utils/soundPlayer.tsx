// components/utils/SoundPlayer.tsx
'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearSound } from '@/store/slices/soundSlice';

const SoundPlayer = () => {
    const dispatch = useDispatch();
    const { currentSound, soundOn } = useSelector((state: RootState) => state.sound);

    useEffect(() => {
        if (soundOn && currentSound) {
            const audio = new Audio(`/sounds/${currentSound}.wav`);
            audio.play().catch(err => console.warn('Erro ao tocar som:', err));
            dispatch(clearSound()); // limpa após tocar
        }
    }, [currentSound, soundOn, dispatch]);

    return null;
};

export default SoundPlayer;
