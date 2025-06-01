import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import styles from './pagination.module.css';
import { PaginationProps } from '../Types/catalogTypes';

export const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  const [inputPage, setInputPage] = useState('');

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
    }
    setInputPage('');
  };

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`${styles.pageButton} ${1 === currentPage ? styles.active : ''}`}
        >
          1
        </button>,
      );

      if (startPage > 2) {
        pages.push(
          <span key="left-ellipsis" className={styles.ellipsis}>
            <MoreHorizontal size={16} />
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="right-ellipsis" className={styles.ellipsis}>
            <MoreHorizontal size={16} />
          </span>,
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`${styles.pageButton} ${totalPages === currentPage ? styles.active : ''}`}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
        aria-label="Предыдущая страница"
      >
        <ChevronLeft size={18} />
      </button>

      <div className={styles.pages}>{renderPageNumbers()}</div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        aria-label="Следующая страница"
      >
        <ChevronRight size={18} />
      </button>

      {totalPages > 10 && (
        <form onSubmit={handleInputSubmit} className={styles.pageInputForm}>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            placeholder={`${currentPage}`}
            className={styles.pageInput}
            aria-label="Номер страницы"
          />
          <button type="submit" className={styles.goButton}>
            Перейти
          </button>
        </form>
      )}
    </div>
  );
};
