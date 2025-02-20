import React from 'react';
import {
    FormGroup,
    Label,
    StyledInput
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/(Old Steps)/StepDetalhesApolice.styles";
import {Controller} from "react-hook-form";

interface SeguroProfissionalProps {
    control: any; // Percentual concluído (0-100)
}

const SeguroProfissional: React.FC<SeguroProfissionalProps> = ({ control }) => {
    return (
      <div>
          <FormGroup>
              <Label>Franquia:</Label>
              <Controller
                  name="detalhes.franquia"
                  control={control}
                  render={({ field }) => <StyledInput {...field} type="number" placeholder="Valor da Franquia" />}
              />
          </FormGroup>
      </div>
    );
};

export default SeguroProfissional;
