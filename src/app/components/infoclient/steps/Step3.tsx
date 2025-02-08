import React, { useState } from 'react';
import FloatingLabelInput from '@/app/components/ui/input/FloatingLabelInput';
import styles from './Step3Form.module.css';

interface Step3Props {
    nextStep?: () => void;
    handleChange: (input: string, value: string | boolean) => void;
    formData: {
        peso: string;
        altura: string;
        temDoencaPreexistente: boolean;
        doencaPreexistente: string;
        temHistoricoFamiliarDoencas: boolean;
        historicoFamiliarDoencas: string;
    };
}

const Step3: React.FC<Step3Props> = ({ nextStep, handleChange, formData }) => {
    const [temDoencaPreexistente, setTemDoencaPreexistente] = useState(formData.temDoencaPreexistente);
    const [temHistoricoFamiliarDoencas, setTemHistoricoFamiliarDoencas] = useState(formData.temHistoricoFamiliarDoencas);

    const handleCheckboxChange = (field: string, setField: React.Dispatch<React.SetStateAction<boolean>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setField(isChecked);
        handleChange(field, isChecked);
    };

    return (
        <div className={styles.formGroup}>
            <h2 className={styles.sectionTitle}>Saúde do Cliente</h2>
            <div className={styles.fieldGroup}>
                <FloatingLabelInput
                    id="peso"
                    type="number"
                    placeholder="Peso (kg)"
                    value={formData.peso}
                    onChange={(e) => handleChange('peso', e.target.value)}
                    required
                />
                <FloatingLabelInput
                    id="altura"
                    type="number"
                    placeholder="Altura (m)"
                    value={formData.altura}
                    onChange={(e) => handleChange('altura', e.target.value)}
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={temDoencaPreexistente}
                        onChange={handleCheckboxChange('temDoencaPreexistente', setTemDoencaPreexistente)}
                    />
                    Tem Doença Preexistente?
                </label>
            </div>

            {temDoencaPreexistente && (
                <div className={styles.fieldGroup}>
                    <textarea
                        id="doencaPreexistente"
                        placeholder="Descreva a Doença Preexistente"
                        value={formData.doencaPreexistente}
                        onChange={(e) => handleChange('doencaPreexistente', e.target.value)}
                        className={styles.textarea}
                    />
                </div>
            )}

            <div className={styles.fieldGroup}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={temHistoricoFamiliarDoencas}
                        onChange={handleCheckboxChange('temHistoricoFamiliarDoencas', setTemHistoricoFamiliarDoencas)}
                    />
                    Tem Histórico Familiar de Doenças?
                </label>
            </div>

            {temHistoricoFamiliarDoencas && (
                <div className={styles.fieldGroup}>
                    <textarea
                        id="historicoFamiliarDoencas"
                        placeholder="Descreva o Histórico Familiar de Doenças"
                        value={formData.historicoFamiliarDoencas}
                        onChange={(e) => handleChange('historicoFamiliarDoencas', e.target.value)}
                        className={styles.textarea}
                    />
                </div>
            )}

            {nextStep && (
                <button className={styles.submitButton} onClick={nextStep}>
                    Próximo
                </button>
            )}
        </div>
    );
};

export default Step3;
