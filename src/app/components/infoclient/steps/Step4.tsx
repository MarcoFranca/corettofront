import React from 'react';
import styles from './Step4Form.module.css';

interface Step4Props {
    prevStep?: () => void;
    handleSubmit: () => void;
    formData: {
        nome: string;
        sobreNome: string;
        telefone: string;
        email: string;
        data_nascimento: string;
        profissao: string;
        estadoCivil: string;
        nomeConjuge?: string;
        dataNascimentoConjuge?: string;
        profissaoConjuge?: string;
        filhos: { nome: string; data_nascimento: string }[];
        custoMensal: string;
        rendaMensal: string;
        trabalho: string;
        localTrabalho: string;
        moradia: string;
        valorMoradia: string;
        custoFilhos: string;
        patrimonio: string;
        dividas: string;
        projetosFuturos: string;
        peso: string;
        altura: string;
        temDoencaPreexistente: boolean;
        doencaPreexistente: string;
        temHistoricoFamiliarDoencas: boolean;
        historicoFamiliarDoencas: string;
    };
}

const Step4: React.FC<Step4Props> = ({ prevStep, handleSubmit, formData }) => {
    const renderFilhos = () => {
        return formData.filhos.map((filho, index) => (
            <div key={index} className={styles.dataItem}>
                <strong>Filho {index + 1}:</strong> {filho.nome}, {filho.data_nascimento}
            </div>
        ));
    };

    return (
        <div className={styles.reviewContainer}>
            <h2 className={styles.sectionTitle}>Revisão Final</h2>

            {/* Dados do Cliente */}
            <div className={styles.section}>
                <h3>Dados do Cliente</h3>
                <div className={styles.dataItem}><strong>Nome:</strong> {formData.nome} {formData.sobreNome}</div>
                <div className={styles.dataItem}><strong>Telefone:</strong> {formData.telefone}</div>
                <div className={styles.dataItem}><strong>Email:</strong> {formData.email}</div>
                <div className={styles.dataItem}><strong>Data de Nascimento:</strong> {formData.data_nascimento}</div>
                <div className={styles.dataItem}><strong>Profissão:</strong> {formData.profissao}</div>
                <div className={styles.dataItem}><strong>Estado Civil:</strong> {formData.estadoCivil}</div>
                {formData.estadoCivil === 'casado' && (
                    <>
                        <div className={styles.dataItem}><strong>Nome do Cônjuge:</strong> {formData.nomeConjuge}</div>
                        <div className={styles.dataItem}><strong>Data de Nascimento do Cônjuge:</strong> {formData.dataNascimentoConjuge}</div>
                        <div className={styles.dataItem}><strong>Profissão do Cônjuge:</strong> {formData.profissaoConjuge}</div>
                    </>
                )}
                {renderFilhos()}
            </div>

            {/* Dados Financeiros */}
            <div className={styles.section}>
                <h3>Dados Financeiros</h3>
                <div className={styles.dataItem}><strong>Custo Mensal:</strong> {formData.custoMensal}</div>
                <div className={styles.dataItem}><strong>Renda Mensal:</strong> {formData.rendaMensal}</div>
                <div className={styles.dataItem}><strong>Tipo de Trabalho:</strong> {formData.trabalho}</div>
                <div className={styles.dataItem}><strong>Local de Trabalho:</strong> {formData.localTrabalho}</div>
                <div className={styles.dataItem}><strong>Moradia:</strong> {formData.moradia}</div>
                <div className={styles.dataItem}><strong>Valor da Moradia:</strong> {formData.valorMoradia}</div>
                <div className={styles.dataItem}><strong>Custo com Filhos:</strong> {formData.custoFilhos}</div>
                <div className={styles.dataItem}><strong>Patrimônio:</strong> {formData.patrimonio}</div>
                <div className={styles.dataItem}><strong>Dívidas:</strong> {formData.dividas}</div>
                <div className={styles.dataItem}><strong>Projetos Futuros:</strong> {formData.projetosFuturos}</div>
            </div>

            {/* Dados de Saúde */}
            <div className={styles.section}>
                <h3>Dados de Saúde</h3>
                <div className={styles.dataItem}><strong>Peso:</strong> {formData.peso} kg</div>
                <div className={styles.dataItem}><strong>Altura:</strong> {formData.altura} m</div>
                <div className={styles.dataItem}><strong>IMC:</strong> {(Number(formData.peso) / (Number(formData.altura) ** 2)).toFixed(2)}</div>
                {formData.temDoencaPreexistente && (
                    <div className={styles.dataItem}><strong>Doença Preexistente:</strong> {formData.doencaPreexistente}</div>
                )}
                {formData.temHistoricoFamiliarDoencas && (
                    <div className={styles.dataItem}><strong>Histórico Familiar de Doenças:</strong> {formData.historicoFamiliarDoencas}</div>
                )}
            </div>

            {/* Ações */}
            <div className={styles.actions}>
                {prevStep && (
                    <button className={styles.editButton} onClick={prevStep}>
                        Editar
                    </button>
                )}
                <button className={styles.submitButton} onClick={handleSubmit}>
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default Step4;
