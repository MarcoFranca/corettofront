"use client";
import React, { useState, useEffect } from "react";
import {ToggleContainer, ToggleButton, LeadButton, Contairer} from "./LeadPage.styles";
import LeadTable from "@/app/(pages)/dashboard/(painel_admin)/lead/(leadTable)/LeadTable";
import CadastroLead from "../../../../../../public/assets/pages/leads/cadastroLead.svg";
import LeadDrawer from "@/app/components/Drawer/LeadDrawer"; // ou o caminho correto

const LeadPage = () => {
    const [viewMode, setViewMode] = useState<string>(() => {
        return typeof window !== "undefined" ? localStorage.getItem("leadViewMode") || "kanban" : "table";
    });
    const [reloadLeads, setReloadLeads] = useState(false);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("leadViewMode", viewMode);
        }
    }, [viewMode]);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <Contairer>
            <ToggleContainer>
                <LeadButton src={CadastroLead} alt="Cadastro" onClick={openModal} />

                <ToggleButton $active={viewMode === "kanban"} onClick={() => setViewMode("kanban")}>
                    Kanban <span style={{
                    fontSize: 12,
                    color: "#888",
                    marginLeft: 6,
                    background: "#eee",
                    borderRadius: 8,
                    padding: "0 6px"
                }}>(em breve)</span>
                </ToggleButton>

                <ToggleButton $active={viewMode === "tabela"} onClick={() => setViewMode("tabela")}>
                    Tabela
                </ToggleButton>
            </ToggleContainer>

            <LeadDrawer open={modalIsOpen} onClose={closeModal} onReload={() => setReloadLeads(v => !v)} />

            {viewMode === "kanban"
                ? <div style={{padding: 40, textAlign: "center", color: "#999"}}>
                    <h3>Visualização Kanban em breve!</h3>
                    <p>Estamos preparando uma experiência ainda mais avançada para sua gestão de leads.</p>
                </div>
                : <LeadTable reloadLeads={reloadLeads} />
            }
        </Contairer>
    );
};

export default LeadPage;
