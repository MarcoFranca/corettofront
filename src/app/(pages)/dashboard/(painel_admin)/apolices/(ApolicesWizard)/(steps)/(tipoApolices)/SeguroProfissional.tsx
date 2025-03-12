import React from 'react';

import {Controller} from "react-hook-form";
import {
    FormGroup,
    StyledInput
} from "@/app/(pages)/dashboard/(painel_admin)/apolices/(ApolicesWizard)/(steps)/StepDadosPrincipais.styles";
import {Label} from "recharts";

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
