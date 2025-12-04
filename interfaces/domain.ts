// interfaces/domain.ts

export interface IBook {
    id: number; // Stays as number (internal model)
    title: string;
    author: string;
    yearOfRelease: number;
    isbn: string;
    isBorrowed: boolean;
}

// Data structures needed by the repository's logic (e.g., return metadata)
export interface IPaginationResult {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}