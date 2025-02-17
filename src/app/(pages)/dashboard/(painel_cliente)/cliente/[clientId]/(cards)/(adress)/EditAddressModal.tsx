import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import StandardModal from "@/app/components/Modal/StandardModal";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import { toast } from "react-toastify";
import { EditAddressModalProps } from "@/types/interfaces";
import { buscaEnderecoPorCEP } from "@/utils/cep";
import { useAppDispatch } from "@/hooks/hooks";
import { updateCliente } from "@/store/slices/clientesSlice";
import { ModalContainer, FormGroup, Row} from "./EditAddressModal.styles";
import { FaSearch, FaRoad, FaHome, FaMapMarkerAlt, FaCity, FaMap } from "react-icons/fa"; // ✅ Importando os ícones

const EditAddressModal: React.FC<EditAddressModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               cliente,
                                                               initialData,
                                                           }) => {
    const dispatch = useAppDispatch();
    const methods = useForm({
        defaultValues: initialData || {},
    });

    const { control, handleSubmit, setValue, watch, register, reset } = methods;
    const [lastCep, setLastCep] = useState(""); // ✅ Armazena o último CEP pesquisado
    const [cepTimeout, setCepTimeout] = useState<NodeJS.Timeout | null>(null);

    // Observa mudanças no campo CEP
    const cepValue = watch("cep");

    // 🔥 Busca automática pelo CEP com debounce
    useEffect(() => {
        if (!cepValue || cepValue.length !== 9 || cepValue === lastCep) return; // ✅ Evita buscas desnecessárias

        if (cepTimeout) clearTimeout(cepTimeout); // 🔥 Cancela requisição anterior

        setCepTimeout(
            setTimeout(() => {
                buscaEnderecoPorCEP(cepValue)
                    .then((endereco) => {
                        setValue("logradouro", endereco.logradouro || "");
                        setValue("bairro", endereco.bairro || "");
                        setValue("cidade", endereco.localidade || "");
                        setValue("uf", endereco.uf || "");
                        setLastCep(cepValue); // ✅ Atualiza o último CEP pesquisado
                    })
                    .catch(() => toast.error("CEP não encontrado."));
            }, 700) // 🔥 Aguarda 700ms antes de buscar
        );
    }, [cepValue, setValue, lastCep]);

    // 🔥 Preenche os valores iniciais ao abrir o modal
    useEffect(() => {
        if (isOpen && initialData) {
            reset(initialData);
            setLastCep(initialData.cep || ""); // ✅ Garante que o CEP inicial não dispara nova busca
        }
    }, [isOpen, initialData, reset]);

    const onSubmit = async (data: any) => {
        console.log("📌 Dados do formulário antes do envio:", JSON.stringify(data, null, 2));

        const enderecoPayload = {
            id: cliente.endereco?.id || null,  // ✅ Garante que o ID seja enviado se o endereço já existir
            logradouro: data.logradouro || null,
            numero: data.numero || null,
            complemento: data.complemento || null,
            bairro: data.bairro || null,
            cidade: data.cidade || null,
            uf: data.uf || null,
            cep: data.cep || null,
        };

        // 🔥 Remove valores nulos antes do envio
        const enderecoFormatado = Object.fromEntries(
            Object.entries(enderecoPayload).filter(([_, v]) => v !== null)
        );

        const payload = {
            relacionamentos: { endereco: enderecoFormatado },
        };

        console.log("📌 Payload enviado para Redux:", JSON.stringify(payload, null, 2));

        try {
            await dispatch(updateCliente({ id: cliente.id, updatedCliente: payload })).unwrap();
            toast.success("🏠 Endereço atualizado com sucesso!");
            onClose();
        } catch (error) {
            console.error("Erro ao atualizar endereço:", error);
            toast.error("❌ Erro ao atualizar endereço. Tente novamente.");
        }
    };

    return (
        <StandardModal
            isOpen={isOpen}
            onRequestClose={onClose}
            title="Editar Endereço"
            onSubmit={handleSubmit(onSubmit)}
            buttonText="Salvar Endereço"
            methods={methods}
        >
            <ModalContainer>
                {/* CEP */}
                <FormGroup>
                    <FloatingMaskedInput
                        label="CEP"
                        name="cep"
                        type="text"
                        mask="99999-999"
                        control={control}
                        setValue={setValue}
                        register={register}
                        required
                    />
                    <FaSearch />
                </FormGroup>

                <FormGroup>
                    <FloatingMaskedInput
                        name="logradouro"
                        label="Logradouro"
                        control={control}
                        setValue={setValue}
                        register={register}
                        required
                    />
                    <FaRoad />
                </FormGroup>

                <Row>
                    <FormGroup>
                        <FloatingMaskedInput
                            name="numero"
                            label="Número"
                            control={control}
                            setValue={setValue}
                            register={register}
                            required
                        />
                        <FaHome />
                    </FormGroup>
                    <FormGroup>
                        <FloatingMaskedInput
                            name="complemento"
                            label="Complemento"
                            control={control}
                            setValue={setValue}
                            register={register}
                        />
                    </FormGroup>
                </Row>

                <Row>
                    <FormGroup>
                        <FloatingMaskedInput
                            name="bairro"
                            label="Bairro"
                            control={control}
                            setValue={setValue}
                            register={register}
                            required
                        />
                        <FaMapMarkerAlt />
                    </FormGroup>
                    <FormGroup>
                        <FloatingMaskedInput
                            name="cidade"
                            label="Cidade"
                            control={control}
                            setValue={setValue}
                            register={register}
                            required
                        />
                        <FaCity />
                    </FormGroup>
                </Row>

                <FormGroup>
                    <FloatingMaskedInput
                        name="uf"
                        label="UF"
                        control={control}
                        setValue={setValue}
                        register={register}
                        required
                    />
                    <FaMap />
                </FormGroup>
            </ModalContainer>
        </StandardModal>
    );
};

export default EditAddressModal;
