import React from 'react';
import CustomDropdown from '@/app/components/common/DropDown/CustomDropdown';
import FloatingLabelInput from '@/app/components/common/input/FloatingLabelInput';
import styles from './ApoliceForm.module.css';
import { PERIODICIDADES, FORMAS_PAGAMENTO } from '@/utils/selects';
import { formatMoney, removeMoneyMask } from '@/utils/utils';

interface DadosFinanceirosProps {
    register: any;
    handleDropdownSelect: (name: string, value: string) => void;
    setValue: (name: string, value: any) => void;
    watch: (name: string) => any;
}

const DadosFinanceiros: React.FC<DadosFinanceirosProps> = ({ register, handleDropdownSelect, setValue, watch }) => {



    return (
        <>
            <FloatingLabelInput
                id="premio_pago"
                type="text"
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
};

export default DadosFinanceiros;
