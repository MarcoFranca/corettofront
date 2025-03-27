// DashboardSidebar.tsx
'use client';

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector, useMediaQuery } from "@/services/hooks/hooks";
import { logout } from "@/store/slices/authSlice";
import { Sidebar, ProfileSection, UserInfo, NavMenu, NavItem, LogoutButton, LogoWrapper, UserImageWrapper, Icon } from "./DashboardSidebar.styles";
import dynamic from "next/dynamic";
import Image from "next/image";
import DefaultUserImage from "../../../../../../public/assets/common/user.svg";
import LogoImage from "../../../../../../public/assets/logoIcons/Logo_transparente_clara_horizontal.svg";
import { usePrefetchNavigation } from "@/services/hooks/usePrefetchNavigation";
import {setRouteLoading} from "@/store/slices/uiSlice";

// Dynamic import dos ícones
const FaHome = dynamic(() => import("react-icons/fa").then(mod => mod.FaHome));
const FaUserFriends = dynamic(() => import("react-icons/fa").then(mod => mod.FaUserFriends));
const FaWallet = dynamic(() => import("react-icons/fa").then(mod => mod.FaWallet));
const FaTasks = dynamic(() => import("react-icons/fa").then(mod => mod.FaTasks));
const FaCog = dynamic(() => import("react-icons/fa").then(mod => mod.FaCog));
const FaCalendarAlt = dynamic(() => import("react-icons/fa").then(mod => mod.FaCalendarAlt));
const FaSignOutAlt = dynamic(() => import("react-icons/fa").then(mod => mod.FaSignOutAlt));
const FaFileAlt = dynamic(() => import("react-icons/fa").then(mod => mod.FaFileAlt));

const DashboardSidebar = ({ profileImage }: { profileImage: string | null }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const user = useAppSelector((state) => state.auth?.user);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    usePrefetchNavigation([
        "/dashboard", "/dashboard/lead", "/dashboard/carteira",
        "/dashboard/tarefas", "/dashboard/agenda",
        "/dashboard/apolices", "/dashboard/parceiros", "/dashboard/config"
    ]);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/");
    };

    if (!isDesktop) return null;

    const isActive = (path: string) => pathname === path;

    const navigateTo = (path: string) => {
        if (pathname !== path) {
            dispatch(setRouteLoading(true)); // ⏳ Ativa o loading global
            router.push(path);
        }
    };

    return (
        <Sidebar>
            <ProfileSection>
                <LogoWrapper>
                    <Image src={LogoImage} alt="Logo" width={150} height={50} priority />
                </LogoWrapper>
                <UserImageWrapper>
                    <Image
                        src={profileImage && profileImage !== "null" ? profileImage : DefaultUserImage}
                        alt="User"
                        width={60}
                        height={60}
                        priority
                    />
                </UserImageWrapper>
                <UserInfo>{user?.username ?? "Usuário"}</UserInfo>
            </ProfileSection>

            <NavMenu>
                <NavItem onClick={() => navigateTo("/dashboard")} className={isActive("/dashboard") ? "active" : ""}>
                    <Icon><FaHome /></Icon> Dashboard
                </NavItem>
                <NavItem onClick={() => navigateTo("/dashboard/lead")} className={isActive("/dashboard/lead") ? "active" : ""}>
                    <Icon><FaUserFriends /></Icon> Leads
                </NavItem>
                <NavItem onClick={() => navigateTo("/dashboard/carteira")} className={isActive("/dashboard/carteira") ? "active" : ""}>
                    <Icon><FaWallet /></Icon> Carteira
                </NavItem>
                <NavItem onClick={() => navigateTo("/dashboard/tarefas")} className={isActive("/dashboard/tarefas") ? "active" : ""}>
                    <Icon><FaTasks /></Icon> Tarefas
                </NavItem>
                <NavItem onClick={() => navigateTo("/dashboard/agenda")} className={isActive("/dashboard/agenda") ? "active" : ""}>
                    <Icon><FaCalendarAlt /></Icon> Agenda
                </NavItem>
                <NavItem onClick={() => navigateTo("/dashboard/apolices")} className={isActive("/dashboard/apolices") ? "active" : ""}>
                    <Icon><FaFileAlt /></Icon> Apólices
                </NavItem>
                <NavItem onClick={() => navigateTo("/dashboard/parceiros")} className={isActive("/dashboard/parceiros") ? "active" : ""}>
                    <Icon><FaUserFriends /></Icon> Parceiros
                </NavItem>
                <NavItem onClick={() => navigateTo("/dashboard/config")} className={isActive("/dashboard/config") ? "active" : ""}>
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
