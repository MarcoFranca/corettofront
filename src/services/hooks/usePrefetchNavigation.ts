import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const usePrefetchNavigation = (routes: string[]) => {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            routes.forEach(route => router.prefetch(route));
        }
    }, [router, routes]);
};
