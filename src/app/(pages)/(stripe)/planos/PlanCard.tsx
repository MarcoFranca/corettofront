'use client';
import { FaCheckCircle } from 'react-icons/fa';
import {
    Card,
    Tag,
    Title,
    Button,
    Price,
    BenefitList,
    BenefitItem,
    Description
} from "@/app/(pages)/(stripe)/planos/PlanCard.styles";

interface PlanCardProps {
    nome: string;
    descricao: string;
    preco: string;
    beneficios: string[];
    onSelect: () => void;
    destaque?: boolean;
    modoTroca?: boolean;
    ocultarBotao?: boolean;
    tipoAcao?: 'plano-atual' | 'upgrade' | 'downgrade' | 'cancelar-downgrade' | 'escolher-plano';
}

export default function PlanCard({
                                     nome,
                                     descricao,
                                     preco,
                                     beneficios,
                                     onSelect,
                                     destaque = false,
                                     tipoAcao,
                                 }: PlanCardProps) {
    return (
        <Card $destaque={destaque}>
            {destaque && <Tag>Plano Recomendado</Tag>}
            <Title>{nome}</Title>
            <Description>{descricao}</Description>
            <Price>R$ {preco}/mês</Price>
            <BenefitList>
                {beneficios.map((b, i) => (
                    <BenefitItem key={i}>
                        <FaCheckCircle size={16}/>
                        {b}
                    </BenefitItem>
                ))}
            </BenefitList>
            <p style={{
                fontSize: '0.85rem',
                textAlign: 'center',
                color: '#888',
                marginTop: '8px'
            }}>
                * Você pode cancelar a qualquer momento
            </p>
            {tipoAcao === 'plano-atual' ? (
                <Button disabled style={{ background: '#ccc', cursor: 'default' }}>
                    Plano Atual
                </Button>
            ) : (
                <Button onClick={onSelect}>
                    {tipoAcao === 'cancelar-downgrade'
                        ? 'Cancelar Downgrade'
                        : tipoAcao === 'upgrade'
                            ? 'Upgrade para este plano'
                            : tipoAcao === 'downgrade'
                                ? 'Agendar Downgrade'
                                : 'Escolher Plano'}
                </Button>
            )}
        </Card>
    );
}
