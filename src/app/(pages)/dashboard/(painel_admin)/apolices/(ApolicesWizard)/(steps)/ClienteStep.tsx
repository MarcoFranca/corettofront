import React from 'react';
import { useFormContext } from 'react-hook-form';

interface StepProps {
    values: Record<string, any>;
    onSubmit: (values: Record<string, any>) => void;
}

const ClienteStep: React.FC<StepProps> = ({ values, onSubmit }) => {
    // ✅ Agora useFormContext() não será null
    const { register, handleSubmit } = useFormContext();

    const handleFormSubmit = (data: Record<string, any>) => {
        console.log('✅ ClienteStep Data:', data);
        onSubmit(data); // ✅ Passa os dados para o Wizard
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <label className="block text-sm font-medium mb-1">
                Nome do Cliente
                <input
                    {...register('nome')}
                    defaultValue={values.nome}
                    className="mt-1 p-2 border rounded w-full"
                />
            </label>

            <label className="block text-sm font-medium mb-1">
                CPF
                <input
                    {...register('cpf')}
                    defaultValue={values.cpf}
                    className="mt-1 p-2 border rounded w-full"
                />
            </label>

            <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Salvar e Continuar
            </button>
        </form>
    );
};

export default ClienteStep;
