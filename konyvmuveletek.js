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
                <button class="btn btn-warning" onclick="editBook(${book.book_id}, '${book.title}', ${book.publish_year}, '${book.isbn}')">Szerkesztés</button>
                <button class="btn btn-danger" onclick="deleteBook(${book.book_id})">Törlés</button>
            </td>`;
        bookList.appendChild(row);
    });
}

// Könyv szerkesztése funkció
function editBook(id, title, year, isbn) {
    document.getElementById('book-id').value = id;
    document.getElementById('cim').value = title;
    document.getElementById('kiadas_eve').value = year;
    document.getElementById('isbn_szam').value = isbn;

    // Show the update button
    document.getElementById('update-book-button').style.display = 'block';
}

// Könyv módosítása
document.getElementById('update-book-button').addEventListener('click', async function () {
    const id = document.getElementById('book-id').value;

    // Check if an ID is set
    if (!id) {
        alert('Kérjük, válasszon ki egy könyvet a szerkesztéshez!');
        return;
    }

    const title = document.getElementById('cim').value;
    const publication_year = document.getElementById('kiadas_eve').value;
    const isbn = document.getElementById('isbn_szam').value;

    const data = { title, publication_year, isbn };

    try {
        const response = await fetch(`http://localhost:5000/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Könyv sikeresen módosítva!');
            resetForm(); // Reset form after successful update
            fetchBooks();
        } else {
            const errorMessage = await response.text();
            alert(`Hiba: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Hiba:', error);
        alert('Probléma a könyv módosítása közben!');
    }
});

// Könyv törlése funkció
async function deleteBook(bookId) {
    const response = await fetch(`http://localhost:5000/books/${bookId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Könyv sikeresen törölve!');
        fetchBooks(); 
    } else {
        alert('Probléma a könyv törlése közben!');
    }
}

// Új könyv hozzáadása
document.getElementById('add-book-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('book-id').value;

    const cim = document.getElementById('cim').value;
    const kiadas_eve = document.getElementById('kiadas_eve').value;
    const isbn_szam = document.getElementById('isbn_szam').value;

    const data = {
        title: cim,
        publication_year: kiadas_eve,
        isbn: isbn_szam
    };

    try {
        let response;
        if (id) {
            response = await fetch(`http://localhost:5000/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        } else {
            response = await fetch('http://localhost:5000/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        }

        if (response.ok) {
            alert('Könyv sikeresen hozzáadva!');
            resetForm(); 
            fetchBooks();
        } else {
            const errorMessage = await response.text();
            alert(`Hiba: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Hiba:', error);
        alert('Probléma a könyv hozzáadása közben!');
    }
});

// Reset form and hide update button
function resetForm() {
    document.getElementById('add-book-form').reset();
    document.getElementById('update-book-button').style.display = 'none'; 
    document.getElementById('book-id').value = ''; 
}

fetchBooks();
