import axios from 'axios';

export const buscaEnderecoPorCEP = async (cep: string) => {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.data.erro) {
            throw new Error('CEP não encontrado');
        }
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar o CEP');
    }
};
