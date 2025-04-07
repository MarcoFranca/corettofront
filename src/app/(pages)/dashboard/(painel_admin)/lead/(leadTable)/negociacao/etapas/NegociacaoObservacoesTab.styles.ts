import styled from "styled-components";

export const Container = styled.div`padding: 1rem;`;
export const Titulo = styled.h3`margin-bottom: 1rem;`;
export const InputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;
export const Textarea = styled.textarea`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
`;
export const AddButton = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;
export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const Item = styled.div`
  display: flex;
  gap: 0.75rem;
`;
export const Icone = styled.div`
  font-size: 1.5rem;
  color: #0070f3;
`;
export const Conteudo = styled.div`
  flex: 1;
`;
export const Cabecalho = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;
export const Autor = styled.span`font-weight: bold;`;
export const Data = styled.span`color: #666;`;
export const Texto = styled.p`margin: 0;`;