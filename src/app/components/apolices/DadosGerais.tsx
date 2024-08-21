import React from 'react';
import CustomDropdown from '@/app/components/common/DropDown/CustomDropdown';
import FloatingLabelInput from '@/app/components/common/input/FloatingLabelInput';
import styles from './ApoliceForm.module.css';
import {
    PRODUTO_ESCOLHIDO,
    SEGURADORAS_SEGURO_VIDA,
    SEGURADORAS_PLANO_SAUDE,
    SEGURADORAS_SEGURO_RESIDENCIAL,
    SEGURADORAS_CONSORCIO,
    SEGURADORAS_INVESTIMENTO,
    SEGURADORAS_OUTROS
} from '@/utils/selects';

interface DadosGeraisProps {
    register: any;
    handleDropdownSelect: (name: string, value: string) => void;
    produto: string; // Recebe o produto selecionado
}

const DadosGerais: React.FC<DadosGeraisProps> = ({ register, handleDropdownSelect, produto }) => {
    // Função para filtrar seguradoras com base no produto selecionado
    const getSeguradorasOptions = () => {
        switch (produto) {
            case 'plano_saude':
                return SEGURADORAS_PLANO_SAUDE;
            case 'seguro_vida':
                return SEGURADORAS_SEGURO_VIDA;
            case 'seguro_residencial':
                return SEGURADORAS_SEGURO_RESIDENCIAL;
            case 'consorcio':
                return SEGURADORAS_CONSORCIO;
            case 'investimento':
                return SEGURADORAS_INVESTIMENTO;
            default:
                return SEGURADORAS_OUTROS;
        }
    };

    return (
        <>
            <div className={styles.fieldGroup}>
                <CustomDropdown
                    options={PRODUTO_ESCOLHIDO}
                    placeholder="Produto"
                    onSelect={(value) => handleDropdownSelect('produto', value)}
                />
                <CustomDropdown
                    options={getSeguradorasOptions()} // Passa as seguradoras filtradas com base no produto selecionado
                    placeholder="Seguradora"
                    onSelect={(value) => handleDropdownSelect('seguradora', value)}
                />

            <FloatingLabelInput
                id="numero_apolice"
                type="text"
                placeholder="Número da Apólice"
                register={register}
                required
            />
            </div>

            <div className={styles.fieldGroup}>
                <FloatingLabelInput
                    id="data_inicio"
                    type="date"
                    placeholder="Data Início"
                    register={register}
                    required
                />
                <FloatingLabelInput
                    id="data_vencimento"
                    type="date"
                    placeholder="Data Vencimento"
                    register={register}
                    required
                />
            </div>
        </>
    );
};

export default DadosGerais;
