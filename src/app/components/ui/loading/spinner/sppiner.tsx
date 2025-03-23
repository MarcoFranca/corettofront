// components/Spinner.tsx
import React from 'react';
import styles from './spinner.module.css';

interface SpinnerProps {
    text?: string; // Prop opcional para o texto
}

const Spinner: React.FC<SpinnerProps> = ({ text = "Carregando..." }) => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>{text}</p>
        </div>
    );
};

export default Spinner;
