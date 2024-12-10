import React from 'react';
import Modal from 'react-modal';
import { ModalContent, Title, Label, ButtonGroup } from './CreateEventModal.styles';

interface Cliente {
    id: string;
    nome: string;
}

interface CreateEvent {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    type: 'task' | 'meeting';
    urgency: 'Low' | 'Medium' | 'High' | 'Critical';
    clienteId: string | null;
    add_to_google_calendar: boolean;
    add_to_google_meet: boolean;
    add_to_zoom: boolean;
}

interface CreateEventModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    newEvent: CreateEvent;
    setNewEvent: React.Dispatch<React.SetStateAction<CreateEvent>>;
    handleSave: () => void;
    clientes: Cliente[];
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
                                                               isOpen,
                                                               onRequestClose,
                                                               newEvent,
                                                               setNewEvent,
                                                               handleSave,
                                                               clientes,
                                                           }) => {
    const isFormValid = () => {
        return (
            newEvent.title.trim() !== '' &&
            newEvent.startTime.trim() !== '' &&
            newEvent.endTime.trim() !== ''
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Novo Evento"
            ariaHideApp={false}
            overlayClassName="customOverlay"
            className="customContent"
        >
            <ModalContent>
                <Title>Novo Evento</Title>
                <form>
                    <Label>
                        Título:
                        <input
                            type="text"
                            value={newEvent.title}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, title: e.target.value })
                            }
                            required
                        />
                    </Label>
                    <Label>
                        Descrição:
                        <textarea
                            value={newEvent.description}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, description: e.target.value })
                            }
                        />
                    </Label>
                    <Label>
                        Hora de Início:
                        <input
                            type="time"
                            value={newEvent.startTime}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, startTime: e.target.value })
                            }
                            required
                        />
                    </Label>
                    <Label>
                        Hora de Término:
                        <input
                            type="time"
                            value={newEvent.endTime}
                            onChange={(e) =>
                                setNewEvent({ ...newEvent, endTime: e.target.value })
                            }
                            required
                        />
                    </Label>
                    <Label>
                        Tipo:
                        <select
                            value={newEvent.type}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    type: e.target.value as 'task' | 'meeting',
                                })
                            }
                        >
                            <option value="task">Tarefa</option>
                            <option value="meeting">Reunião</option>
                        </select>
                    </Label>
                    <Label>
                        Urgência:
                        <select
                            value={newEvent.urgency}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    urgency: e.target.value as
                                        | 'Low'
                                        | 'Medium'
                                        | 'High'
                                        | 'Critical',
                                })
                            }
                        >
                            <option value="Low">Baixa</option>
                            <option value="Medium">Média</option>
                            <option value="High">Alta</option>
                            <option value="Critical">Crítica</option>
                        </select>
                    </Label>
                    <Label>
                        Cliente:
                        <select
                            value={newEvent.clienteId || ''}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    clienteId: e.target.value || null,
                                })
                            }
                        >
                            <option value="">Selecionar Cliente (Opcional)</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                </option>
                            ))}
                        </select>
                    </Label>
                    <ButtonGroup>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="save"
                            disabled={!isFormValid()}
                        >
                            Salvar
                        </button>
                        <button
                            type="button"
                            onClick={onRequestClose}
                            className="cancel"
                        >
                            Cancelar
                        </button>
                    </ButtonGroup>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default CreateEventModal;
