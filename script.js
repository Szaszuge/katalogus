async function fetchBooks() {
    const response = await fetch('http://localhost:5000/books');
    const books = await response.json();
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    books.forEach(books => {
        const div = document.createElement('div');
        div.textContent = `${books.book_id} ${books.title} (${books.publish_year}) - ISBN: ${books.isbn}`;
        bookList.appendChild(div);
    });
}

fetchBooks();
