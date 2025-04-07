import styled from "styled-components";
import {Space} from "antd";

export const FormContainer = styled(Space).attrs(() => ({
    direction: "vertical",
    size: "middle",
}))`
    width: 100%;

    textarea {
        width: 100%;
        resize: none;
    }

    input, .ant-select {
        width: 100%;
    }
`;