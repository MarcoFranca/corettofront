'use client';

import React, { useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RootState } from "@/store";
import { fetchClienteDetalhe } from "@/store/slices/clientesSlice";
import { setRouteLoading } from "@/store/slices/uiSlice"; // ✅ Importar a ação
import {
    ClientSidebar,
    ProfileSection,
    UserInfo,
    NavMenu,
    NavItem,
    LogoWrapper,
    Icon
} from "./ClientDashboard.styles";
import {
    FaArrowLeft,
    FaUser,
    FaFileAlt,
    FaCalendarAlt,
    FaInfoCircle
} from "react-icons/fa";
import Image from "next/image";
import LogoImage from "../../../../../../public/assets/logoIcons/Logo_transparente_clara_horizontal.svg";

interface ClientDashboardSidebarProps {
    profileImage?: string;
}

const ClientDashboardSidebar: React.FC<ClientDashboardSidebarProps> = ({ profileImage }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const clienteId = params?.clientId as string;
    const clienteDetalhe = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);

    useEffect(() => {
        if (clienteId) {
            dispatch(fetchClienteDetalhe(clienteId));
        }
    }, [clienteId, dispatch]);

    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    // ✅ função genérica de navegação com loading
    const navigateTo = (path: string) => {
        if (pathname !== path) {
            dispatch(setRouteLoading(true));
            router.push(path);
        }
    };

    return (
        <ClientSidebar>
            <ProfileSection>
                <LogoWrapper>
                    <Image src={LogoImage} alt="Logo" width={150} height={50} priority />
                </LogoWrapper>
                <UserInfo>
                    <p>{clienteDetalhe?.nome ?? "Carregando..."}</p>
                    <small>Status: {clienteDetalhe?.status ?? "Indefinido"}</small>
                    <small>Apólices Ativas: {clienteDetalhe?.total_apolices ?? 0}</small>
                </UserInfo>
            </ProfileSection>

            <NavMenu>
                <NavItem
                    onClick={() => navigateTo("/dashboard/carteira")}
                    className={isActive("/dashboard/carteira") ? "active" : ""}
                >
                    <Icon><FaArrowLeft /></Icon> Retornar
                </NavItem>
                <NavItem
                    onClick={() => navigateTo(`/dashboard/cliente/${clienteId}`)}
                    className={isActive(`/dashboard/cliente/${clienteId}`) ? "active" : ""}
                >
                    <Icon><FaUser /></Icon> Ficha do Cliente
                </NavItem>
                <NavItem
                    onClick={() => navigateTo(`/dashboard/cliente/${clienteId}/infoclient`)}
                    className={isActive(`/dashboard/cliente/${clienteId}/infoclient`) ? "active" : ""}
                >
                    <Icon><FaInfoCircle /></Icon> InfoClient
                </NavItem>
                <NavItem
                    onClick={() => navigateTo(`/dashboard/cliente/${clienteId}/apolice`)}
                    className={isActive(`/dashboard/cliente/${clienteId}/apolice`) ? "active" : ""}
                >
                    <Icon><FaFileAlt /></Icon> Apólices
                </NavItem>
                <NavItem
                    onClick={() => navigateTo(`/dashboard/cliente/${clienteId}/reuniao`)}
                    className={isActive(`/dashboard/cliente/${clienteId}/reuniao`) ? "active" : ""}
                >
                    <Icon><FaCalendarAlt /></Icon> Reuniões
                </NavItem>
            </NavMenu>
        </ClientSidebar>
    );
};

export default ClientDashboardSidebar;
