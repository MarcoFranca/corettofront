interface Props {
    setFiltro: (filtro: string) => void;
}

const ApoliceFilter = ({ setFiltro }: Props) => {
    return (
        <div className="mb-4">
            <label className="mr-2">Filtrar por tipo:</label>
            <select onChange={(e) => setFiltro(e.target.value)} className="border p-2">
                <option value="todos">Todos</option>
                <option value="plano_saude">Plano de Saúde</option>
                <option value="seguro_vida">Seguro de Vida</option>
                <option value="previdencia">Previdência</option>
                <option value="consorcio">Consórcio</option>
                <option value="investimento">Investimento</option>
                <option value="seguro_profissional">Seguro Profissional</option>
                <option value="seguro_residencial">Seguro Residencial</option>
            </select>
        </div>
    );
};

export default ApoliceFilter;
