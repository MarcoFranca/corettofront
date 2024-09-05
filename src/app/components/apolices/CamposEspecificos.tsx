import React from 'react';
import CustomDropdown from '@/app/components/common/DropDown/CustomDropdown';
import FloatingLabelInput from '@/app/components/common/input/FloatingLabelInput'; // Certifique-se de ajustar o caminho
import styles from './ApoliceForm.module.css';
import {
    TRIBUTACAO_ESCOLHIDA,
    CONTRATACAO_ESCOLHIDO,
    CATEGORIA_ESCOLHIDA,
    ACOMODACAO_ESCOLHIDA,
    ABRANGENCIA_ESCOLHIDA
} from '@/utils/selects';

interface CamposEspecificosProps {
    produto: string;
    register: any;
    handleDropdownSelect: (name: string, value: string) => void;
    initialValues: {
        observacoes: string ;
        valorInvestido: string ;
        valorCarta: string ;
        fundo: string ;
        nomeFundo: string ;
        valorAcumulado: string ;
        capitalSegurado: string ;
        beneficiario: string ;
        subcategoria: string;
        produto:string;
        acomodacao: string;
        abrangencia: string;
        tributacao:string;
        contratacao:string;
        categoria:string;
        valorReembolso:string;
        franquia:string;

    }
}

const CamposEspecificos: React.FC<CamposEspecificosProps> = ({ produto, register, handleDropdownSelect, initialValues }) => {
    switch (produto) {
        case 'plano_saude':
            return (
                <>
                    <div className={styles.fieldGroup}>
                        <FloatingLabelInput
                            id="categoria"
                            type="text"
                            placeholder="Categoria"
                            register={register}
                            required
                            defaultValue={initialValues.categoria}
                        />
                        <CustomDropdown
                            options={ACOMODACAO_ESCOLHIDA}
                            placeholder="Acomodação"
                            onSelect={(value) => handleDropdownSelect('acomodacao', value)}
                            initialValue={initialValues.acomodacao}  // Passando o valor inicial
                        />
                        <CustomDropdown
                            options={ABRANGENCIA_ESCOLHIDA}
                            placeholder="Abrangência"
                            onSelect={(value) => handleDropdownSelect('abrangencia', value)}
                            initialValue={initialValues.abrangencia}  // Passando o valor inicial

                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <FloatingLabelInput
                            id="valor_reembolso_consulta"
                            type="number"
                            placeholder="Valor Reembolso Consulta"
                            register={register}
                            required
                            defaultValue={initialValues.valorReembolso}
                        />
                        <div className={`${styles.field} ${styles.halfWidth}`}>
                            <label className={styles.field}>Coparticipação
                                <input type="checkbox" {...register('coparticipacao')} />
                            </label>
                        </div>
                    </div>
                </>
            );
        case 'seguro_vida':
            return (
                <div className={styles.fieldGroup}>
                    <FloatingLabelInput
                        id="subcategoria"
                        type="text"
                        placeholder="Subcategoria"
                        register={register}
                        required
                        defaultValue={initialValues.subcategoria}

                    />
                    <FloatingLabelInput
                        id="beneficiario"
                        type="text"
                        placeholder="Beneficiário"
                        register={register}
                        required
                        defaultValue={initialValues.beneficiario}

                    />
                    <FloatingLabelInput
                        id="capital_segurado"
                        type="number"
                        placeholder="Capital Segurado"
                        register={register}
                        required
                        defaultValue={initialValues.capitalSegurado}

                    />
                </div>
            );
        case 'previdencia':
            return (
                <>
                    <div className={styles.fieldGroup}>
                        <FloatingLabelInput
                            id="valor_acumulado"
                            type="number"
                            placeholder="Valor Acumulado"
                            register={register}
                            required
                            defaultValue={initialValues.valorAcumulado}
                        />
                        <FloatingLabelInput
                            id="nome_fundo"
                            type="text"
                            placeholder="Nome do Fundo"
                            register={register}
                            required
                            defaultValue={initialValues.nomeFundo}

                        />
                        <FloatingLabelInput
                            id="fundo"
                            type="text"
                            placeholder="Fundo"
                            register={register}
                            required
                            defaultValue={initialValues.fundo}

                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <CustomDropdown
                            options={TRIBUTACAO_ESCOLHIDA}
                            placeholder="Regime de Tributação"
                            onSelect={(value) => handleDropdownSelect('regime_tributacao', value)}
                            initialValue={initialValues.tributacao}  // Passando o valor inicial

                        />
                        <CustomDropdown
                            options={CONTRATACAO_ESCOLHIDO}
                            placeholder="Regime de Contratação"
                            onSelect={(value) => handleDropdownSelect('regime_contratacao', value)}
                            initialValue={initialValues.contratacao}  // Passando o valor inicial

                        />
                    </div>
                </>
            );
        case 'consorcio':
            return (
                <div className={styles.fieldGroup}>
                    <FloatingLabelInput
                        id="valor_carta"
                        type="number"
                        placeholder="Valor Carta"
                        register={register}
                        required
                        defaultValue={initialValues.valorCarta}

                    />
                    <CustomDropdown
                        options={CATEGORIA_ESCOLHIDA}
                        placeholder="Categoria"
                        onSelect={(value) => handleDropdownSelect('categoria', value)}
                        initialValue={initialValues.categoria}  // Passando o valor inicial
                    />
                </div>
            );
        case 'investimento':
            return (
                <div className={styles.fieldGroup}>
                    <FloatingLabelInput
                        id="valor_investido"
                        type="number"
                        placeholder="Valor Investido"
                        register={register}
                        required
                        defaultValue={initialValues.valorInvestido}

                    />
                    <FloatingLabelInput
                        id="observacoes"
                        type="text"
                        placeholder="Observações"
                        register={register}
                        defaultValue={initialValues.observacoes}

                    />
                </div>
            );
        case 'seguro_profissional':
            return (
                <div className={styles.fieldGroup}>
                    <FloatingLabelInput
                        id="franquia"
                        type="number"
                        placeholder="Franquia"
                        register={register}
                        required
                        defaultValue={initialValues.franquia}
                    />
                </div>
            );
        case 'seguro_residencial':
            return (
                <div className={styles.fieldGroup}>
                    <FloatingLabelInput
                        id="franquia"
                        type="number"
                        placeholder="Franquia"
                        register={register}
                        required
                        defaultValue={initialValues.franquia}
                    />
                </div>
            );
        default:
            return null;
    }
};

export default CamposEspecificos;
