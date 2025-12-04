import express, { Request, Response } from 'express';
import * as bookRepository from './model/bookRepository';
import type {IBook} from './interfaces/domain';
import type {
    IBookResponse,
    IBookCreationData,
    IBookUpdateData,
    IBookParams,
    IBookQuery,
    IErrorResponse
} from './interfaces/http';

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// --- GET /api/books (List, Search, and Pagination) ---

app.get('/api/books', (
    req: Request<{}, IBookResponse | IErrorResponse, {}, IBookQuery>,
    res: Response<IBookResponse | IErrorResponse>
) => {
    // Extract query parameters
    const { title, author, year, isBorrowed, page, size } = req.query;

    const pageNum: number = parseInt(page || '1', 10);
    const pageSize: number = parseInt(size || '10', 10);

    if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({
            error: `Invalid 'page' number provided. Must be a positive integer (e.g., 1, 2, 3...). Received: ${page}`
        });
    }

    if (isNaN(pageSize) || pageSize < 1) {
        return res.status(400).json({
            error: `Invalid 'size' (page size) provided. Must be a positive integer (e.g., 1, 10, 50...). Received: ${size}`
        });
    }
    // Pass filters object to repository
    const filters = { title, author, year, isBorrowed };

    const result = bookRepository.getBooksPaginatedAndFiltered(filters, pageNum, pageSize);

    res.json(result);
});

// --- GET /api/books/:id (Retrieve Single Book) ---

app.get('/api/books/:id', (
    req: Request<IBookParams, IBook | IErrorResponse>,
    res: Response<IBook | IErrorResponse>
) => {
    const { id } = req.params; // id is a string

    // 1. Convert to Number and Check Validity
    const numericId = parseInt(id, 10); // Attempt conversion

    // Check if conversion resulted in NaN OR if the number is less than 1
    if (isNaN(numericId) || numericId < 1) {
        // Example: 'abc' results in NaN. '0' results in 0. Both fail this check.
        return res.status(400).json({
            error: `Invalid Book ID provided: ${id}. Must be a positive integer.`
        });
    }

    // 2. Lookup Book
    const book = bookRepository.getBookById(id);

    // 3. Handle Not Found
    if (!book) {
        return res.status(404).json({ error: `Book with ID ${id} not found` });
    }

    // 4. Success
    res.json(book);
});

// --- POST /api/books (Create New Book) ---

app.post('/api/books', (
    req: Request<{}, IBook | IErrorResponse, IBookCreationData>,
    res: Response<IBook | IErrorResponse>
) => {
    const bookData:IBookCreationData = req.body;

    // Basic validation based on required fields
    if (!bookData.title || !bookData.author || !bookData.isbn) {
        return res.status(400).json({ error: 'Missing required fields: title, author, and isbn are mandatory.' });
    }

    const newBook = bookRepository.addBook(bookData);

    res.status(201).json(newBook);
});

// --- PUT /api/books/:id (Update Existing Book) ---

app.put('/api/books/:id', (
    req: Request<IBookParams, IBook | IErrorResponse, IBookUpdateData>,
    res: Response<IBook | IErrorResponse>
) => {
    const { id } = req.params;
    const updateData = req.body;

    // 1. Validation Check and Conversion
    const numericId = parseInt(id, 10); // Attempt conversion

    // Check if conversion resulted in NaN OR if the number is less than 1
    if (isNaN(numericId) || numericId < 1) {
        // Example: 'abc' results in NaN. '0' results in 0. Both fail this check.
        return res.status(400).json({
            error: `Invalid Book ID provided: ${id}. Must be a positive integer.`
        });
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No update data provided.' });
    }

    // 2. Update Book (Pass the numeric ID, which is validated)
    const updatedBook = bookRepository.updateBook(numericId, updateData);

    if (!updatedBook) {
        return res.status(404).json({ error: `Book with ID ${id} not found` });
    }

    res.json(updatedBook);
});

// --- DELETE /api/books/:id (Delete Book) ---

app.delete('/api/books/:id', (
    req: Request<IBookParams, {}, {}, {}>,
    res: Response<{} | IErrorResponse>
) => {
    const { id } = req.params;

    // 1. Validation Check and Conversion
    const numericId:number = parseInt(id, 10);

    if (isNaN(numericId) || numericId < 1) {
        return res.status(400).json({
            error: `Invalid Book ID provided: ${id}. Must be a positive integer.`
        });
    }

    // 2. Delete Book (Pass the validated ID)
    const wasDeleted:boolean = bookRepository.deleteBook(numericId);

    if (!wasDeleted) {
        return res.status(404).json({ error: `Book with ID ${id} not found` });
    }

    // 204 No Content - the response body is empty
    res.status(204).send();
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`\nTypeScript Library API server running at http://localhost:${PORT}`);
    console.log(`\nEndpoints: /api/books (GET, POST, PUT, DELETE, Search/Pagination)`);
});