// components/SearchableSelect.tsx
import React, { useState, useEffect } from 'react';

interface SearchableSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    name: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, name }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);

    useEffect(() => {
        setFilteredOptions(
            options.filter(option =>
                option.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, options]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    return (
        <div>
            <input
                type="text"
    value={searchTerm}
    onChange={handleSearchChange}
    placeholder="Buscar profissão..."
    />
    <select name={name} value={value} onChange={handleSelectChange}>
        {filteredOptions.map((option, index) => (
                <option key={index} value={option}>
            {option}
            </option>
))}
    </select>
    </div>
);
};

export default SearchableSelect;
