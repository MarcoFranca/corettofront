import React, { useState } from "react";
import { Cliente } from "@/types/interfaces";
import { useAppDispatch, useAppSelector } from "@/services/hooks/hooks";
import Image from "next/image";
import EditAddressModal from "./EditAddressModal";
import { RootState } from "@/store";
import { updateCliente } from "@/store/slices/clientesSlice";

// ✅ Importando ícones do react-icons
import { FaMapMarkerAlt, FaRegBuilding, FaCity, FaMapSigns, FaMapPin } from "react-icons/fa";

// Importando os estilos do `styled-components`
import {
    CardContainer,
    CardHeader,
    TitleContainer,
    SectionTitle,
    IconButton,
    AddressDetails,
    EmptyMessage,
    AddressField, // ✅ Novo estilo para alinhar ícones e textos
    AddressIcon // ✅ Novo estilo para os ícones
} from "./AddressCard.styles";

// Importando imagens
import AddressImage from "@/../public/assets/pages/profile/Endereco.svg";
import EditImage from "@/../public/assets/common/edit.svg";
import {useModalSoundEffect} from "@/services/hooks/useModalSoundEffect";

interface AddressCardProps {
    cliente: Cliente;
}

const AddressCard: React.FC<AddressCardProps> = ({ cliente }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useAppDispatch();

    // 🔥 Correção: Busca `endereco` corretamente dentro do Redux
    const endereco = useAppSelector(
        (state: RootState) => state.clientes.clienteDetalhe?.relacionamentos?.endereco || cliente.endereco
    );

    useModalSoundEffect(isModalOpen);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSave = async (data: any) => {
        const payload = {
            relacionamentos: { endereco: data },
        };

        console.log("📌 Payload enviado para Redux:", JSON.stringify(payload, null, 2));

        try {
            await dispatch(updateCliente({ id: cliente.id, updatedCliente: payload })).unwrap();
            closeModal();
        } catch (error) {
            console.error("Erro ao atualizar endereço:", error);
        }
    };

    return (
        <CardContainer>
            {/* 🔹 Cabeçalho do Card */}
            <CardHeader>
                <TitleContainer>
                    <Image src={AddressImage} alt="Endereço" width={24} height={24} />
                    <SectionTitle>Endereço</SectionTitle>
                </TitleContainer>
                <IconButton onClick={openModal}>
                    <Image src={EditImage} alt="Editar" width={20} height={20} />
                </IconButton>
            </CardHeader>

            {/* 🔹 Informações de Endereço com Ícones */}
            {endereco ? (
                <AddressDetails>
                    <AddressField>
                        <AddressIcon><FaMapMarkerAlt /></AddressIcon>
                        <p><strong>Logradouro:</strong> {endereco.logradouro || "Não informado"}</p>
                    </AddressField>

                    <AddressField>
                        <AddressIcon><FaRegBuilding /></AddressIcon>
                        <p><strong>Número:</strong> {endereco.numero || "Não informado"} |
                            <strong> Complemento:</strong> {endereco.complemento || "Não informado"}
                        </p>
                    </AddressField>

                    <AddressField>
                        <AddressIcon><FaMapSigns /></AddressIcon>
                        <p><strong>Bairro:</strong> {endereco.bairro || "Não informado"}</p>
                    </AddressField>

                    <AddressField>
                        <AddressIcon><FaCity /></AddressIcon>
                        <p><strong>Cidade:</strong> {endereco.cidade || "Não informada"} -
                            <strong> UF:</strong> {endereco.uf || "Não informado"}
                        </p>
                    </AddressField>

                    <AddressField>
                        <AddressIcon><FaMapPin /></AddressIcon>
                        <p><strong>CEP:</strong> {endereco.cep || "Não informado"}</p>
                    </AddressField>
                </AddressDetails>
            ) : (
                <EmptyMessage>Nenhum endereço cadastrado.</EmptyMessage>
            )}

            {/* 🔹 Modal de Edição */}
            <EditAddressModal
                isOpen={isModalOpen}
                onClose={closeModal}
                cliente={cliente}
                initialData={endereco}
                onSave={handleSave}
            />
        </CardContainer>
    );
};

export default AddressCard;
