function fetchBooks() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:5000/books', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const books = JSON.parse(xhr.responseText);
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = `<tr>
                <th>#</th>
                <th>Cím</th>
                <th>Szerző</th>
                <th>Kiadás éve</th>
                <th>ISBN szám</th>
            </tr>`;
            
            books.forEach(book => {
                const row = document.createElement('tr');
                fetchAuthors(book.book_id, function(authors) {
                    row.innerHTML = `
                        <td>${book.book_id}</td>
                        <td class="book-title">${book.title}</td>
                        <td>${authors}</td>
                        <td>${book.publish_year}</td>
                        <td class="book-isbn">${book.isbn}</td>
                    `;
                    bookList.appendChild(row);
                });
            });
        } else {
            console.error('Error fetching books');
        }
    };
    xhr.onerror = function () {
        console.error('Request error');
    };
    xhr.send();
}

function fetchAuthors(bookID, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:5000/authorsOf/${bookID}`, true);
    xhr.onload = function () {
        if (xhr.status === 202 || xhr.status === 200) {
            const authors = JSON.parse(xhr.responseText);
            let authorNames = "";
            authors.forEach(author => {
                authorNames += `${author.name}, `;
            });
            callback(authorNames.slice(0, -2)); 
        } else if (xhr.status === 203) {
            callback('Nincsenek szerzők');
        } else {
            console.error('Error fetching authors');
        }
    };
    xhr.onerror = function () {
        console.error('Request error');
    };
    xhr.send();
}


fetchBooks();
