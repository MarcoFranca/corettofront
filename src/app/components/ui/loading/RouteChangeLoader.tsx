'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import CustomLoading from './CustomLoading';
import {Overlay} from "@/app/components/ui/loading/RoutChangeLoader.styles";

const RouteChangeLoader = () => {
    const loading = useSelector((state: RootState) => state.ui.routeLoading);

    if (!loading) return null;

    return (
        <Overlay>
            <CustomLoading />
        </Overlay>
    );
};

export default RouteChangeLoader;
