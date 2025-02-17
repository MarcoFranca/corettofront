import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import WizardNavigation from './WizardNavigation';
import InformacoesGeraisStep from './(steps)/ClienteStep';
import DetalhesApoliceStep from './(steps)/DetalhesApoliceStep';
import CoberturasStep from './(steps)/CoberturasStep';
import ConfirmacaoStep from './(steps)/ConfirmacaoStep';
import ClienteStep from "./(steps)/ClienteStep";

const steps = [
    { title: 'Informações Gerais', component: InformacoesGeraisStep },
    { title: 'Detalhes da Apólice', component: DetalhesApoliceStep },
    { title: 'Coberturas', component: CoberturasStep },
    { title: 'Confirmação', component: ConfirmacaoStep },
];

interface ApoliceWizardProps {
    onClose: () => void;
}

const ApoliceWizard: React.FC<ApoliceWizardProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formValues, setFormValues] = useState<Record<string, any>>({});

    // ✅ Criando o método do useForm (necessário para useFormContext)
    const methods = useForm({
        mode: "onChange",
        defaultValues: formValues,
    });

    const StepComponent = steps[currentStep].component;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = () => {
        alert('✅ Cadastro de apólice finalizado!');
        onClose(); // ✅ Fecha o Wizard após finalizar
    };

    const handleFormSubmit = (values: Record<string, any>) => {
        setFormValues({ ...formValues, ...values });
        handleNext();
    };

    return (
        <FormProvider {...methods}> {/* ✅ Provider Obrigatório */}
            <div className="p-6 border rounded-lg shadow-lg bg-white">
                <h2 className="text-xl font-semibold mb-4">Cadastro de Apólice</h2>

                {/* ✅ Passando valores e onSubmit para o Step */}
                <ClienteStep values={formValues} onSubmit={handleFormSubmit} />

                {/* ✅ Navegação abaixo dos Steps */}
                <WizardNavigation
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onFinish={handleFinish}
                />
            </div>
        </FormProvider>
    );
};

export default ApoliceWizard;
