import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ModalContent, Title, Label, ButtonGroup } from './EventDetailsModal.styles';
import moment from "moment";

interface EventDetailsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    event: any;
    onUpdate: (updatedEvent: any) => void;
    onDelete: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
                                                                 isOpen,
                                                                 onRequestClose,
                                                                 event,
                                                                 onUpdate,
                                                                 onDelete,
                                                             }) => {
    const [editableEvent, setEditableEvent] = useState(event);

    useEffect(() => {
        setEditableEvent(event); // Atualiza o estado local quando o evento muda
    }, [event]);

    const handleFieldChange = (field: string, value: string) => {
        setEditableEvent({ ...editableEvent, [field]: value });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Detalhes do Evento"
            ariaHideApp={false}
            overlayClassName="customOverlay"
            className="customContent"
        >
            <ModalContent>
                <Title>Detalhes do Evento</Title>
                <Label>
                    Título:
                    <input
                        type="text"
                        value={editableEvent.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                    />
                </Label>
                <Label>
                    Descrição:
                    <textarea
                        value={editableEvent.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                    />
                </Label>
                <Label>
                    Hora de Início:
                    <input
                        type="time"
                        value={
                            editableEvent.start
                                ? moment(editableEvent.start).format('HH:mm') // Formate usando moment
                                : ''
                        }
                        onChange={(e) => handleFieldChange('start', e.target.value)}
                    />
                </Label>
                <Label>
                    Hora de Término:
                    <input
                        type="time"
                        value={
                            editableEvent.end
                                ? moment(editableEvent.end).format('HH:mm') // Formate usando moment
                                : ''
                        }
                        onChange={(e) => handleFieldChange('end', e.target.value)}
                    />
                </Label>

                <ButtonGroup>
                    <button
                        className="save"
                        onClick={() => onUpdate(editableEvent)}
                    >
                        Salvar
                    </button>
                    <button className="delete" onClick={onDelete}>
                        Deletar
                    </button>
                    <button className="close" onClick={onRequestClose}>
                        Fechar
                    </button>
                </ButtonGroup>
            </ModalContent>
        </Modal>
    );
};

export default EventDetailsModal;
