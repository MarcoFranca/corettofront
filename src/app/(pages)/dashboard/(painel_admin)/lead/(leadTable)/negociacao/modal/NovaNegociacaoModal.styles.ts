import styled from 'styled-components';
import { Modal, Form, Select, Input } from 'antd';

export const StyledModal = styled(Modal)`
  .ant-modal-header {
    border-bottom: none;
  }

  .ant-modal-title {
    font-weight: 600;
    font-size: 1.25rem;
  }

  .ant-modal-footer {
    padding-top: 1rem;
  }

  .ant-btn-primary {
    background-color: #042a75;
    border-color: #042a75;

    &:hover,
    &:focus {
      background-color: #033192;
      border-color: #033192;
    }
  }
`;

export const StyledForm = styled(Form)`
  margin-top: 1rem;
`;

export const StyledFormItem = styled(Form.Item)`
  .ant-form-item-label > label {
    font-weight: 500;
    color: #333;
  }

  margin-bottom: 1.25rem;
`;

export const StyledSelect = styled(Select)`
  width: 100%;
`;

export const StyledTextArea = styled(Input.TextArea)`
  resize: none;
`;
