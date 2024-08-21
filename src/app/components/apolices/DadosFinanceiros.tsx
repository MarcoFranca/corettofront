import React from 'react';
import CustomDropdown from '@/app/components/common/DropDown/CustomDropdown';
import FloatingLabelInput from '@/app/components/common/input/FloatingLabelInput'; // Certifique-se de ajustar o caminho da importação
import styles from './ApoliceForm.module.css';
import {
    PERIODICIDADES,
    FORMAS_PAGAMENTO
} from '@/utils/selects';

interface DadosFinanceirosProps {
    register: any;
    handleDropdownSelect: (name: string, value: string) => void;
}

const DadosFinanceiros: React.FC<DadosFinanceirosProps> = ({ register, handleDropdownSelect }) => (
    <>
            <FloatingLabelInput
                id="premio_pago"
                type="number"
                placeholder="Prêmio Pago"
                register={register}
                required
            />
        <div className={styles.fieldGroup}>
            <CustomDropdown
                options={PERIODICIDADES}
                placeholder="Periodicidade"
                onSelect={(value) => handleDropdownSelect('periodicidade_pagamento', value)}
            />
            <CustomDropdown
                options={FORMAS_PAGAMENTO}
                placeholder="Forma de pagamento"
                onSelect={(value) => handleDropdownSelect('forma_pagamento', value)}
            />
        </div>
    </>
);

export default DadosFinanceiros;
