'use client';

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector, useMediaQuery } from "@/hooks/hooks";
import { logout } from "@/store/slices/authSlice";
import { Sidebar, ProfileSection, UserInfo, NavMenu, NavItem, LogoutButton, LogoWrapper, UserImageWrapper, Icon } from "./DashboardSidebar.styles";
import { FaHome, FaUserFriends, FaWallet, FaTasks, FaCog, FaCalendarAlt, FaSignOutAlt, FaFileAlt } from "react-icons/fa";
import Image from "next/image";
import DefaultUserImage from "../../../../../../public/assets/common/user.svg";
import LogoImage from "../../../../../../public/assets/logoIcons/Logo_transparente_clara_horizontal.svg";

const DashboardSidebar = ({ profileImage }: { profileImage: string | null }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname(); // 🔥 Obtendo o caminho atual
    const user = useAppSelector((state) => state.auth?.user);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleLogout = () => {
        dispatch(logout());
        router.push("/");
    };

    if (!isDesktop) return null; // Esconde a sidebar em dispositivos móveis

    const isActive = (path: string) => pathname === path;

    return (
        <Sidebar>
            <ProfileSection>
                <LogoWrapper>
                    <Image src={LogoImage} alt="Logo" width={150} height={50} priority />
                </LogoWrapper>
                <UserImageWrapper>
                    <Image src={profileImage || DefaultUserImage} alt="User" width={60} height={60} priority />
                </UserImageWrapper>
                <UserInfo>{user?.username ?? "Usuário"}</UserInfo>
            </ProfileSection>

            <NavMenu>

                <NavItem onClick={() => router.push("/dashboard")} className={isActive("/dashboard") ? "active" : ""}>
                    <Icon><FaHome /></Icon> Dashboard
                </NavItem>
                <NavItem onClick={() => router.push("/dashboard/lead")} className={isActive("/dashboard/lead") ? "active" : ""}>
                    <Icon><FaUserFriends /></Icon> Leads
                </NavItem>
                <NavItem onClick={() => router.push("/dashboard/carteira")} className={isActive("/dashboard/carteira") ? "active" : ""}>
                    <Icon><FaWallet /></Icon> Carteira
                </NavItem>
                <NavItem onClick={() => router.push("/dashboard/tarefas")} className={isActive("/dashboard/tarefas") ? "active" : ""}>
                    <Icon><FaTasks /></Icon> Tarefas
                </NavItem>
                <NavItem onClick={() => router.push("/dashboard/agenda")} className={isActive("/dashboard/agenda") ? "active" : ""}>
                    <Icon><FaCalendarAlt /></Icon> Agenda
                </NavItem>
                <NavItem onClick={() => router.push("/dashboard/apolices")} className={isActive("/dashboard/apolices") ? "active" : ""}>
                    <Icon><FaFileAlt /></Icon> Apólices
                </NavItem>
                <NavItem onClick={() => router.push("/dashboard/parceiros")} className={isActive("/dashboard/parceiros") ? "active" : ""}>
                    <Icon><FaUserFriends /></Icon> Parceiros
                </NavItem>
                <NavItem onClick={() => router.push("/dashboard/config")} className={isActive("/dashboard/config") ? "active" : ""}>
                    <Icon><FaCog /></Icon> Configuração
                </NavItem>
            </NavMenu>

            <LogoutButton onClick={handleLogout}>
                <Icon><FaSignOutAlt /></Icon> Logout
            </LogoutButton>
        </Sidebar>
    );
};

export default DashboardSidebar;
