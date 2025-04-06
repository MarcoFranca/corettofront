
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/app/api/axios";
import {
  Container,
  FormContainer,
  Input,
  Textarea,
  Button,
  Title,
  ActivityItem,
  ActivityList,
  Label,
  Select,
} from "./AtividadesNegociacao.styles";

interface Atividade {
  id: string;
  titulo: string;
  status: string;
  observacoes?: string;
  created_at: string;
}

interface AtividadesNegociacaoProps {
  negociacaoId: string;
}

const statusOptions = [
  { value: "tentativa_contato", label: "Tentativa de Contato" },
  { value: "nao_atendeu", label: "Não Atendeu" },
  { value: "retorno_solicitado", label: "Solicitou Retorno" },
  { value: "contato_realizado", label: "Contato Realizado" },
];

const AtividadesNegociacao: React.FC<AtividadesNegociacaoProps> = ({ negociacaoId }) => {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const { register, handleSubmit, reset } = useForm();

  const fetchAtividades = async () => {
    try {
      const response = await api.get(`/negociacoes/${negociacaoId}/atividades/`);
      setAtividades(response.data);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await api.post("/atividades-negociacao/", {
        ...data,
        negociacao: negociacaoId,
      });
      setAtividades((prev) => [response.data, ...prev]);
      reset();
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);
    }
  };

  useEffect(() => {
    if (negociacaoId) {
      fetchAtividades();
    }
  }, [negociacaoId]);

  return (
    <Container>
      <Title>📞 Registro de Atividades</Title>

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <Label>Título</Label>
        <Input {...register("titulo", { required: true })} placeholder="Ex: Primeira tentativa" />

        <Label>Status</Label>
        <Select {...register("status", { required: true })}>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Label>Observações</Label>
        <Textarea {...register("observacoes")} placeholder="Observações adicionais..." />

        <Button type="submit">Salvar Atividade</Button>
      </FormContainer>

      <ActivityList>
        {atividades.map((a) => (
          <ActivityItem key={a.id}>
            <strong>{a.titulo}</strong> <br />
            <small>Status: {a.status}</small> <br />
            {a.observacoes && <p>{a.observacoes}</p>}
            <small>{new Date(a.created_at).toLocaleString("pt-BR")}</small>
          </ActivityItem>
        ))}
      </ActivityList>
    </Container>
  );
};

export default AtividadesNegociacao;
