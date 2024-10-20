// Könyvek displayelése
async function fetchBooks() {
    const response = await fetch('http://localhost:5000/books');
    const books = await response.json();
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = `
        <tr>
            <th>#</th>
            <th>Cím</th>
            <th>Kiadás éve</th>
            <th>ISBN szám</th>
            <th>Műveletek</th>
        </tr>`;

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.book_id}</td>
            <td>${book.title}</td>
            <td>${book.publish_year}</td>
            <td>${book.isbn}</td>
            <td>
                <button class="btn btn-warning">Szerkesztés</button>
                <button class="btn btn-danger" onclick="deleteBook(${book.book_id})">Törlés</button>
            </td>`;
        bookList.appendChild(row);
    });
}

// Könyv törlése funkció
async function deleteBook(bookId) {
    const response = await fetch(`http://localhost:5000/books/${bookId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Könyv sikeresen törölve!');
        fetchBooks(); // Refresh the list
    } else {
        alert('Probléma a könyv törlése közben!');
    }
}

// Új könyv hozzáadása
document.getElementById('add-book-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const cim = document.getElementById('cim').value;
    const kiadas_eve = document.getElementById('kiadas_eve').value;
    const isbn_szam = document.getElementById('isbn_szam').value;

    const data = {
        title: cim,
        publication_year: kiadas_eve,
        isbn: isbn_szam
    };

    try {
        const response = await fetch('http://localhost:5000/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Könyv sikeresen hozzáadva!');
            document.getElementById('add-book-form').reset(); 
            fetchBooks(); 
        } else {
            const errorMessage = await response.text();
            alert(`Error: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Probléma a könyv hozzáadása közben!');
    }
});

fetchBooks();
