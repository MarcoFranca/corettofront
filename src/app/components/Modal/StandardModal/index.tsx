import React, {useEffect} from "react";
import Modal from "@/app/components/Modal/simpleModal";
import { toast } from "react-toastify";
import {FormProvider, UseFormReturn} from "react-hook-form";
import Button from "@/app/components/ui/Button";
import { IoSyncOutline } from "react-icons/io5";
import { ModalContainer, Form, InputGroup, ModalActions, FullWidthButton } from "./StandardModal.styles";

interface StandardModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    title: string;
    onSubmit: (data: any) => Promise<void>;
    children: React.ReactNode;
    buttonText?: string;
    buttonIcon?: React.ReactNode;
    successMessage?: string;
    errorMessage?: string;
    disableToast?: boolean; // ✅ Nova prop para desativar toasts
    methods: UseFormReturn<any>; // ✅ Agora `methods` é reconhecido corretamente
    textLoading?: string;
    toastMessage?: { type: "success" | "error"; message: string } | null; // ✅ Novo prop para o toast
}

const StandardModal: React.FC<StandardModalProps> =
    ({
         isOpen,
         onRequestClose,
         title,
         onSubmit,
         children,
         buttonText = "Atualizar",
         buttonIcon = <IoSyncOutline />,
         successMessage = "✅ Alterações salvas com sucesso!",
         errorMessage = "❌ Erro ao salvar alterações. Tente novamente.",
         textLoading= "salvando...",
         toastMessage,
         disableToast = false, // ✅ Padrão: toasts ativados
         methods // ✅ Agora o `methods` vem do componente pai
     }) => {

        const { handleSubmit, formState: { isSubmitting, isValid } } = methods;

        useEffect(() => {
            if (!disableToast && toastMessage) { // ✅ Só exibe se `disableToast` for `false`
                if (toastMessage.type === "success") {
                    toast.success(toastMessage.message);
                } else if (toastMessage.type === "error") {
                    toast.error(toastMessage.message);
                }
            }
        }, [toastMessage, disableToast]); // ✅ Agora depende também de `disableToast`

        useEffect(() => {
            console.log("Registered Fields:", Object.keys(methods.getValues()));
            console.log("Form Values:", methods.watch());
            console.log("isValid:", methods.formState.isValid);
        }, [methods.formState]); // ✅ Agora atualiza corretamente sempre que `isValid` mudar




        const handleFormSubmit = async (data: any) => {
            try {
                console.log("Simulando envio...");
                await new Promise((resolve) => setTimeout(resolve,  2000)); // 🔥 Delay de 2 segundos
                console.log("Envio concluído!");

                await onSubmit(data);

                // ✅ Só exibe o toast padrão se o `toastMessage` não for definido no LeadModal
                if (!toastMessage) {
                    toast.success(successMessage);
                }
                onRequestClose();
            } catch (error) {
                toast.error(errorMessage);
            }
        };


        return (
            <Modal show={isOpen} onClose={onRequestClose} title={title}>
                <FormProvider {...methods}>
                    <ModalContainer>
                        <Form onSubmit={handleSubmit(handleFormSubmit)}>
                            <InputGroup>{children}</InputGroup>
                            <ModalActions>
                                <FullWidthButton
                                    as={Button}
                                    type="submit"
                                    variant="primary"
                                    icon={buttonIcon}
                                    isLoading={isSubmitting} // ✅ Agora o ícone muda automaticamente para spinner!
                                    disabled={!isValid || isSubmitting}
                                    textLoading={textLoading}
                                >
                                    {isSubmitting ? "Salvando..." : buttonText}
                                </FullWidthButton>
                            </ModalActions>
                        </Form>
                    </ModalContainer>
                </FormProvider>
            </Modal>
        );
    };

export default StandardModal;
