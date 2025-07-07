import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { FormSection, Grid2 } from "../EditClientDrawer.styles";
import { generoOptions, estadoCivilOptions } from "../constants";
import FloatingMaskedInput from "@/app/components/ui/input/FloatingMaskedInput";
import { Select, Tooltip, Button } from "antd";
import styled from "styled-components";

const ObsArea = styled.textarea`
  width: 100%;
  min-height: 60px;
  border-radius: 8px;
  border: 1px solid #e0e6ef;
  padding: 10px;
  resize: vertical;
  font-size: 15px;
`;

interface Props {
    methods: any;
    cliente: any;
    fotoUrl?: string;
}

const DadosPessoaisSection: React.FC<Props> = ({ methods, cliente, fotoUrl }) => {
    const { control, setValue, register, watch } = methods;
    const [showPai, setShowPai] = useState(!!cliente?.nome_pai);

    return (
        <FormSection>
            <Grid2>
                <FloatingMaskedInput name="nome" label="Nome" control={control} setValue={setValue} register={register} required />
                <FloatingMaskedInput name="sobre_nome" label="Sobrenome" control={control} setValue={setValue} register={register} required />

                <Controller
                    name="genero"
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="Para seguros, utilize o gênero registrado em documento oficial.">
                            <Select
                                {...field}
                                options={generoOptions}
                                placeholder="Selecione o gênero"
                                style={{ width: "100%" }}
                                onChange={val => setValue("genero", val)}
                            />
                        </Tooltip>
                    )}
                />
                <Controller
                    name="estado_civil"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={estadoCivilOptions}
                            placeholder="Selecione o estado civil"
                            style={{ width: "100%" }}
                            onChange={val => setValue("estado_civil", val)}
                        />
                    )}
                />

                <FloatingMaskedInput name="data_nascimento" label="Data de Nascimento" type="date" control={control} setValue={setValue} register={register} required />

                <FloatingMaskedInput name="nome_mae" label="Nome da Mãe" control={control} setValue={setValue} register={register} required />

                {showPai ? (
                    <FloatingMaskedInput name="nome_pai" label="Nome do Pai" control={control} setValue={setValue} register={register} />
                ) : (
                    <div style={{ gridColumn: "span 2" }}>
                        <Button size="small" type="dashed" onClick={() => setShowPai(true)}>
                            Adicionar nome do pai (opcional)
                        </Button>
                    </div>
                )}
            </Grid2>
            <div style={{ margin: "18px 0 0 0" }}>
                <label style={{ fontWeight: 500, color: "#042a75" }}>Observações (uso interno)</label>
                <ObsArea {...register("observacoes")} placeholder="Notas internas, nunca vai para a seguradora" />
            </div>
        </FormSection>
    );
};

export default DadosPessoaisSection;
