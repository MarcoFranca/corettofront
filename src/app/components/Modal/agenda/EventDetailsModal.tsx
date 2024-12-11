import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ModalContent, Title, Label, ButtonGroup, CheckboxGroup } from './EventDetailsModal.styles';
import moment from 'moment';

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

    const handleFieldChange = (field: string, value: any) => {
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
                        value={editableEvent.title || ''}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                    />
                </Label>
                <Label>
                    Descrição:
                    <textarea
                        value={editableEvent.description || ''}
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
                <CheckboxGroup>
                    <label>
                        <input
                            type="checkbox"
                            checked={!!editableEvent.add_to_google_calendar}
                            onChange={(e) => handleFieldChange('add_to_google_calendar', e.target.checked)}
                        />
                        Adicionar ao Google Agenda
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={!!editableEvent.add_to_google_meet}
                            onChange={(e) => handleFieldChange('add_to_google_meet', e.target.checked)}
                        />
                        Adicionar ao Google Meet
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={!!editableEvent.add_to_zoom}
                            onChange={(e) => handleFieldChange('add_to_zoom', e.target.checked)}
                        />
                        Adicionar ao Zoom
                    </label>
                </CheckboxGroup>
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
