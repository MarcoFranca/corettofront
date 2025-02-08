import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import {fetchClientes, deleteCliente, fetchClientesSearch} from '@/store/slices/clientesSlice';
import { RootState } from '@/store';
import {
    MdOutlineDelete,
    MdPersonOutline,
    MdMailOutline,
    MdCloudDownload,
    MdCloudUpload,
    MdOutlineSimCardDownload
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

import Link from 'next/link';
import Pagination from '@/app/components/Pagination';
import { Badge, STATUS_DETAILS } from '@/app/components/ui/Badge';
import {
    Container,
    Filters,
    Table,
    Actions, Linked, FileInput, ButtonContain
} from './ClientTable.styles';
import api from "@/app/api/axios";
import {toast} from "react-toastify";
import InputMask from "react-input-mask";
import {getPhoneMask} from "@/utils/maskUtils";
import styles from "@/app/(pages)/dashboard/(painel_admin)/lead/leadBoard/LeadBoard.module.css";
import Button from "@/app/components/ui/Button";
import 'tippy.js/dist/tippy.css';
import {STATUS_CHOICES} from "@/utils/statusOptions";


const ClientesTable: React.FC = () => {
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
        toast.success("Cliente removido com sucesso!");
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
            toast.success("Modelo de importação baixado!");
        } catch (error) {
            toast.error("Erro ao baixar modelo de importação.");
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
            toast.success("Exportação concluída!");
        } catch (error) {
            toast.error("Erro ao exportar clientes.");
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
        try {
            await api.post('/clientes/importar/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success("Importação concluída!");
            dispatch(fetchClientes());
        } catch (error) {
            toast.error("Erro ao importar clientes.");
        }
        setIsProcessing(false);
    };


    return (
        <Container>
            <h2>💼 Carteira de Clientes</h2>
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

            {status === 'loading' && <p>Carregando...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <Table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Sobre Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th>Apolices</th>
                    <th>actions</th>
                </tr>
                </thead>
                <tbody>
                {clientes.length > 0 ? (
                    clientes.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.nome}</td>
                            <td>{cliente.sobre_nome}</td>
                            <td>
                                <Linked href={`mailto:${cliente.email}`} passHref>
                                    <MdMailOutline/> {cliente.email}
                                </Linked>
                            </td>
                            <td>
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

                            </td>
                            <td>
                                <Badge variant="outline" status={cliente.status}>
                                    {STATUS_DETAILS[cliente.status]?.label || cliente.status}
                                </Badge>
                            </td>
                            <td>
                                {cliente.apolices.planos_saude_apolices?.length > 0 && (
                                    <span>📜 {cliente.apolices.planos_saude_apolices.length} Planos de Saúde</span>
                                )}
                                {cliente.apolices.seguros_vida_apolices?.length > 0 && (
                                    <span>🛡 {cliente.apolices.seguros_vida_apolices.length} Seguros de Vida</span>
                                )}
                            </td>
                            <td>
                                <Actions>
                                    <Link href={`/dashboard/cliente/${cliente.id}`} passHref>
                                        <MdPersonOutline size={20}/>
                                    </Link>
                                    <MdOutlineDelete
                                        size={20}
                                        onClick={() => handleDelete(cliente.id)}
                                        className="cursor-pointer text-red-600 hover:text-red-800"
                                    />
                                </Actions>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4}>Nenhum cliente encontrado.</td>
                    </tr>
                )}
                </tbody>
            </Table>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalClientes / itemsPerPage)}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
            />
        </Container>
    );
};

export default ClientesTable;