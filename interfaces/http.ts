// interfaces/http.ts

import type { IBook, IPaginationResult } from './domain'; // Import core types

// Types for POST/PUT input data
export type IBookCreationData = Omit<IBook, 'id' | 'isBorrowed'>;
export type IBookUpdateData = Partial<IBookCreationData>;

// Types for URL parameters (ALWAYS strings from req.params)
export interface IBookParams {
    id: string;
}

// Types for query strings (ALWAYS strings from req.query)
export interface IBookQuery {
    title?: string;
    author?: string;
    year?: string;
    isBorrowed?: string;
    page?: string;
    size?: string;
}

// Type for the standard list response output
export interface IBookResponse {
    books: IBook[];
    pagination: IPaginationResult;
}

// Common error response type
export interface IErrorResponse {
    error: string;
}