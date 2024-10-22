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
                
                
                row.innerHTML = `
                    <td>${book.book_id}</td>
                    <td class="book-title">${book.title}</td>
                    <td class="author-names">Betöltés...</td> 
                    <td>${book.publish_year}</td>
                    <td class="book-isbn">${book.isbn}</td>
                `;
                
                bookList.appendChild(row);
                
                
                fetchAuthors(book.book_id, row);
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

function fetchAuthors(bookID, row) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:5000/authorsOf/${bookID}`, true);
    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 202) {
            const authors = JSON.parse(xhr.responseText);

            if (authors.length > 0) {
                
                const authorNames = authors.map(author => author.name).join(', ');
                row.querySelector('.author-names').textContent = authorNames;
            } else {
                row.querySelector('.author-names').textContent = 'Nincsenek szerzők';
            }
        } else {
            row.querySelector('.author-names').textContent = 'Hiba a szerzők betöltésekor';
        }
    };
    xhr.onerror = function () {
        row.querySelector('.author-names').textContent = 'Hiba a szerzők betöltésekor';
    };
    xhr.send();
}

document.addEventListener('DOMContentLoaded', fetchBooks);
