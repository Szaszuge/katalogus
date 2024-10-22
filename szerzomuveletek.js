// Fetch authors and display them
async function fetchAuthors() {
    const response = await fetch('http://localhost:5000/authors');
    const authors = await response.json();

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

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${author.id || author.author_id}</td>
            <td>${author.name}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-warning" onclick="editAuthor(${author.id || author.author_id}, '${author.name}', '${author.birth_date}')">Módosítás</button>
                <button class="btn btn-danger" onclick="deleteAuthor(${author.id || author.author_id})">Törlés</button>
            </td>`;
        authorList.appendChild(row);
    });
}

// Editelés funkció
function editAuthor(authorId, authorName, birthDate) {
    document.getElementById('nev').value = authorName;
    document.getElementById('szuletesi_datum').value = new Date(birthDate).toISOString().split('T')[0];


    window.currentEditingAuthorId = authorId;
}

// Szerző törlése funkció
async function deleteAuthor(authorId) {
    const response = await fetch(`http://localhost:5000/authors/${authorId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Szerző sikeresen törölve!');
        fetchAuthors(); 
    } else {
        alert('Probléma a szerző törlése közben!');
    }
}


document.getElementById('add-author-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nev = document.getElementById('nev').value;
    const szuletesi_datum = document.getElementById('szuletesi_datum').value;

    const data = {
        name: nev,
        birth_date: szuletesi_datum
    };

    try {
        let response;
        if (window.currentEditingAuthorId) {

            response = await fetch(`http://localhost:5000/authors/${window.currentEditingAuthorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            window.currentEditingAuthorId = null; 
        } else {

            response = await fetch('http://localhost:5000/authors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        }

        if (response.ok) {
            alert('Szerző sikeresen hozzáadva vagy frissítve!');
            resetForm(); 
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


function resetForm() {
    document.getElementById('add-author-form').reset();
    window.currentEditingAuthorId = null; 
}

fetchAuthors();
