'use client'
import styles from './styles.module.css';
import Cell from "@/app/components/common/Header/DashboardSidebar/cell";
import LeadModal from "@/app/components/Modal/LeadModal";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import { createLead } from "@/store/slices/leadsSlice";
import Image from 'next/image';

// imagens
import UserImage from "../../../../../../public/assets/common/user.svg";
import EditUserImage from "../../../../../../public/assets/common/editar_usuario_branco.svg";
import LogoutImage from "../../../../../../public/assets/login/logout_branco.svg";
import LogoImage from '../../../../../../public/assets/logoIcons/Logo_transparente_clara_horizontal.svg';
import DashboardImage from '../../../../../../public/assets/asideButtons/dashboard.svg';
import DolarImage from '../../../../../../public/assets/asideButtons/Leads.svg';
import CarteiraImage from '../../../../../../public/assets/asideButtons/carteira.svg';
import TodoImage from '../../../../../../public/assets/asideButtons/todo.svg';

const ClientDashboard = ({ clientId }: { clientId: string }) => {
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const leadsFromStore = useAppSelector((state) => state.leads.leads);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    const toggleDropdown = (open: boolean) => {
        setDropdownOpen(open);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleLeadSubmit = async (leadData: any) => {
        await dispatch(createLead(leadData));
        closeModal();
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.profile}>
                <Image src={LogoImage} alt={'logo'} className={styles.logo} priority />
            </div>
            <div className={styles.headerBar}>
                <div
                    className={styles.userMenu}
                    onMouseEnter={() => toggleDropdown(true)}
                    onMouseLeave={() => toggleDropdown(false)}
                >
                    <div className={styles.userMenuAcecces}>
                        <Image
                            src={UserImage}
                            alt="user"
                            className={styles.userImage}
                        />
                        <p>{user?.username ?? 'usuario'}</p>
                    </div>
                    {dropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            <div className={styles.dropdownBar}></div>
                            <div className={styles.dropdownButton} onClick={() => router.push('/edit-profile')}>
                                <Image src={EditUserImage} alt={'editar usuario'} />
                                Editar
                            </div>
                            <div className={styles.dropdownButton} onClick={handleLogout}>
                                <Image src={LogoutImage} alt={'logout'} />
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <LeadModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                onSubmit={handleLeadSubmit}
            />
            <nav>
                <ul>
                    <Cell url='/dashboard/carteira' image={DashboardImage} alt="Dashboard" text={'RETORNAR'} campo={'dashboard'} />
                    <Cell url={`/dashboard/cliente/${clientId}`} image={DolarImage} alt="Ficha do Cliente" campo={'fichaCliente'} text={'FICHA DO CLIENTE'} />
                    <Cell url={`/dashboard/cliente/${clientId}/infoclient`} image={DolarImage} alt="Infoclient" campo={'Infoclient'} text={'INFOCLIENT'} />
                    <Cell url={`/dashboard/cliente/${clientId}/apolice`} image={CarteiraImage} alt="apolice" campo={'apolice'} text={'APOLICES'} />
                    <Cell url={`/dashboard/cliente/${clientId}/reuniao`} image={TodoImage} alt="reuniao" campo={'reuniao'} text={'REUNIÕES'} />
                </ul>
            </nav>
        </aside>
    );
};

export default ClientDashboard;
