import React, { useState } from 'react';
import FloatingLabelInput from '@/app/components/ui/input/FloatingLabelInput';
import CustomDropdown from '@/app/components/common/DropDown/CustomDropdown';
import styles from './Step2Form.module.css'; // Novo arquivo de estilo específico para o Step2

interface Step2Props {
    nextStep?: () => void;
    handleChange: (input: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    formData: {
        custoMensal: string;
        rendaMensal: string;
        trabalho: string;
        nivelConcurso: string; // Adicionado campo para nível do concurso
        localTrabalho: string;
        moradia: string;
        valorMoradia: string;
        custoFilhos: string;
        patrimonio: string;
        dividas: string;
        projetosFuturos: string;
    };
}

const trabalhoOptions = [
    { value: 'clt', label: 'CLT' },
    { value: 'autonomo', label: 'Autônomo' },
    { value: 'concursado', label: 'Concursado' },
    { value: 'temporario', label: 'Temporário' },
    { value: 'desempregado', label: 'Desempregado' },
];

const nivelConcursoOptions = [
    { value: 'estadual', label: 'Estadual' },
    { value: 'municipal', label: 'Municipal' },
    { value: 'federal', label: 'Federal' },
];

const moradiaOptions = [
    { value: 'propria', label: 'Própria' },
    { value: 'financiada', label: 'Financiada' },
    { value: 'alugada', label: 'Alugada' },
    { value: 'nao_tem', label: 'Não Tem' },
];

const Step2: React.FC<Step2Props> = ({ nextStep, handleChange, formData }) => {
    // Estado para controlar a exibição do nível do concurso
    const [showNivelConcurso, setShowNivelConcurso] = useState(formData.trabalho === 'concursado');

    // Função que é chamada quando o tipo de trabalho é alterado
    const handleTrabalhoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        handleChange('trabalho')(e);
        // Mostrar ou esconder o dropdown de nível do concurso baseado no valor selecionado
        setShowNivelConcurso(e.target.value === 'concursado');
    };

    return (
        <div className={styles.formGroup}>
            <h2 className={styles.sectionTitle}>Dados Financeiros</h2>
            <div className={styles.fieldGroup}>
                <FloatingLabelInput
                    id="custoMensal"
                    type="number"
                    placeholder="Custo Mensal"
                    value={formData.custoMensal}
                    onChange={handleChange('custoMensal')}
                    required
                />
                <FloatingLabelInput
                    id="rendaMensal"
                    type="number"
                    placeholder="Renda Mensal"
                    value={formData.rendaMensal}
                    onChange={handleChange('rendaMensal')}
                    required
                />
            </div>
            <div className={styles.fieldGroup}>
                <CustomDropdown
                    options={trabalhoOptions}
                    placeholder="Tipo de Trabalho"
                    onSelect={(value) => handleTrabalhoChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                    initialValue={formData.trabalho}
                />
                <FloatingLabelInput
                    id="localTrabalho"
                    type="text"
                    placeholder="Local de Trabalho"
                    value={formData.localTrabalho}
                    onChange={handleChange('localTrabalho')}
                />
            </div>

            {/* Mostrar o dropdown de nível do concurso apenas se o trabalho for "Concursado" */}
            {showNivelConcurso && (
                <div className={styles.fieldGroup}>
                    <CustomDropdown
                        options={nivelConcursoOptions}
                        placeholder="Nível do Concurso"
                        onSelect={(value) => handleChange('nivelConcurso')({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                        initialValue={formData.nivelConcurso}
                    />
                </div>
            )}

            <div className={styles.fieldGroup}>
                <CustomDropdown
                    options={moradiaOptions}
                    placeholder="Tipo de Moradia"
                    onSelect={(value) => handleChange('moradia')({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                    initialValue={formData.moradia}
                />
                <FloatingLabelInput
                    id="valorMoradia"
                    type="number"
                    placeholder="Valor da Moradia"
                    value={formData.valorMoradia}
                    onChange={handleChange('valorMoradia')}
                />
            </div>
            <div className={styles.fieldGroup}>
                <FloatingLabelInput
                    id="custoFilhos"
                    type="number"
                    placeholder="Custo com Filhos"
                    value={formData.custoFilhos}
                    onChange={handleChange('custoFilhos')}
                />
                <FloatingLabelInput
                    id="patrimonio"
                    type="number"
                    placeholder="Patrimônio"
                    value={formData.patrimonio}
                    onChange={handleChange('patrimonio')}
                />
            </div>
            <div className={styles.fieldGroup}>
                <FloatingLabelInput
                    id="dividas"
                    type="number"
                    placeholder="Dívidas"
                    value={formData.dividas}
                    onChange={handleChange('dividas')}
                />
                <FloatingLabelInput
                    id="projetosFuturos"
                    type="text"
                    placeholder="Projetos Futuros"
                    value={formData.projetosFuturos}
                    onChange={handleChange('projetosFuturos')}
                />
            </div>

            {nextStep && (
                <button className={styles.submitButton} onClick={nextStep}>
                    Próximo
                </button>
            )}
        </div>
    );
};

export default Step2;
