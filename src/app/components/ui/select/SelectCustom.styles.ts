import styled from "styled-components";

export const SelectWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export const Label = styled.label`
    font-weight: 600;
    color: #333;

    span {
        color: red;
        margin-left: 3px;
    }
`;

export const ErrorMessage = styled.p`
    color: red;
    font-size: 12px;
    margin-top: 2px;
`;

export const customSelectStyles = (isRequired: boolean) => ({
    control: (provided: any, state: any) => ({
        ...provided,
        borderRadius: "5px",
        border: `1px solid ${state.isFocused ? "#007bff" : "#ccc"}`,
        boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 123, 255, 0.2)" : "none",
        "&:hover": {
            borderColor: "#007bff",
        },
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontStyle: "italic",
        color: "#999", // 🔥 Cor normal do placeholder
        position: "relative", // Permite pseudo-elemento
        "&::after": isRequired
            ? {
                content: "' *'",
                color: "red",
                fontWeight: "bold",
            }
            : {}, // 🔥 Adiciona o `*` apenas se for obrigatório
    }),
    menu: (provided: any) => ({
        ...provided,
        borderRadius: "5px",
        zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#007bff" : state.isFocused ? "#f0f0f0" : "white",
        color: state.isSelected ? "white" : "black",
    }),
});