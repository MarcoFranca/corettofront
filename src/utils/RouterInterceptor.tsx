'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks/hooks';
import { setRouteLoading } from '@/store/slices/uiSlice';

const RouterInterceptor = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    const lastPath = useRef(pathname);

    useEffect(() => {
        if (lastPath.current !== pathname) {
            // 👈 desliga o loading após troca real de rota
            dispatch(setRouteLoading(false));
            lastPath.current = pathname;
        }
    }, [pathname, dispatch]);

    useEffect(() => {
        const originalPush = router.push;

        router.push = (...args: Parameters<typeof router.push>) => {
            dispatch(setRouteLoading(true));
            return originalPush(...args);
        };

        return () => {
            // restore original push on cleanup
            router.push = originalPush;
        };
    }, [router, dispatch]);

    return null;
};

export default RouterInterceptor;
