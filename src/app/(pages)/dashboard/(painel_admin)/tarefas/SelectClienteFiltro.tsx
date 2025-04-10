import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import {loadClienteOptions} from "@/app/components/ui/select/selectUtils";

interface Option {
    value: string;
    label: string;
}

interface Props {
    placeholder?: string;
    onChange?: (value: Option | null) => void;
    value?: Option | null;
}

const SelectClienteFiltro: React.FC<Props> = ({ placeholder, onChange, value }) => {
    const [selected, setSelected] = useState<Option | null>(value || null);

    const handleChange = (opt: Option | null) => {
        setSelected(opt);
        if (onChange) onChange(opt);
    };

    return (
        <AsyncPaginate
            loadOptions={loadClienteOptions}
            defaultOptions
            isSearchable
            additional={{ page: 1 }}
            placeholder={placeholder || "Selecione um cliente"}
            classNamePrefix="custom-select"
            value={selected}
            onChange={handleChange}
        />
    );
};

export default SelectClienteFiltro;
