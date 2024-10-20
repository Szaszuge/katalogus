// Szerzők displayelése
async function fetchAuthors() {
    const response = await fetch('http://localhost:5000/authors');
    const authors = await response.json();

    console.log(authors); // Log the authors to check their structure

    const authorList = document.getElementById('author-list');
    authorList.innerHTML = `
        <tr>
            <th>#</th>
            <th>Név</th>
            <th>Születési Dátum</th>
            <th>Műveletek</th>
        </tr>`;

    authors.forEach(author => {
        const formattedDate = new Date(author.birth_date).toLocaleDateString('hu-HU');

        // Check property names here
        console.log(author); // Log individual author object

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${author.id || author.author_id}</td> <!-- Use the correct property name -->
            <td>${author.name}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-warning">Módosítás</button>
                <button class="btn btn-danger" onclick="deleteAuthor(${author.id || author.author_id})">Törlés</button>
            </td>`;
        authorList.appendChild(row);
    });
}

// Szerző törlése funkció
async function deleteAuthor(authorId) {
    const response = await fetch(`http://localhost:5000/authors/${authorId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Szerző sikeresen törölve!');
        fetchAuthors(); // Refresh the list
    } else {
        alert('Probléma a szerző törlése közben!');
    }
}

// Új szerző hozzáadása
document.getElementById('add-author-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nev = document.getElementById('nev').value;
    const szuletesi_datum = document.getElementById('szuletesi_datum').value;

    const data = {
        name: nev,
        birth_date: szuletesi_datum
    };

    try {
        const response = await fetch('http://localhost:5000/authors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Szerző sikeresen hozzáadva!');
            document.getElementById('add-author-form').reset(); 
            fetchAuthors(); 
        } else {
            const errorMessage = await response.text();
            alert(`Hiba: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Hiba:', error);
        alert('Probléma a szerző hozzáadása közben!');
    }
});

fetchAuthors();
