// components/cliente/conta/HealthInfoCard.tsx
import React, { useState } from 'react';
import EditClientModal from '@/app/components/Modal/profile/EditClientModal';
import { Cliente } from '@/types/interfaces';
import Card from "@/app/components/common/Card";

interface HealthInfoCardProps {
    cliente: Cliente;
}

const HealthInfoCard: React.FC<HealthInfoCardProps> = ({ cliente }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSave = (data: any) => {
        // Dispatch updateCliente action here
        closeModal();
    };

    return (
        <Card title="Saúde">
                {/*<button onClick={openModal}>Editar</button>*/}
            <div className="card-body">
                <p><strong>Altura:</strong> {cliente.saude?.altura || 'Não informada'}</p>
                <p><strong>Peso:</strong> {cliente.saude?.peso || 'Não informado'}</p>
                <p><strong>IMC:</strong> {cliente.saude?.imc || 'Não calculado'}</p>
            </div>
            <EditClientModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                initialData={{
                    altura: cliente.saude?.altura,
                    peso: cliente.saude?.peso
                }}
                onSave={handleSave}
            />
        </Card>
    );
};

export default HealthInfoCard;
// <Card title="">
//
//     <div className={styles.profileSection}>
//         <h3 className={styles.sectionTitle}>Dados de Contato</h3>
//         <div className={styles.profileCellRow}>
//             <p><strong>Email:</strong> {formatValue(cliente.email, 'Não informado')}</p>
//             <p><strong>Telefone:</strong> {formatValue(cliente.telefone, 'Não informado')}</p>
//         </div>
//     </div>
//
//     <div className={styles.profileSection}>
//         <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
//         <div className={styles.profileCellRow}>
//             <p><strong>Data de
//                 Nascimento:</strong> {formatValue(cliente.data_nascimento, 'Não informada')}</p>
//             <p><strong>Sexo:</strong> {cliente.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
//         </div>
//         <div className={styles.profileCellRow}>
//             <p><strong>Profissão:</strong> {formatValue(cliente.profissao, 'Não informada')}</p>
//             <p><strong>Idade:</strong> {formatValue(cliente.idade, 'Não informada')}</p>
//         </div>
//     </div>
//
//     <div className={styles.profileSection}>
//         <h3 className={styles.sectionTitle}>Documentos</h3>
//         <div className={styles.profileCellRow}>
//             <p><strong>CPF:</strong> {formatValue(cliente.cpf, 'Não informado')}</p>
//             <p><strong>Identidade:</strong> {formatValue(cliente.identidade, 'Não informada')}
//             </p>
//         </div>
//         <div className={styles.profileCellRow}>
//             <p>
//                 <strong>Endereço:</strong> {formatValue(cliente.endereco?.logradouro, 'Não informado')}
//             </p>
//             <p><strong>Número:</strong> {formatValue(cliente.endereco?.numero, 'Não informado')}
//             </p>
//         </div>
//         <div className={styles.profileCellRow}>
//             <p><strong>Cidade:</strong> {formatValue(cliente.endereco?.cidade, 'Não informada')}
//             </p>
//             <p><strong>UF:</strong> {formatValue(cliente.endereco?.uf, 'Não informado')}</p>
//             <p><strong>CEP:</strong> {formatValue(cliente.endereco?.cep, 'Não informado')}</p>
//         </div>
//     </div>
// </Card>
// </div>