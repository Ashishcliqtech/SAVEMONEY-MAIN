import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: number[] = [];
    const half = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        icon={ChevronLeft}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="!px-3"
      />

      {/* First page */}
      {showFirstLast && visiblePages[0] > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(1)}
            className="!px-3"
          >
            1
          </Button>
          {visiblePages[0] > 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Visible pages */}
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onPageChange(page)}
          className="!px-3"
        >
          {page}
        </Button>
      ))}

      {/* Last page */}
      {showFirstLast && visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <Button
            variant={currentPage === totalPages ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="!px-3"
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        icon={ChevronRight}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="!px-3"
      />
    </div>
  );
};