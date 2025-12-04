import type {IBook} from '../interfaces/domain';
import type {IBookResponse, IBookUpdateData} from '../interfaces/http';

// Explicitly define the type for the books array
let books: IBook[] = [
    // Existing and Core Entries
    { id: 101, title: "The Great Gatsby", author: "F. Scott Fitzgerald", yearOfRelease: 1925, isbn: "978-0743273565", isBorrowed: false },
    { id: 102, title: "To Kill a Mockingbird", author: "Harper Lee", yearOfRelease: 1960, isbn: "978-0061120084", isBorrowed: true },
    { id: 103, title: "1984", author: "George Orwell", yearOfRelease: 1949, isbn: "978-0451524935", isBorrowed: false },

    // Fantasy and Sci-Fi
    { id: 104, title: "The Hobbit", author: "J.R.R. Tolkien", yearOfRelease: 1937, isbn: "978-0618260300", isBorrowed: false },
    { id: 105, title: "Dune", author: "Frank Herbert", yearOfRelease: 1965, isbn: "978-0441172719", isBorrowed: true },
    { id: 106, title: "A Game of Thrones", author: "George R.R. Martin", yearOfRelease: 1996, isbn: "978-0553103540", isBorrowed: false },
    { id: 107, title: "The Fellowship of the Ring", author: "J.R.R. Tolkien", yearOfRelease: 1954, isbn: "978-0618346257", isBorrowed: true },

    // Modern Classics
    { id: 108, title: "A Thousand Splendid Suns", author: "Khaled Hosseini", yearOfRelease: 2007, isbn: "978-1594489501", isBorrowed: false },
    { id: 109, title: "The Martian", author: "Andy Weir", yearOfRelease: 2011, isbn: "978-0804139021", isBorrowed: true },
    { id: 110, title: "Where the Crawdads Sing", author: "Delia Owens", yearOfRelease: 2018, isbn: "978-0735219090", isBorrowed: false },

    // Mystery and Thrillers
    { id: 111, title: "Gone Girl", author: "Gillian Flynn", yearOfRelease: 2012, isbn: "978-0307588371", isBorrowed: false },
    { id: 112, title: "The Silent Patient", author: "Alex Michaelides", yearOfRelease: 2019, isbn: "978-1250301691", isBorrowed: true },

    // Historical Fiction
    { id: 113, title: "The Nightingale", author: "Kristin Hannah", yearOfRelease: 2015, isbn: "978-0312577239", isBorrowed: false },
    { id: 114, title: "The Book Thief", author: "Markus Zusak", yearOfRelease: 2005, isbn: "978-0375842207", isBorrowed: false },

    // Short Stories and Essays
    { id: 115, title: "The Old Man and the Sea", author: "Ernest Hemingway", yearOfRelease: 1952, isbn: "978-0684801223", isBorrowed: true },
    { id: 116, title: "Of Mice and Men", author: "John Steinbeck", yearOfRelease: 1937, isbn: "978-0140177398", isBorrowed: false },

    // Young Adult (Recent Years)
    { id: 117, title: "The Hunger Games", author: "Suzanne Collins", yearOfRelease: 2008, isbn: "978-0439023528", isBorrowed: false },
    { id: 118, title: "The Maze Runner", author: "James Dashner", yearOfRelease: 2009, isbn: "978-0385737944", isBorrowed: true },

    // Repeat Author for Search Testing
    { id: 119, title: "The Two Towers", author: "J.R.R. Tolkien", yearOfRelease: 1954, isbn: "978-0618346264", isBorrowed: false },
    { id: 120, title: "Fahrenheit 451", author: "Ray Bradbury", yearOfRelease: 1953, isbn: "978-1451673319", isBorrowed: false }
];
let nextBookId = Math.max(...books.map(b => b.id)) + 1;


// --- Helper Functions ---

