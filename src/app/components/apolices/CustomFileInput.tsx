import React from 'react';
import styles from './ApoliceForm.module.css';

interface CustomFileInputProps {
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({ onFileChange }) => (
    <div className={styles.formGroup}>
        <label htmlFor="arquivo">Importar Apólice:</label>
        <input type="file" id="arquivo" accept=".pdf" onChange={onFileChange} className={styles.fileInput} />
    </div>
);

export default CustomFileInput;
