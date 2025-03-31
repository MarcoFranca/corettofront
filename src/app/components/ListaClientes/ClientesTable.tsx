import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/services/hooks/hooks';
import {fetchClientes, deleteCliente, fetchClientesSearch} from '@/store/slices/clientesSlice';
import { RootState } from '@/store';
import { useRouter } from "next/navigation"; // 🔥 Importamos o hook de navegação
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Importa o CSS padrão do Tippy.js

import {
    MdPersonOutline,
    MdMailOutline,
    MdCloudDownload,
    MdCloudUpload,
    MdOutlineSimCardDownload, MdTouchApp
} from 'react-icons/md';
import {FaTrash, FaWhatsapp} from 'react-icons/fa';

import Pagination from '@/app/components/Pagination';
import { Badge, STATUS_DETAILS } from '@/app/components/ui/Badge';
import {
    Filters, Table, DeleteButton, Linked, FileInput, ButtonContain,
    TableContainer, TableRow, TableHeader, TableActions,
    TableData, ViewButton, SpanApolice, TippyContainer
} from './ClientTable.styles';
import api from "@/app/api/axios";
import {toast} from "react-toastify";
import InputMask from "react-input-mask-next";
import {getPhoneMask} from "@/utils/maskUtils";
import styles from "@/app/(pages)/dashboard/(painel_admin)/lead/leadBoard/LeadBoard.module.css";
import Button from "@/app/components/ui/Button";
import 'tippy.js/dist/tippy.css';
import {STATUS_CHOICES} from "@/utils/statusOptions";
import {toastSuccess} from "@/utils/toastWithSound";
import {showToastWithSound} from "@/services/hooks/useToastMessageWithSound";


