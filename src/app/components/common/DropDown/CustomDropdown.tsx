import React, { useState } from 'react';
import styles from './CustomDropdown.module.css';

interface Option {
    value: string;
    label: string;
}

interface GroupedOptions {
    label: string;
    options: Option[];
}

interface CustomDropdownProps {
    options?: Option[];  // Tornamos isso opcional
    groups?: GroupedOptions[];  // Novo campo para suportar grupos de opções
    placeholder?: string;
    onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options = [], groups = [], placeholder, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<Option | null>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option: Option) => {
        setSelected(option);
        setIsOpen(false);
        onSelect(option.value);
    };

    return (
        <div className={styles.dropdownContainer}>
            <div className={styles.dropdownHeader} onClick={toggleDropdown}>
                {selected ? selected.label : placeholder || "Selecione uma opção"}
                <span className={styles.dropdownArrow}>{isOpen ? "▲" : "▼"}</span>
            </div>
            {isOpen && (
                <ul className={styles.dropdownList}>
                    {groups.length > 0 ? (
                        groups.map(group => (
                            <li key={group.label} className={styles.optgroupLabel}>
                                {group.label}
                                <ul>
                                    {group.options.map(option => (
                                        <li
                                            key={option.value}
                                            className={styles.dropdownOption}
                                            onClick={() => handleSelect(option)}
                                        >
                                            {option.label}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))
                    ) : (
                        options.map(option => (
                            <li
                                key={option.value}
                                className={styles.dropdownOption}
                                onClick={() => handleSelect(option)}
                            >
                                {option.label}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomDropdown;
