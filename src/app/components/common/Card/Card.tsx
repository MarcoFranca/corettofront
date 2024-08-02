import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    title: string;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>{title}</h3>
            <div className={styles.cardContent}>
                {children}
            </div>
        </div>
    );
};

export default Card;