const ClientesTable: React.FC = () => {
    const router = useRouter(); // ✅ Hook de navegação do Next.js
    const dispatch = useAppDispatch();
    const clientes = useAppSelector((state: RootState) => state.clientes.clientes);
    const totalClientes = useAppSelector((state: RootState) => state.clientes.totalClientes);
    const status = useAppSelector((state: RootState) => state.clientes.status);
    const error = useAppSelector((state: RootState) => state.clientes.error);

    const [filter, setFilter] = useState<string | undefined>();
    const [search, setSearch] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10); // ✅ Agora podemos mudar
    const [isProcessing, setIsProcessing] = useState<boolean>(false); // 🔥 Estado para exibir loader

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 600);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        if (debouncedSearch) {
            dispatch(fetchClientesSearch({ search: debouncedSearch }));
        } else {
            dispatch(fetchClientes({ status: filter, page: currentPage, limit: itemsPerPage }));
        }
    }, [dispatch, debouncedSearch, filter, currentPage, itemsPerPage]);

    const handleDelete = (id: string) => {
        dispatch(deleteCliente(id));
        showToastWithSound({ type: "success", message: "🚀 Cliente removido com sucesso!" });
    };

    const handleDownloadTemplate = async () => {
        setIsProcessing(true);
        try {
            const response = await api.get('/clientes/modelo-importacao/', { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'modelo_importacao_clientes.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            showToastWithSound({ type: "success", message: "🚀 Modelo de importação baixado!" });
        } catch (error) {
            showToastWithSound({ type: "error", message: "❌ Erro ao baixar modelo de importação." });
        }
        setIsProcessing(false);
    };


    const handleExport = async () => {
        setIsProcessing(true);
        try {
            const response = await api.get('/clientes/exportar/', {
                responseType: 'blob',
                headers: { 'Accept': 'text/csv' },
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'clientes.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            showToastWithSound({ type: "success", message: "Exportação concluída! 🎊🍾🎉" });
            toast.success("Exportação concluída!");
        } catch (error) {
            showToastWithSound({ type: "error", message: "❌ Erro ao exportar clientes." });
        }
        setIsProcessing(false);
    };


    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            toast.warn("Selecione um arquivo para importar.");
            return;
        }

        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);

        setIsProcessing(true);
        // 🔥 Mostra loading e guarda o ID do toast para atualização posterior
        const toastId = toast.loading("Importando clientes...");

        try {
            await api.post('/clientes/importar/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.update(toastId, {
                render: "Importação concluída com sucesso!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });            dispatch(fetchClientes());
        } catch (error) {
            toast.update(toastId, {
                render: "Erro ao importar clientes.",
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
        }
        setIsProcessing(false);
    };


    return (
        <>
            <Filters>
                <Button onClick={handleExport} disabled={isProcessing}>
                    <ButtonContain>
                        <MdCloudDownload size={20}/> <p>Exportar Clientes</p>
                    </ButtonContain>
                </Button>
                <FileInput>
                    <input type="file" onChange={handleImport} disabled={isProcessing}/>
                    <ButtonContain>
                        <MdCloudUpload size={20}/> Importar Clientes
                    </ButtonContain>
                </FileInput>
                <Button onClick={handleDownloadTemplate} disabled={isProcessing}>
                    <ButtonContain>
                        <MdOutlineSimCardDownload size={20}/> Baixar Modelo
                    </ButtonContain>
                </Button>
                <select value={filter || ''} onChange={(e) => setFilter(e.target.value || undefined)}>
                    <option value="">Todos</option>
                    {Object.entries(STATUS_CHOICES).map(([value, {label}]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                       placeholder="🔍 Buscar nome..."/>
            </Filters>
            <TableContainer>

                <Table>
                    {status === 'loading' && <p>Carregando...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    <thead>
                    <TableRow>
                        <TableHeader>Nome</TableHeader>
                        <TableHeader>Email</TableHeader>
                        <TableHeader>Telefone</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Apolices</TableHeader>
                        <TableHeader>actions</TableHeader>
                    </TableRow>
                    </thead>
                    <tbody>
                    {clientes.length > 0 ? (
                        clientes.map((cliente) => (
                            <TableRow key={cliente.id}>
                                <TableData>{cliente.nome} {cliente.sobre_nome}</TableData>
                                <TableData>
                                    <Linked href={`mailto:${cliente.email}`} passHref>
                                        <MdMailOutline/> {cliente.email}
                                    </Linked>
                                </TableData>
                                <TableData>
                                    <Linked href={`https://wa.me/+55${cliente.telefone}?text=${cliente.nome}`} passHref
                                            target={'_blank'}>
                                        <FaWhatsapp/> <InputMask
                                        mask={getPhoneMask(cliente.telefone)}
                                        value={cliente.telefone}
                                        readOnly
                                        className={styles.phoneInput} // Estilo personalizado
                                    />
                                    </Linked>
                                    {/* 🔹 Verifica se há contatos adicionais antes de mapear */}
                                    {cliente.relacionamentos?.contatos_adicionais?.length ? (
                                        cliente.relacionamentos.contatos_adicionais.map((contato, index) => (
                                            <Linked key={index} href={`https://wa.me/+55${contato.valor}?text=${cliente.nome}`} passHref target={'_blank'}>
                                                <FaWhatsapp />
                                                <InputMask
                                                    mask={getPhoneMask(contato.valor)}
                                                    value={contato.valor}
                                                    readOnly
                                                    className={styles.phoneInput} // Estilo personalizado
                                                />
                                            </Linked>
                                        ))
                                    ) : (
                                        <p></p> // 🔹 Mensagem caso não haja contatos
                                    )}

                                </TableData>
                                <TableData>
                                    <Badge $variant="outline" $status={cliente.status}>
                                        {STATUS_DETAILS[cliente.status]?.label || cliente.status}
                                    </Badge>
                                </TableData>
                                <TableData>
                                    {cliente.total_apolices? <SpanApolice>📜 {cliente.total_apolices} Apólices</SpanApolice> : (
                                        <SpanApolice>Não tem apólices ativas</SpanApolice>
                                    )}
                                </TableData>
                                <TableActions>
                                    <Tippy
                                        content={
                                                <TippyContainer className={styles.tippyClick}>
                                                    <MdTouchApp size={18}/>
                                                    <p>Perfil do cliente</p>
                                                </TippyContainer>

                                        }
                                        placement="bottom"
                                        theme="custom"
                                        animation="shift-away"
                                        delay={[1000, 200]} // Atraso para exibir e esconder [show, hide]

                                    >
                                    <ViewButton
                                        onClick={() => router.push(`/dashboard/cliente/${cliente.id}`)}
                                    >
                                        <MdPersonOutline />
                                    </ViewButton>
                                    </Tippy>

                                    <DeleteButton onClick={() => handleDelete(cliente.id)}>
                                        <FaTrash />
                                    </DeleteButton>
                                </TableActions>
                            </TableRow>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>Nenhum cliente encontrado.</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </TableContainer>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalClientes / itemsPerPage)}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
            />
        </>
    );
};

export default ClientesTable;