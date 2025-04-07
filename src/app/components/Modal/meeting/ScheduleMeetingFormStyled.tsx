// components/negociacao/ScheduleMeetingFormStyled.tsx
'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/services/hooks/hooks';
import { createAgendaItem, updateAgendaItem } from '@/store/slices/agendaSlice';
import { Cliente, NegociacaoCliente } from '@/types/interfaces';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import { clearMessages, linkGoogleAccount } from '@/store/slices/googleIntegrationSlice';
import {
    ModalContainer,
    ModalContent,
    FieldLabel,
    Input,
    Textarea,
    CheckboxContainer,
    ButtonGroup,
    PrimaryButton,
    CancelButton
} from './ScheduleMeetingFormStyled.styles';
import {Select} from "antd";
import {Meeting} from "@/types/AgendaInterfaces";

interface Props {
    cliente: Cliente;
    negociacao: NegociacaoCliente;
    meeting?: Meeting | null;
    onClose: () => void;
    onSaved: () => void;
}
const STATUS_REUNIAO_AGENDA = [
    ['agendada', 'Agendada'],
    ['confirmada', 'Confirmada'],
    ['remarcada', 'Remarcada'],
    ['cancelada', 'Cancelada'],
    ['no_show', 'Não compareceu'],
    ['realizada', 'Realizada com sucesso'],
];


const ScheduleMeetingFormStyled: React.FC<Props> = ({ cliente, negociacao, meeting, onClose, onSaved }) => {
    const dispatch = useAppDispatch();

    const [description, setDescription] = useState(meeting?.description || '');
    const [date, setDate] = useState(meeting?.start_time ? new Date(meeting.start_time).toISOString().split('T')[0] : '');
    const [startTime, setStartTime] = useState(meeting?.start_time ? new Date(meeting.start_time).toTimeString().slice(0, 5) : '');
    const [endTime, setEndTime] = useState(meeting?.end_time ? new Date(meeting.end_time).toTimeString().slice(0, 5) : '');
    const [googleCalendar, setGoogleCalendar] = useState(meeting?.add_to_google_calendar || false);
    const [googleMeet, setGoogleMeet] = useState(meeting?.add_to_google_meet || false);
    const [zoom, setZoom] = useState(meeting?.add_to_zoom || false);
    const [statusReuniao, setStatusReuniao] = useState(meeting?.status_reuniao || 'agendada');
    const [motivoCancelamento, setMotivoCancelamento] = useState(meeting?.motivo_cancelamento || '');
    const [showMotivo, setShowMotivo] = useState(meeting?.status_reuniao === 'cancelada');

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: (codeResponse) => {
            dispatch(linkGoogleAccount(codeResponse.code));
            toast.success('Conta Google vinculada com sucesso!');
        },
        onError: () => {
            dispatch(clearMessages());
            toast.error('Erro ao tentar reautorizar a conta Google.');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!date || !startTime || !endTime) {
            toast.warning('Preencha data e horários corretamente.');
            return;
        }

        const start = new Date(`${date}T${startTime}`).toISOString();
        const end = new Date(`${date}T${endTime}`).toISOString();

        const payload: Partial<Meeting> = {
            title: `Reunião: ${negociacao.titulo}`,
            cliente: cliente.id,
            negociacao: negociacao.id,
            description,
            start_time: start,
            end_time: end,
            add_to_google_calendar: googleCalendar,
            add_to_google_meet: googleMeet,
            add_to_zoom: zoom,
            status_reuniao: statusReuniao,
            motivo_cancelamento: motivoCancelamento,
        };


        try {
            if (meeting?.id) {
                await dispatch(updateAgendaItem({ id: meeting.id, updatedItem: payload })).unwrap();
                toast.success('Reunião atualizada!');
            } else {
                await dispatch(createAgendaItem(payload)).unwrap();
                toast.success('Reunião agendada!');
            }

            onSaved();
            onClose();
        } catch (error: any) {
            if (error.code === 'google_auth_required') {
                toast.warning('Conta Google expirada, reautorizando...');
                loginWithGoogle();
            } else {
                toast.error(error.message || 'Erro ao salvar reunião.');
            }
        }
    };

    return (
        <ModalContainer>
            <ModalContent>
                <h3>{meeting ? 'Editar Reunião' : 'Nova Reunião'}</h3>
                <form onSubmit={handleSubmit}>
                    <FieldLabel>Data:</FieldLabel>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

                    <FieldLabel>Hora Início:</FieldLabel>
                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />

                    <FieldLabel>Hora Fim:</FieldLabel>
                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />

                    <FieldLabel>Descrição:</FieldLabel>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    <FieldLabel>Status da Reunião:</FieldLabel>
                    <Select
                        value={statusReuniao}
                        style={{ width: '100%', marginBottom: '1rem' }}
                        onChange={(value) => {
                            setStatusReuniao(value);
                            setShowMotivo(value === 'cancelada');
                        }}
                    >
                        {STATUS_REUNIAO_AGENDA.map(([value, label]) => (
                            <Select.Option key={value} value={value}>
                                {label}
                            </Select.Option>
                        ))}
                    </Select>

                    {showMotivo && (
                        <>
                            <FieldLabel>Motivo do Cancelamento:</FieldLabel>
                            <Textarea
                                placeholder="Descreva o motivo do cancelamento"
                                value={motivoCancelamento}
                                onChange={(e) => setMotivoCancelamento(e.target.value)}
                            />
                        </>
                    )}
                    <CheckboxContainer>
                        <label>
                            <input type="checkbox" checked={googleCalendar} onChange={(e) => setGoogleCalendar(e.target.checked)} />
                            Google Calendar
                        </label>
                        <label>
                            <input type="checkbox" checked={googleMeet} onChange={(e) => setGoogleMeet(e.target.checked)} />
                            Google Meet
                        </label>
                        <label>
                            <input type="checkbox" checked={zoom} onChange={(e) => setZoom(e.target.checked)} />
                            Zoom
                        </label>
                    </CheckboxContainer>

                    <ButtonGroup>
                        <PrimaryButton type="submit">{meeting ? 'Salvar' : 'Agendar'}</PrimaryButton>
                        <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
                    </ButtonGroup>
                </form>
            </ModalContent>
        </ModalContainer>
    );
};

export default ScheduleMeetingFormStyled;
