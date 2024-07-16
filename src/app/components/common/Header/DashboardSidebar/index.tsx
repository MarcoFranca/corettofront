'use client'
import styles from './styles.module.css';
import LogoImage from '@/../public/assets/Ativo 1.png';
import DashboardImage from '@/../public/assets/dashboard.svg';
import DolarImage from '@/../public/assets/Leads.svg';
import CarteiraImage from '@/../public/assets/carteira.svg';
import TodoImage from '@/../public/assets/Tarefas.svg';
import ConfigImage from '@/../public/assets/engrenagem.svg';
import AgendaImage from '@/../public/assets/agenda2.svg';
import Image from 'next/image';
import Cell from "@/app/components/common/Header/DashboardSidebar/cell";
import UserImage from "../../../../../../public/assets/user.png";
import LeadModal from "@/app/components/Modal/LeadModal";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {useRouter} from "next/navigation";
import {logout} from "@/store/slices/authSlice";
import {createLead} from "@/store/slices/leadsSlice";
import {DropResult} from "@hello-pangea/dnd";



const DashboardSidebar = () => {
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
        // @ts-ignore
        await dispatch(createLead(leadData));
        closeModal();
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.profile}>
                <Image src={LogoImage} alt={'logo'} className={styles.logo} priority/>
            </div>
            <div className={styles.headerBar}>

                <div
                    className={styles.userMenu}
                    onMouseEnter={() => toggleDropdown(true)}
                    onMouseLeave={() => toggleDropdown(false)}
                >
                    <Image
                        src={UserImage}
                        alt="user"
                        className={styles.userImage}
                    />
                    {dropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            <p>{user?.username ?? 'usuario'}</p>
                            <button onClick={() => router.push('/edit-profile')}>Editar Perfil</button>
                            <button onClick={handleLogout}>Logout</button>
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
                    <Cell url='/dashboard' image={DashboardImage} alt="Dashboard" text={'DASHBOARD'}
                          campo={'dashboard'}/>
                    <Cell url='/dashboard/lead' image={DolarImage} alt="Lead" campo={'leads'} text={'LEADS'}/>
                    <Cell url='/dashboard/carteira' image={CarteiraImage} alt="Carteira" campo={'carteira'} text={'CARTEIRA'}/>
                    <Cell url='/dashboard/tarefas' image={TodoImage} alt="Tarefas" campo={'tarefas'} text={'TAREFAS'}/>
                    <Cell url='/dashboard/agenda' image={AgendaImage} alt="Agenda" campo={'agenda'} text={'AGENDA'}/>
                    <Cell url='/dashboard/config' image={ConfigImage} alt="Engrenagem" campo={'config'} text={'CONFIGURAÇÃO'}/>
                </ul>
            </nav>
        </aside>
    );
};

export default DashboardSidebar;
