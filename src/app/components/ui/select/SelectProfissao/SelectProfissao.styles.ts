// 📂 components/ui/select/SelectProfissao.styles.ts
import styled from "styled-components";

export const SelectWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;

    label {
        font-weight: 600;
        color: #333;
    }

    .required {
        color: red;
        margin-left: 3px;
    }

    .custom-select__control {
        border-radius: 5px;
        border: 1px solid #ccc;
    }

    .custom-select__control--is-focused {
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
    }

    .custom-select__menu {
        border-radius: 5px;
        z-index: 9999;
    }

    .custom-select__option--is-focused {
        background-color: #f0f0f0;
    }

    .custom-select__option--is-selected {
        background-color: #007bff;
        color: white;
    }

    .custom-placeholder-required::after {
        content: " *";
        color: red;
        font-weight: bold;
        position: absolute;
        margin-left: 5px; 
    }
`;
