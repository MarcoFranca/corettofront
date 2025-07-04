// Em algum arquivo types, ex: types/profissao.ts
export type Option = {
    value: string;
    label: string;
};

export type ProfissaoGroup = {
    label: string;
    options: Option[];
};
