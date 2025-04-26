import { Modal } from 'antd';
import {FaGift} from "react-icons/fa"; // exemplo

export function showTrialTokensModal() {
    Modal.info({
        title: (
            <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#042a75' }}>
                🎁 Tokens Liberados!
            </div>
        ),
        content: (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <FaGift size={80} color="#FFA500" style={{ marginBottom: '20px' }} />
                <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                    Parabéns! Você acabou de ganhar <strong>10.000 tokens</strong> para utilizar com a Cora, nossa assistente inteligente.
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Aproveite essa vantagem para turbinar suas negociações e atendimento!
                </p>
            </div>
        ),
        okText: 'Começar a usar agora 🚀',
        okButtonProps: { style: { backgroundColor: '#042a75', borderColor: '#042a75' } },
        onOk: () => {
            localStorage.setItem('trialTokensModalSeen', 'true');
            window.location.href = '/dashboard/ia-chat';
        },
        closable: true,
        centered: true,
        maskClosable: true,
    });
}
