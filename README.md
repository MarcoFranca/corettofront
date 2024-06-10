# CorettoCRM

## Visão Geral
CorettoCRM é uma aplicação CRM para corretores de imóveis.

## Estrutura do Projeto
```plaintext
your-crm-project/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── common/
│   │   │       └── Header/
│   │   │           ├── index.tsx
│   │   │           └── styles.module.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── axios.ts
├── public/
├── tsconfig.json
├── next.config.js
└── package.json
```
# Configuração
## Pré-requisitos
- Node.js
- Yarn
## Instalação
```bash
git clone https://github.com/MarcoFranca/corettofront.git
cd corettofront
yarn install
```
## Execução
```bash
yarn dev
```
## Funcionalidades
### Login
- Descrição das funcionalidades de login.
- Como testar o login.
### Dependências Principais
- Next.js
- Styled-components
- Axios
### Implementação da Funcionalidade de Login

1. **Criação do Componente de Login**:
    - Estruture o formulário de login e adicione validação.
```tsx
// src/app/components/LoginForm/index.tsx
'use client';

import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: auto;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  background-color: #0070f3;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;
```
```javascript
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      console.log('Login successful', response.data);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">Login</Button>
    </Form>
  );
};
export default LoginForm;
```

2. **Integração do Componente de Login na Página:**
```tsx
// src/app/page.tsx
import Header from './components/common/Header';
import LoginForm from './components/LoginForm';

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <h1>Bem-vindo ao CRM para Corretores</h1>
        <LoginForm />
      </main>
    </div>
  );
};

export default Home;
```