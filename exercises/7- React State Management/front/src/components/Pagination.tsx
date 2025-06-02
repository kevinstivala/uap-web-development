import { useUIStore } from "../store/useUIStore";

interface PaginationProps {
  total: number;
}

export const Pagination = ({ total }: PaginationProps) => {
  const offset = useUIStore((state) => state.offset);
  const limit = useUIStore((state) => state.limit);
  const setOffset = useUIStore((state) => state.setOffset);

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const handlePreviousPage = () => {
    const newOffset = offset - limit; // Decrementa el offset
    if (newOffset >= 0) {
      setOffset(newOffset); // Actualiza el offset solo si es válido
    }
  };

  const handleNextPage = () => {
    const newOffset = offset + limit; // Decrementa el offset
    if (newOffset < total) {
      setOffset(newOffset); // Actualiza el offset solo si es válido
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-sm text-gray-600">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
};
