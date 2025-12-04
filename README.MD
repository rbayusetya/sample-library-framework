## Brief Project Explanation

This is a RESTful API built to manage a collection of books, including functionality for CRUD operations, searching, filtering (by borrow status), and pagination. The project is implemented using Express.js and TypeScript.

## Current Project Structures :

The project follows a Separation of Concerns (SoC) architecture to keep the data logic, API routing, and type definitions strictly separated.
```
/library-api-express
├── node_modules/         
├── package.json          # Project dependencies and start script
├── tsconfig.json         # TypeScript compiler configuration
├── server.ts             # API ROUTER / HTTP LAYER (Controller)
├── interfaces/
│   ├── domain.ts         # Core application types (IBook, IPaginationResult)
│   └── http.ts           # HTTP-specific request/response types (IBookParams, IBookQuery)
└── model/
    └── bookRepository.ts # DATA LOGIC / BUSINESS LAYER (Repository)
```

## API Documentation :
| HTTP Method | Path | Description |
|:------------| :--- | :--- |
| GET|/api/books|To trigger List/Search/Filter/Paginate books, on success it will return 200 OK + IBookResponse object.|
| GET|/api/books/:id|To return a single book by ID, on success it will return 200 OK + IBook object.|
| POST|/api/books/|To trigger creation of new book, it will request IBookCreationData, and return 201 Created + new IBook object.|
| PUT|/api/books:id|To update an existing book, it will request IBookUpdateData, and return 200 OK + updated IBook object.|
| DELETE|/api/books:id|To remove a single book by ID, on success it will return 204 No Content.|


### Search, Filtering & Pagination (GET /api/books)

The listing endpoint supports combining search terms using query parameters:
|Parameter|Type|Purpose|Example|
|:---|:---|:---|:---|
|title|string|Partial match search on book title.|?title=Gatsby|
|author|string|Partial match search on author name.|?author=Tolkien|
|year|string|Exact match filter on year of release.|?year=1937|
|isBorrowed|string|Filter by borrow status (true or false).|?isBorrowed=true|
|page|string|Current page number (defaults to 1).|?page=2|
|size|string|Items per page (defaults to 10).|?size=5|

## Why do I use this specific framework and language?

Firstly, for the language selection, I want to challenge myself to use another language other than my comfort programming language which is Java. But after writing in JavaScript, I get a little bit irritated without type-safe approach so I opt-in to use TypeScript as I still want it to be Node based project.

Second, for the framework, its just Express JS is fast to configure, serves well in a small scoped project like this, no need to add more complexity in this project, as long as the perfomance figure is good, and the project itself is easily maintainable. 

## Instruction on how to run the Application:

1. open terminal on root project folder
2. npm install
3. npm start

Open the base endpoint in this address: http://localhost:3000/api/books

