import {useState} from "react";
import api from "@/app/api/axios";
import {toastError, toastSuccess} from "@/utils/toastWithSound";
import {Input, Modal, Select} from "antd";
import {Textarea} from "@/app/components/Modal/meeting/ScheduleMeetingFormStyled.styles";
import {AtividadeNegociacao, NegociacaoCliente} from "@/types/interfaces";

interface Props {
    visible: boolean;
    negociacao: NegociacaoCliente;
    onClose: () => void;
    onSaved: (novaAtividade: AtividadeNegociacao) => void;
}

const NovaAtividadeModal: React.FC<Props> = ({ visible, negociacao, onClose, onSaved }) => {
    const [titulo, setTitulo] = useState('');
    const [status, setStatus] = useState('');
    const [observacoes, setObservacoes] = useState('');

    const handleSave = async () => {
        try {
            const res = await api.post('/atividades-negociacao/', {
                negociacao: negociacao.id,
                titulo, status, observacoes
            });
            toastSuccess("Atividade salva com sucesso!");
            onSaved(res.data);
            onClose();
        } catch {
            toastError("Erro ao salvar atividade.");
        }
    };

    return (
        <Modal title="Nova Atividade" open={visible} onOk={handleSave} onCancel={onClose}>
            <Input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título" />
            <Select value={status} onChange={setStatus} options={[
                {label:"Contato inicial",value:"contato_inicial"},
                {label:"Não atendeu",value:"nao_atendeu"},
                {label:"Retornar",value:"retornar"},
            ]}/>
            <Textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Observações" />
        </Modal>
    );
};

export default NovaAtividadeModal;