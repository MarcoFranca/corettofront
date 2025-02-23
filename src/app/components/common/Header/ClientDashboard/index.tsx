'use client';

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RootState } from "@/store";
import { fetchClienteDetalhe } from "@/store/slices/clientesSlice";
import { ClientSidebar, ProfileSection, UserInfo, NavMenu, NavItem, LogoWrapper, Icon } from "./ClientDashboard.styles";
import { FaArrowLeft, FaUser, FaFileAlt, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import Image from "next/image";
import LogoImage from "../../../../../../public/assets/logoIcons/Logo_transparente_clara_horizontal.svg";

interface Params {
    clientId?: string;
}

const ClientDashboard = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams() as Params;
    const clienteId = params.clientId ?? '';
    const clienteDetalhe = useAppSelector((state: RootState) => state.clientes.clienteDetalhe);
    const apolicesDetalhes = clienteDetalhe?.apolices_detalhes;

    useEffect(() => {
        if (clienteId) {
            dispatch(fetchClienteDetalhe(clienteId));
        }
    }, [clienteId, dispatch]);
            console.log("Cliente detalhes detalhes detected", clienteDetalhe);

    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <ClientSidebar>
            <ProfileSection>
                <LogoWrapper>
                    <Image src={LogoImage} alt="Logo" width={150} height={50} />
                </LogoWrapper>
                <UserInfo>
                    <p>{clienteDetalhe?.nome ?? "Carregando..."}</p>
                    <small>Status: {clienteDetalhe?.status ?? "Indefinido"}</small>
                    <small>Apólices Ativas: {clienteDetalhe?.total_apolices ?? 0}</small>
                </UserInfo>
            </ProfileSection>

            <NavMenu>
                <NavItem onClick={() => router.push("/dashboard/carteira")} className={isActive("/dashboard/carteira") ? "active" : ""}>
                    <Icon><FaArrowLeft /></Icon> Retornar
                </NavItem>
                <NavItem onClick={() => router.push(`/dashboard/cliente/${clienteId}`)} className={isActive(`/dashboard/cliente/${clienteId}`) ? "active" : ""}>
                    <Icon><FaUser /></Icon> Ficha do Cliente
                </NavItem>
                <NavItem onClick={() => router.push(`/dashboard/cliente/${clienteId}/infoclient`)} className={isActive(`/dashboard/cliente/${clienteId}/infoclient`) ? "active" : ""}>
                    <Icon><FaInfoCircle /></Icon> InfoClient
                </NavItem>
                <NavItem onClick={() => router.push(`/dashboard/cliente/${clienteId}/apolice`)} className={isActive(`/dashboard/cliente/${clienteId}/apolice`) ? "active" : ""}>
                    <Icon><FaFileAlt /></Icon> Apólices
                </NavItem>
                <NavItem onClick={() => router.push(`/dashboard/cliente/${clienteId}/reuniao`)} className={isActive(`/dashboard/cliente/${clienteId}/reuniao`) ? "active" : ""}>
                    <Icon><FaCalendarAlt /></Icon> Reuniões
                </NavItem>
            </NavMenu>
        </ClientSidebar>
    );
};

export default ClientDashboard;
