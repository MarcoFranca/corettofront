import React from 'react';
import Button from '@/app/components/ui/Button';
import Progress from '@/app/components/ui/progress/Progress';
import { NavigationContainer, StepLabel } from './WizardNavigation.styles';

interface WizardNavigationProps {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onPrev: () => void;
    onFinish: () => void;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
                                                               currentStep,
                                                               totalSteps,
                                                               onNext,
                                                               onPrev,
                                                               onFinish,
                                                           }) => {
    return (
        <NavigationContainer>
            {/* ✅ Barra de Progresso */}
            <Progress value={((currentStep + 1) / totalSteps) * 100} />
            <StepLabel>
                Etapa {currentStep + 1} de {totalSteps}
            </StepLabel>

            {/* ✅ Botões de Controle */}
            <div className="button-group">
                <Button onClick={onPrev} disabled={currentStep === 0} variant="secondary">
                    Voltar
                </Button>
                {currentStep < totalSteps - 1 ? (
                    <Button onClick={onNext} variant="primary">
                        Próximo
                    </Button>
                ) : (
                    <Button onClick={onFinish} variant="success">
                        Finalizar Cadastro
                    </Button>
                )}
            </div>
        </NavigationContainer>
    );
};

export default WizardNavigation;
