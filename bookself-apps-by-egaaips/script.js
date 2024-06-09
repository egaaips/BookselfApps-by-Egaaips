document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.querySelector('.modal');
    const closeButton = document.querySelector('.close');
    const addBookButton = document.querySelector('.addBookBtn');
    const bookForm = document.getElementById('bookForm');
    const searchInput = document.getElementById('search');

    let isEditMode = false;
    let editIndex = null;

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        resetForm();
    });

    addBookButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = document.getElementById('inputBookYear').value;
        const isComplete = document.getElementById('inputBookIsComplete').checked;

        const book = {
            id: new Date().getTime(),
            title,
            author,
            year: parseInt(year),
            isComplete
        };

        if (isEditMode) {
            updateBookInLocalStorage(editIndex, book);
        } else {
            saveBookToLocalStorage(book);
        }

        displayBooks();
        modal.style.display = 'none';
        resetForm();
    });

    searchInput.addEventListener('input', (e) => {
        displayBooks(e.target.value.toLowerCase());
    });

    function saveBookToLocalStorage(book) {
        let books = localStorage.getItem('books');
        if (books) {
            books = JSON.parse(books);
        } else {
            books = [];
        }
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
        // console.log('Books after saving:', books);
    }

    function getBooksFromLocalStorage() {
        let books = localStorage.getItem('books');
        if (books) {
            return JSON.parse(books);
        } else {
            return [];
        }
    }

    function updateBookInLocalStorage(index, updatedBook) {
        let books = getBooksFromLocalStorage();
        books[index] = updatedBook;
        localStorage.setItem('books', JSON.stringify(books));
    }

    function displayBooks(query = '') {
        const uncompleteBookList = document.querySelector('.uncompleteBookList');
        const completeBookList = document.querySelector('.completeBookList');

        // Clear current list
        uncompleteBookList.innerHTML = '<h2>Belum selesai dibaca</h2>';
        completeBookList.innerHTML = '<h2>Selesai dibaca</h2>';

        const books = getBooksFromLocalStorage();

        books.forEach((book, index) => {
            if (book.title.toLowerCase().includes(query) || 
                book.author.toLowerCase().includes(query) || 
                book.year.toString().includes(query)) {

                const bookCard = document.createElement('div');
                bookCard.classList.add('bookCard');

                bookCard.innerHTML = `
                    <div class="bookInfo">
                        <h2 class="title">${book.title}</h2>
                        <p class="author">${book.author}</p>
                        <p class="year">${book.year}</p>
                    </div>
                    <div class="actions">
                        <button class="move" data-index="${index}">
                            ${book.isComplete ? '<i class="fa-solid fa-arrow-left"></i>' : '<i class="fa-solid fa-circle-check"></i>'}
                        </button>
                        <button class="delete" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="edit" data-index="${index}">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </div>
                `;

                if (book.isComplete) {
                    completeBookList.appendChild(bookCard);
                } else {
                    uncompleteBookList.appendChild(bookCard);
                }

                const deleteButton = bookCard.querySelector('.delete');
                deleteButton.addEventListener('click', () => {
                    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus buku ini?");
                    if (confirmDelete) {
                        deleteBookFromLocalStorage(index);
                        displayBooks(query);
                    }
                });

                const moveButton = bookCard.querySelector('.move');
                moveButton.addEventListener('click', () => {
                    toggleBookCompletion(index);
                    displayBooks(query);
                });

                const editButton = bookCard.querySelector('.edit');
                editButton.addEventListener('click', () => {
                    openEditModal(index);
                });
            }
        });
    }

    function deleteBookFromLocalStorage(index) {
        let books = getBooksFromLocalStorage();
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
    }

    function toggleBookCompletion(index) {
        let books = getBooksFromLocalStorage();
        books[index].isComplete = !books[index].isComplete;
        localStorage.setItem('books', JSON.stringify(books));
    }

    function openEditModal(index) {
        let books = getBooksFromLocalStorage();
        const book = books[index];

        document.getElementById('inputBookTitle').value = book.title;
        document.getElementById('inputBookAuthor').value = book.author;
        document.getElementById('inputBookYear').value = book.year;
        document.getElementById('inputBookIsComplete').checked = book.isComplete;

        isEditMode = true;
        editIndex = index;
        modal.style.display = 'block';
    }

    function resetForm() {
        bookForm.reset();
        isEditMode = false;
        editIndex = null;
    }

    // Display books when the page loads
    displayBooks();
});
