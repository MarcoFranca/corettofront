import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
    return (
        <button className={`${styles.button} ${styles[variant]}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
