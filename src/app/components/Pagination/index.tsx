import React from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    setItemsPerPage: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   onPageChange,
                                                   itemsPerPage,
                                                   setItemsPerPage,
                                               }) => {
    return (
        <div className={styles.pagination}>
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
            >
                Anterior
            </button>

            <span>Página {currentPage} de {totalPages}</span>

            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Próximo
            </button>

            <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
        </div>
    );
};

export default Pagination;
