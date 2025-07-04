import { useState, useEffect, useRef } from "react";
import { useConfirm, sanitizeLeadForCreate } from "@/services/hooks/useConfirm";
import { useLeadBackup } from "@/services/hooks/useLeadBackup";
import { playSound } from "@/store/slices/soundSlice";
import { Cliente, NegociacaoCliente } from "@/types/interfaces";
import {
    deleteCliente,
    updateCliente,
    createCliente,
    fetchClientes,
    fetchClientesNegociacoes,
} from "@/store/slices/clientesSlice";
import { getLeadTableColumns } from "./columns";
import { getFiltroIndicacao } from "./filters";

// Types para handlers (opcional, mas deixa tudo bem forte)
type UseLeadTableProps = {
    dispatch: any;
    clientes: Cliente[];
    negociacoesVistas: Record<string, string>;
    marcarComoVisto: (id: string) => void;
    foiVistoHoje: (id: string) => boolean;
    setInsightCliente: (c: Cliente) => void;
    setInsightDrawerOpen: (v: boolean) => void;
};


function getToday() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function getSeenFromStorage(usuarioId: string) {
    try {
        const data = window.localStorage.getItem(`negociacoesVistas_${usuarioId}`);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}
function saveSeenToStorage(usuarioId: string, visto: Record<string, string>) {
    try {
        window.localStorage.setItem(`negociacoesVistas_${usuarioId}`, JSON.stringify(visto));
    } catch {}
}

export function useNegotiationSeen(usuarioId: string) {
    const [negociacoesVistas, setNegociacoesVistas] = useState<Record<string, string>>(() => getSeenFromStorage(usuarioId));

    useEffect(() => {
        saveSeenToStorage(usuarioId, negociacoesVistas);
    }, [negociacoesVistas, usuarioId]);

    // Marca como visto HOJE
    const marcarComoVisto = (id: string) =>
        setNegociacoesVistas(prev => ({ ...prev, [id]: getToday() }));

    // Checa se foi visto HOJE
    function foiVistoHoje(id: string) {
        return negociacoesVistas[id] === getToday();
    }

    return { negociacoesVistas, marcarComoVisto, foiVistoHoje };
}

export function useLeadTable({
                                 dispatch,
                                 clientes,
                                 negociacoesVistas,
                                 marcarComoVisto,
                                 foiVistoHoje,
                                 setInsightCliente,
                                 setInsightDrawerOpen,
                             }: UseLeadTableProps) {
    const arrClientes: Cliente[] = Array.isArray(clientes)
        ? clientes
        : (clientes && Array.isArray((clientes as any).results))
            ? (clientes as any).results
            : [];    const filtroIndicacao = getFiltroIndicacao(clientes);
    // States principais
    const [filteredLeads, setFilteredLeads] = useState<Cliente[]>([]);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Cliente | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [negociacoesModalVisible, setNegociacoesModalVisible] = useState(false);
    const [negociacoesSelecionadas, setNegociacoesSelecionadas] = useState<NegociacaoCliente[]>([]);
    const [showNegotiationWizard, setShowNegotiationWizard] = useState(false);
    const [showClienteDrawer, setShowClienteDrawer] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

    const { confirm } = useConfirm();
    const { saveBackup, getBackup } = useLeadBackup();

    const prevEditModalOpen = useRef(false);
    useEffect(() => {
        if (prevEditModalOpen.current !== isEditModalOpen) {
            dispatch(playSound(isEditModalOpen ? "openModal" : "closeModal"));
            prevEditModalOpen.current = isEditModalOpen;
        }
    }, [isEditModalOpen, dispatch]);

    const prevScheduleOpen = useRef(false);
    useEffect(() => {
        if (prevScheduleOpen.current !== showScheduleForm) {
            dispatch(playSound(showScheduleForm ? "openModal" : "closeModal"));
            prevScheduleOpen.current = showScheduleForm;
        }
    }, [showScheduleForm, dispatch]);

    // Table height
    const [tableHeight, setTableHeight] = useState(430);
    useEffect(() => {
        const updateHeight = () => {
            const headerOffset = 430;
            setTableHeight(window.innerHeight - headerOffset);
        };
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    // Fetch dos leads
    useEffect(() => {
        dispatch(fetchClientesNegociacoes());
    }, [dispatch]);

    // Filtrar leads por status
    useEffect(() => {
        setFilteredLeads(
            arrClientes.filter(
                (cliente: Cliente) =>
                    ["lead", "negociacao", "nova_negociacao"].includes(cliente.status)
            )
        );
    }, [arrClientes]);

    // Handler para fechar formulário de reunião
    function handleScheduleFormClose() {
        setShowScheduleForm(false);
        if (selectedLead) {
            const updatedLead: Partial<Cliente> = { status_reuniao: "reuniao_marcada" };
            dispatch(updateCliente({ id: selectedLead.id, updatedCliente: updatedLead }));
            dispatch(fetchClientes({ status: "lead,negociacao,nova_negociacao" }));
        }
    }

    // Handler de exclusão com backup
    function handleDelete(id: string) {
        const leadToDelete = filteredLeads.find((lead) => lead.id === id);
        if (leadToDelete) saveBackup(id, leadToDelete);
        confirm({
            title: "Excluir Lead",
            message: "Tem certeza que deseja excluir esse lead?",
            sound: "delete",
            successMessage: "Lead excluído com sucesso!",
            minDuration: 800,
            onConfirm: async () => {
                await dispatch(deleteCliente(id)).unwrap();
            },
            undo: {
                label: "Desfazer",
                onUndo: () => {
                    const raw = getBackup(id);
                    if (!raw) return;
                    const cleaned = sanitizeLeadForCreate(raw);
                    dispatch(createCliente(cleaned));
                },
            },
        });
    }

    function handleOpenNegotiationWizard(lead: Cliente) {
        setSelectedLead(lead);
        setShowNegotiationWizard(true);
    }


    const columns = getLeadTableColumns({
        setSelectedLead,
        setIsEditDrawerOpen,
        setShowNegotiationWizard,
        handleDelete,
        setNegociacoesSelecionadas,
        setNegociacoesModalVisible,
        setShowClienteDrawer,
        filtroIndicacao,
        negociacoesVistas,
        marcarComoVisto,
        foiVistoHoje,
        setInsightCliente,
        setInsightDrawerOpen,
        handleOpenNegotiationWizard // <<< Adicione aqui!
    });

    // Retorne tudo agrupado por contexto
    return {
        // STATES
        filteredLeads,
        showScheduleForm,
        setShowScheduleForm,
        selectedLead,
        setSelectedLead,
        isEditModalOpen,
        setIsEditModalOpen,
        negociacoesModalVisible,
        setNegociacoesModalVisible,
        negociacoesSelecionadas,
        setNegociacoesSelecionadas,
        showNegotiationWizard,
        setShowNegotiationWizard,
        showClienteDrawer,
        setShowClienteDrawer,
        tableHeight,
        columns,
        // HANDLERS
        handleScheduleFormClose,
        handleDelete,

        // FILTROS
        filtroIndicacao,
    };
}
