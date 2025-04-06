"use client";
import React, { useState, useEffect } from "react";
import LeadBoard from "@/app/(pages)/dashboard/(painel_admin)/lead/leadBoard/LeadBoard";
import { ToggleContainer, ToggleButton, LeadButton } from "./LeadPage.styles";
import LeadTable from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/LeadTable";
import CadastroLead from "../../../../../../public/assets/pages/leads/cadastroLead.svg";
import LeadModal from "@/app/components/Modal/LeadModal";

const LeadPage = () => {
    const [viewMode, setViewMode] = useState<string>(() => {
        return typeof window !== "undefined" ? localStorage.getItem("leadViewMode") || "kanban" : "kanban";
    });

    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("leadViewMode", viewMode);
        }
    }, [viewMode]);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <>
            <ToggleContainer>
                <LeadButton src={CadastroLead} alt="Cadastro" onClick={openModal} />

                <ToggleButton  $active={viewMode === "kanban"} onClick={() => setViewMode("kanban")}>
                    Kanban
                </ToggleButton>
                <ToggleButton $active={viewMode === "tabela"} onClick={() => setViewMode("tabela")}>
                    Tabela
                </ToggleButton>
            </ToggleContainer>

            <LeadModal isOpen={modalIsOpen} onRequestClose={closeModal} />

            {viewMode === "kanban" ? <LeadBoard /> : <LeadTable />}
        </>
    );
};

export default LeadPage;
