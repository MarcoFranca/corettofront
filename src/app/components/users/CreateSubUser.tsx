'use client'
import React, { useState } from 'react';
import api from '@/app/api/axios';

export default function CreateSubUser() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('secretaria');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(
                '/subusuarios/',
                {
                    username,
                    password,
                    role,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            );
            setMessage('Subusuário criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar subusuário:', error);
            setMessage('Erro ao criar subusuário. Verifique os dados e tente novamente.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nome de Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="secretaria">Secretária</option>
                <option value="gerente">Gerente</option>
            </select>
            <button type="submit">Criar Subusuário</button>
            {message && <p>{message}</p>}
        </form>
    );
}
