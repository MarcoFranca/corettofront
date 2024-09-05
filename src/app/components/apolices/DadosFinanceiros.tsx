import React, { useEffect } from 'react';
import CustomDropdown from '@/app/components/common/DropDown/CustomDropdown';
import FloatingLabelInput from '@/app/components/common/input/FloatingLabelInput';
import styles from './ApoliceForm.module.css';
import { PERIODICIDADES, FORMAS_PAGAMENTO } from '@/utils/selects';

interface DadosFinanceirosProps {
    register: any;
    handleDropdownSelect: (name: string, value: string) => void;
    setValue: (name: string, value: any) => void;
    watch: (name: string) => any;
    initialValues: { premio_pago: string; periodicidade_pagamento: string; forma_pagamento: string }; // Adicionando initialValues
}

const DadosFinanceiros: React.FC<DadosFinanceirosProps> = ({ register, handleDropdownSelect, setValue, watch, initialValues }) => {

    useEffect(() => {
        if (initialValues?.periodicidade_pagamento) {
            setValue('periodicidade_pagamento', initialValues.periodicidade_pagamento);
        }
        if (initialValues?.forma_pagamento) {
            setValue('forma_pagamento', initialValues.forma_pagamento);
        }
    }, [initialValues, setValue]);


    return (
        <>
            <FloatingLabelInput
                id="premio_pago"
                type="text"
                placeholder="Prêmio Pago"
                register={register}
                required
                defaultValue={initialValues.premio_pago}  // Definir valor inicial
            />
            <div className={styles.fieldGroup}>
                <CustomDropdown
                    options={PERIODICIDADES}
                    placeholder="Periodicidade"
                    onSelect={(value) => handleDropdownSelect('periodicidade_pagamento', value)}
                    initialValue={initialValues.periodicidade_pagamento}  // Definir valor inicial
                />
                <CustomDropdown
                    options={FORMAS_PAGAMENTO}
                    placeholder="Forma de pagamento"
                    onSelect={(value) => handleDropdownSelect('forma_pagamento', value)}
                    initialValue={initialValues.forma_pagamento}  // Definir valor inicial
                />
            </div>
        </>
    );
};

export default DadosFinanceiros;
