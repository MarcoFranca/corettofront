// 📂 tipoApolices/Consorcio.tsx
import React, {useState} from 'react';
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import {formatMoney, removeMoneyMask} from "@/utils/utils";
import {
    ConsorcioGrid, Input, OptionalSection, PaymentSection, SectionTitle
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/Consorcio.styles";
import SelectCustom from "@/app/components/ui/select/SelectCustom";
import TextArea from "antd/es/input/TextArea";
import {CheckboxGroup} from "@/app/components/Modal/agenda/CreateEventModal.styles";
import {Checkbox} from "antd";
import CheckboxOptions
    from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(tipoApolices)/CheckboxOptions";
import {Controller} from "react-hook-form";

interface ConsorcioProps {
    control: any;
    setValue: any;
    register: any;
}

// 🧩 Tipo do Retorno do Hook
interface MoneyInputHook {
    displayValue: string;
    handleChange: (rawValue: string) => void;
}

// 🟡 Opções
const indiceCorrecaoOptions = [
    { value: "INCC", label: "INCC" },
    { value: "IPCA", label: "IPCA" },
    { value: "INCC-IPCA", label: "INCC ou IPCA" },
];

const pagamentoOptions = [
    { value: "cartao", label: "Cartão" },
    { value: "debito_conta", label: "Débito em Conta" },
    { value: "boleto", label: "Boleto" },
    { value: "pix", label: "Pix" },
    { value: "outros", label: "Outros" },
];

const useMoneyInput = (setValue: any, fieldName: string): MoneyInputHook => {
    const [displayValue, setDisplayValue] = useState("");

    const handleChange = (rawValue: string) => {
        // const numericValue = removeMoneyMask(rawValue);
        setDisplayValue(formatMoney(rawValue)); // Exibe formatado
        setValue(fieldName, rawValue, { shouldValidate: true }); // Salva puro
    };

    return { displayValue, handleChange };
};


const Consorcio: React.FC<ConsorcioProps> = ({ control, setValue, register }) => {
    const valorCota = useMoneyInput(setValue, "detalhes.valorCota");
    const valorParcela = useMoneyInput(setValue, "detalhes.valorParcela");
    const valorFinalCarta = useMoneyInput(setValue, "detalhes.valorFinalCarta");

    return (
        <>
            {/* Campos Obrigatórios */}

            <SectionTitle>🚀 Dados Principais</SectionTitle>
            <ConsorcioGrid>

                <Input
                    control={control}
                    setValue={setValue}
                    register={register}
                    name="detalhes.grupo"
                    label="🏢 Número do Grupo"
                    required
                />
                <Input
                    control={control}
                    setValue={setValue}
                    register={register}
                    name="detalhes.cota"
                    label="🔢 Número da Cota"
                    required
                />
                <Input
                    control={control}
                    setValue={setValue}
                    register={register}
                    name="detalhes.prazo"
                    label="🗓️ Prazo (meses)"
                    type="number"
                    required
                />
                <SelectCustom
                    control={control}
                    name="detalhes.indiceCorrecao"
                    label="📊 Índice de Correção"
                    options={indiceCorrecaoOptions}
                    required
                />
                {/* 📝 Campos de Texto */}
                <div>
                    <label>🎯 Objetivo do Consórcio *</label>
                    <Controller
                        name="detalhes.objetivo"
                        control={control}
                        render={({field}) => (
                            <TextArea {...field} placeholder="Descreva o objetivo (Ex: Comprar imóvel, carro...)"/>
                        )}
                    />
                </div>
            </ConsorcioGrid>

            <PaymentSection>
            <SectionTitle>💳 Informações de Pagamento</SectionTitle>

                <ConsorcioGrid>
                    {/* 💳 Forma de Pagamento */}
                    <Input
                        control={control}
                        setValue={setValue}
                        register={register}
                        name="detalhes.premioPago"
                        label="💎 Prêmio Pago (Valor da Carta)"
                        type="money"
                        required
                    />
                    <SelectCustom
                        control={control}
                        name="detalhes.formaPagamento"
                        label="💰 Forma de Pagamento"
                        options={pagamentoOptions}
                        required
                    />

                    <Input
                        control={control}
                        setValue={setValue}
                        register={register}
                        name="detalhes.valorParcela"
                        label="💳 Valor da Parcela Mensal"
                        type="money"
                        required
                    />
                </ConsorcioGrid>
            </PaymentSection>


            <OptionalSection>
                <SectionTitle>💡 Informações Adicionais (Opcional)</SectionTitle>
                <ConsorcioGrid>
                    <Input
                        control={control}
                        setValue={setValue}
                        register={register}
                        name="detalhes.furo"
                        label="🚪 Ordem de Prioridade (Furo)"
                        type="number"
                    />
                    <Input
                        control={control}
                        setValue={setValue}
                        register={register}
                        name="detalhes.percentualReducaoParcela"
                        label="📉 Percentual de Redução"
                        type="number"
                    />
                    <div>
                    <label>📝 Estratégia</label>
                    <Controller
                        name="detalhes.estrategia"
                        control={control}
                        render={({field}) => (
                            <TextArea {...field} placeholder="Descreva sua estratégia de lance"/>
                        )}
                    />

                    </div>

                    {/* 🔒 Permissões de Lances */}
                    <CheckboxGroup>
                        <CheckboxGroup>
                            <CheckboxOptions control={control}/>
                        </CheckboxGroup>
                    </CheckboxGroup>
                </ConsorcioGrid>

            </OptionalSection>

        </>
    );
};

export default Consorcio;
