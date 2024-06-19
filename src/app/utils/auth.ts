import Leads from "@/app/components/leads/Leads";

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};
export default class axiosInstance {
    static async get(s: string) {

    }

    static async post(s: string, novoFornecedor: Leads, param3: {headers: {Authorization: string}}) {

    }
}