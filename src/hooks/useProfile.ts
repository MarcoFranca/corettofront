// src/hooks/useProfile.ts
'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useProfile = () => {
    const profileState = useSelector((state: RootState) => state.profile);

    const profile = profileState.data;
    const isLoading = profileState.loading;
    const hasError = !!profileState.error;

    return { profile, isLoading, hasError };
};
