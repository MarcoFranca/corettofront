import styled from 'styled-components';

export const FaqContainer = styled.section`
  background: linear-gradient(135deg, #eef3fb 0%, #dff4ff 100%);

`
export const FaqWrapper = styled.section`
  padding: 5rem 2rem;
  max-width: 950px;
  margin: 0 auto;

  h2 {
    font-size: 2.2rem;
    text-align: center;
    color: #042a75;
    margin-bottom: 2.5rem;
  }
`;

export const QuestionItem = styled.div<{ active: boolean }>`
  border-bottom: 1px solid #e0e6ed;
  padding: 1.2rem ;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #eef3fb;
  }

  
`;

export const QuestionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #042a75;
  position: relative;
`;

export const Badge = styled.span`
  background-color: #33cccc;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  margin-left: auto;
`;

export const Answer = styled.p`
  padding: 0.8rem 1.5rem 0 2.2rem;
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
`;
