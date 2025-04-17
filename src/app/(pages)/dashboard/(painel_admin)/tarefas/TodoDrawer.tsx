// components/TodoDrawer.tsx
import React, { useEffect } from 'react';
import {Drawer, Input, DatePicker, Select, Button, Space, Switch} from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch } from '@/services/hooks/hooks';
import { createTarefa, updateTarefa } from '@/store/slices/todoSlice';
import dayjs, { Dayjs } from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface ClienteOption {
    value: string;
    label: string;
}

interface FormValues {
    title: string;
    description?: string;
    due_date?: Dayjs | null;
    urgency?: 'Low' | 'Medium' | 'High' | 'Critical';
    cliente?: ClienteOption | null;
    add_to_google_calendar: boolean;
    start_datetime?: Dayjs | null;
    end_datetime?: Dayjs | null;
    repeat_count?: number;
    repeat_forever?:boolean;
    repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
}

interface Props {
    open: boolean;
    onClose: () => void;
    tarefa?: any;
    modoEdicao?: boolean;
    onCreated?: (novaTarefa: any) => void;
}

const TodoDrawer: React.FC<Props> = ({ open, onClose, tarefa, modoEdicao }) => {
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setError,
        formState: { isSubmitting }
    } = useForm<FormValues>({
        mode: 'onSubmit',
        defaultValues: {
            title: '',
            description: '',
            due_date: null,
            urgency: undefined,
            cliente: null,
            add_to_google_calendar: false,
            start_datetime: null,
            end_datetime: null,
            repeat: 'none',
            repeat_count: undefined,
            repeat_forever: false,
        },
    });

    useEffect(() => {
        if (modoEdicao && tarefa) {
            reset({
                title: tarefa.title,
                description: tarefa.description,
                due_date: tarefa.due_date ? dayjs(tarefa.due_date) : null,
                urgency: tarefa.urgency,
                cliente: tarefa.cliente ? { value: tarefa.cliente, label: tarefa.cliente_label || 'Cliente' } : null,
                add_to_google_calendar: tarefa.add_to_google_calendar || false,
                start_datetime: tarefa.start_time ? dayjs(tarefa.start_time) : null,
                end_datetime: tarefa.end_time ? dayjs(tarefa.end_time) : null,
                repeat: tarefa.repeat || 'none',
            });
        } else {
            reset();
        }
    }, [modoEdicao, tarefa, reset]);

    const onSubmit = async (data: FormValues) => {
        if (data.start_datetime && data.end_datetime && data.start_datetime.isAfter(data.end_datetime)) {
            setError('end_datetime', { type: 'manual', message: 'A data/hora de término deve ser posterior ao início.' });
            return;
        }

        const start_time = data.start_datetime?.toISOString();
        const end_time = data.end_datetime?.toISOString();

        try {
            const payload = {
                title: data.title,
                description: data.description,
                due_date: data.due_date?.toISOString(),
                urgency: data.urgency,
                cliente: data.cliente?.value,
                negociacao: tarefa?.negociacao,
                add_to_google_calendar: data.add_to_google_calendar,
                start_time,
                end_time,
                completed: tarefa?.completed ?? false,
                repeat: data.repeat,
                repeat_count: data.repeat_count,
                repeat_forever: data.repeat_forever,
            };

            if (modoEdicao && tarefa?.id) {
                await dispatch(updateTarefa({ id: tarefa.id, dados: payload })).unwrap();
            } else {
                await dispatch(createTarefa(payload)).unwrap();
            }

            onClose();
        } catch (error) {
            console.error('Erro ao enviar tarefa:', error);
        }
    };


    return (
        <Drawer title={modoEdicao ? 'Editar Tarefa' : 'Nova Tarefa'} open={open} onClose={onClose} width={500}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <label>Título</label>
                <Controller
                    name="title"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input {...field} />
                    )}
                />

                <label>Descrição</label>
                <TextArea rows={3} {...register('description')} />

                <label>Urgência</label>
                <Controller
                    name="urgency"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onChange={field.onChange} allowClear style={{ width: '100%' }}>
                            <Option value="Low">Baixa</Option>
                            <Option value="Medium">Média</Option>
                            <Option value="High">Alta</Option>
                            <Option value="Critical">Crítica</Option>
                        </Select>
                    )}
                />

                <label>Início</label>
                <Controller
                    name="start_datetime"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            style={{ width: '100%' }}
                            value={field.value ?? null}
                            onChange={field.onChange}
                        />
                    )}
                />

                <label>Término</label>
                <Controller
                    name="end_datetime"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            style={{ width: '100%' }}
                            value={field.value ?? null}
                            onChange={field.onChange}
                        />
                    )}
                />

                <label>Adicionar ao Google Calendar</label>
                <Controller
                    name="add_to_google_calendar"
                    control={control}
                    render={({ field }) => (
                        <Switch checked={field.value} onChange={field.onChange} />
                    )}
                />

                <label>Repetição</label>
                <Controller
                    name="repeat"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onChange={field.onChange} style={{ width: '100%' }}>
                            <Option value="none">Não repetir</Option>
                            <Option value="daily">Diariamente</Option>
                            <Option value="weekly">Semanalmente</Option>
                            <Option value="monthly">Mensalmente</Option>
                        </Select>
                    )}
                />

                {watch('repeat') !== 'none' && (
                    <>
                        <label>Repetir por</label>
                        <Controller
                            name="repeat_count"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    min={1}
                                    disabled={watch('repeat_forever')}
                                    placeholder="Ex: 5 repetições"
                                />
                            )}
                        />

                        <label>
                            <Controller
                                name="repeat_forever"
                                control={control}
                                render={({ field }) => (
                                    <Switch checked={field.value} onChange={field.onChange} />
                                )}
                            />{' '}
                            Repetir para sempre
                        </label>
                    </>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                    <Space>
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button type="primary" htmlType="submit" loading={isSubmitting}>
                            {modoEdicao ? 'Salvar' : 'Criar'}
                        </Button>
                    </Space>
                </div>
            </form>
        </Drawer>
    );
};

export default TodoDrawer;