//--- Import the necessary classes ---
const Library = require('../src/library');
const Book = require('../src/book');

//--- Top-level describe block for the Library Management System tests ---
describe("Library Management System", () => {
    let library;

    // --- Initialize a new Library instance before each test ---
    beforeEach(() => {
        library = new Library();
    });


    test('should initialize a library with an empty books array', () => {
        expect(library.books).toEqual([]);
    });

    //--- Nested describe block for testing book addition ---
    describe('test cases for added book', () => {

        test("should add book and return added book", () => {
            let book1 = new Book(123456, 'Introduction to the Theory of Computation', 'Michael Sipser', 2012);
            library.addBook(book1);
            expect(library.books).toContain(book1);
        });

        test("should not add book with any missing field(isbn,title,author,publicationYear)", () => {
            let book1 = new Book(123456, '', 'Michael Sipser', 2012);
            expect(() => library.addBook(book1)).toThrow('All fields (ISBN, title, author, publicationYear) are required');
        });

        test("should not add a book with an duplicate ISBN which is already present", () => {
            let book1 = new Book(123456, 'Introduction to the Theory of Computation', 'Michael Sipser', 2012);
            library.addBook(book1);
            expect(() => library.addBook(book1)).toThrow('The same ISBN number book is already present');
        });

        test("should not add a book if ISBN number length is less than 6", () => {
            let book1 = new Book(123, 'Introduction to the Theory of Computation', 'Michael Sipser', 2012);
            expect(() => library.addBook(book1)).toThrow('The ISBN number length should be greater than 5');
        });

        test("should not enter the invalid publicationYear in the past", () => {
            let book1 = new Book(123456, 'Introduction to the Theory of Computation', 'Michael Sipser', 20120);
            expect(() => library.addBook(book1)).toThrow('Write the valid publication year in the past');
        });
    });

    //--- Nested describe block for testing book borrowing ---
    describe("test cases for borrow book", () => {

        test("should not borrowed book if it's not added to the library", () => {
            expect(() => library.borrowBook(123456)).toThrow('Book not found');
        });

        test("should not borrowed book if it's not availabe", () => {
            let book1 = new Book(123456, 'Introduction to the Theory of Computation', 'Michael Sipser', 2012);
            library.addBook(book1);
            library.borrowBook(123456);
            expect(() => library.borrowBook(123456)).toThrow('Book is already borrowed');
        });

        test("should borrowed book if it's availabe", () => {
            let book1 = new Book(123456, 'Introduction to the Theory of Computation', 'Michael Sipser', 2012);
            library.addBook(book1);
            expect(library.borrowBook(123456)).toBe('Book borrowed successfully');
        });
    });

    //--- Nested describe block for testing book return ---
    describe('test cases for return book', () => {

        test("should not return book if it's not available in the library", () => {
            expect(() => library.returnBook(123456)).toThrow('Book not found');
        });

        test("should not return book if it's not borrowed", () => {
            let book1 = new Book(123456, 'Introduction to the Theory of Computation', 'Michael Sipser', 2012);
            library.addBook(book1);
            expect(() => library.returnBook(book1.isbn)).toThrow('Book was not borrowed');
        });

        test("should  return book if it's borrowed", () => {
            let book1 = new Book(123456, 'Introduction to the Theory of Computation', 'Michael Sipser', 2012);
            library.addBook(book1);
            library.borrowBook(book1.isbn);
            expect(library.returnBook(book1.isbn)).toBe('Book is return successfully');
        });
    });

    //--- Nested describe block for testing viewing available books ---
    describe('test cases for the View Available Books', () => {

        let book1;
        let book2;

        //--- Initialize books before each test ---
        beforeEach(() => {
            book1 = new Book(123456, 'Introduction to the Theory of Computation', 'Michael Sipser', 2012);
            book2 = new Book(123457, 'A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 2008);
        });

        test('should show all the available books', () => {
            library.addBook(book1);
            library.addBook(book2);
            library.borrowBook(123456);

            const availableBooks = library.showAvailableBooks();
            expect(availableBooks.length).toBe(1);
            expect(availableBooks[0].isbn).toBe(123457);
        });

        test('should show no available books when all are borrowed', () => {

            library.addBook(book1);
            library.addBook(book2);
            library.borrowBook(123456);
            library.borrowBook(123457);

            const availableBooks = library.showAvailableBooks();
            expect(availableBooks.length).toBe(0);
        });

        test('should show all books as available if none are borrowed', () => {

            library.addBook(book1);
            library.addBook(book2);

            const availableBooks = library.showAvailableBooks();
            expect(availableBooks.length).toBe(2);
            expect(availableBooks[0].isbn).toBe(123456);
            expect(availableBooks[1].isbn).toBe(123457);
        });
    });
});