// Use IBook type for function parameters and return values
function createBook(data: Omit<IBook, 'id' | 'isBorrowed'>): IBook {
    return {
        id: nextBookId++,
        title: data.title,
        author: data.author,
        yearOfRelease: data.yearOfRelease,
        isbn: data.isbn,
        isBorrowed: false
    };
}

// --- CRUD Functions ---

/**
 * Retrieves a book by its ID (handles string or number input).
 * @param {string | number} id - The book ID, which may be a string from a route parameter.
 */
function getBookById(id: string | number): IBook | undefined {
    // Ensure the ID is parsed as an integer for safe comparison
    const bookId:number = typeof id === 'string' ? parseInt(id, 10) : id;

    // Safety check: if parsing results in NaN, return undefined
    if (isNaN(bookId)) {
        return undefined;
    }

    // Use .find() to locate the book
    return books.find(book => book.id === bookId);
}

/**
 * Adds a new book to the collection.
 */
function addBook(bookData: Omit<IBook, "id" | "isBorrowed">): IBook {
    const newBook = createBook(bookData);
    books.push(newBook);
    return newBook;
}

/**
 * Updates an existing book.
 * Returns the updated book or null if not found.
 */
function updateBook(id: number, updateData: IBookUpdateData):IBook | undefined | null {
    const bookId:number = id;
    const index:number = books.findIndex(b => b.id === bookId);

    if (index === -1) {
        return null; // Book not found
    }

    // Merge old data with new data (prevents overwriting ID and isBorrowed status)
    books[index] = {
        ...books[index],
        title: updateData.title || books[index].title,
        author: updateData.author || books[index].author,
        yearOfRelease: updateData.yearOfRelease || books[index].yearOfRelease,
        isbn: updateData.isbn || books[index].isbn,
        // isBorrowed status can also be updated if needed, but not done here for simplicity
    };

    return books[index];
}

/**
 * Deletes a book by ID.
 * Returns true if deleted, false if not found.
 */
function deleteBook(id: number) {
    const bookId:number = id;
    const initialLength:number = books.length;

    // Filter out the book with the given ID
    books = books.filter(b => b.id !== bookId);

    // If the length changed, a book was deleted
    return books.length < initialLength;
}

// --- Pagination and Search Function ---

/**
 * Filters and paginates the book list.
 * @param {object} filters - Object containing search parameters (title, author, year, isBorrowed).
 * @param {number} page - Current page number (1-indexed).
 * @param {number} pageSize - Number of items per page.
 */
// Explicitly define the return type for clarity
function getBooksPaginatedAndFiltered(filters: any, page: number, pageSize: number): IBookResponse {
    let filteredBooks : IBook[] = [...books];

    // 1. Apply Search Filters (Title, Author, Year, isBorrowed)
    const { title, author, year, isBorrowed } = filters;

    if (title) {
        const titleLower = title.toLowerCase();
        filteredBooks = filteredBooks.filter(b => b.title.toLowerCase().includes(titleLower));
    }

    if (author) {
        const authorLower = author.toLowerCase();
        filteredBooks = filteredBooks.filter(b => b.author.toLowerCase().includes(authorLower));
    }

    if (year) {
        filteredBooks = filteredBooks.filter(b => String(b.yearOfRelease) === String(year));
    }

    if (isBorrowed !== undefined) {
        // Convert the string parameter (e.g., "true", "false") to a boolean
        const isBorrowedBool = isBorrowed.toLowerCase() === 'true';

        filteredBooks = filteredBooks.filter(b => b.isBorrowed === isBorrowedBool);
    }

    // 2. Apply Pagination
    const totalItems = filteredBooks.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Calculate start and end indices for the current page
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    return {
        books: paginatedBooks,
        pagination: {
            totalItems,
            totalPages,
            currentPage: page,
            pageSize
        }
    };
}

// --- Export the functions ---
export {
    getBooksPaginatedAndFiltered,
    getBookById,
    addBook,
    updateBook,
    deleteBook
};