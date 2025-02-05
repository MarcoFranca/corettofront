import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import {fetchClientes, deleteCliente, fetchClientesSearch} from '@/store/slices/clientesSlice';
import { RootState } from '@/store';
import { MdOutlineDelete, MdPersonOutline, MdMailOutline } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

import Link from 'next/link';
import { formatPhoneNumber } from '@/utils/utils';
import Pagination from '@/app/components/Pagination';
import Badge from '@/app/components/ui/Badge';
import {
    Container,
    Filters,
    Table,
    Actions, Linked
} from './ClientTable.styles';
import api from "@/app/api/axios";
import {toast} from "react-toastify";

const STATUS_CHOICES = {
    lead: { label: 'Lead', color: 'blue' },
    negociacao: { label: 'Em Negociação', color: 'orange' },
    ativo: { label: 'Ativo', color: 'green' },
    nova_negociacao: { label: 'Nova Negociação', color: 'purple' },
    inativo: { label: 'Inativo', color: 'gray' },
    recusado: { label: 'Recusado', color: 'red' },
    reativacao_pendente: { label: 'Reativação Pendente', color: 'yellow' },
    cancelado: { label: 'Cancelado', color: 'black' },
};

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
    const [isSearching, setIsSearching] = useState(false); // 🔹 Novo estado para controle

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 600);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        console.log(`📢 Buscando clientes na página ${currentPage} com limite ${itemsPerPage}`);

        if (debouncedSearch) {
            console.log("🔍 Modo de busca ativado...");
            setIsSearching(true); // ✅ Ativa modo de busca
            dispatch(fetchClientesSearch({ search: debouncedSearch }));
        } else {
            console.log("📄 Voltando para listagem normal...");
            setIsSearching(false); // ✅ Sai do modo de busca
            dispatch(fetchClientes({ status: filter, page: currentPage, limit: itemsPerPage }));
        }
    }, [dispatch, debouncedSearch, filter, currentPage, itemsPerPage]);


    const handleDelete = (id: string) => {
        dispatch(deleteCliente(id));
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await api.get('/clientes/modelo-importacao/', {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'modelo_importacao_clientes.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao baixar modelo de importação:', error);
        }
    };


    const handleExport = async () => {
        try {
            const response = await api.get('/clientes/exportar/', {
                responseType: 'blob', // Importante para baixar arquivos
                headers: {
                    'Accept': 'text/csv',
                },
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'clientes.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erro ao exportar clientes:', error);
        }
    };


    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files; // Verifica se há arquivos

        if (!files || files.length === 0) {
            toast.warn("Por favor, selecione um arquivo para importar.");
            return;
        }

        const file = files[0]; // Pega o primeiro arquivo

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/clientes/importar/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success("Importação concluída com sucesso!");
                dispatch(fetchClientes()); // Atualiza a lista de clientes automaticamente
            } else {
                toast.error("Erro ao importar clientes. Verifique o arquivo e tente novamente.");
            }
        } catch (error) {
            console.error('Erro ao importar clientes:', error);
            toast.error("Erro ao importar clientes. Verifique se o arquivo está correto.");
        }
    };


    return (
        <Container>
            <h2>Carteira de Clientes</h2>
            <Filters>
                <button onClick={handleExport}>Exportar Clientes</button>
                <input type="file" onChange={handleImport}/>
                <button onClick={handleDownloadTemplate}>Baixar Modelo de Importação</button>


                <select
                    value={filter || ''}
                    onChange={(e) => setFilter(e.target.value || undefined)} // Atualiza o filtro
                >
                    <option value="">Todos</option>
                    {Object.entries(STATUS_CHOICES).map(([value, {label}]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nome..."
                    className="border rounded p-2"
                />
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
                                <FaWhatsapp/> {formatPhoneNumber(cliente.telefone)}
                            </Linked>
                        </td>
                        <td>
                            <Badge
                                variant="outline"
                                status={cliente.status} // Passa o status do cliente para o Badge
                            >
                                {cliente.status}
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
