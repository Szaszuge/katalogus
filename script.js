async function fetchBooks() {
    const response = await fetch('http://localhost:5000/books'); 
    const books = await response.json();
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = `<tr>
    <th >#</th>
    <th >Cím</th>
    <th >Szerző</th>
    <th >Kiadás éve</th>
    <th >ISBN szám</th>
</tr>`;
    
    books.forEach(book => {
        const row = document.createElement('tr');
        let authors = fetchAuthors(book.book_id);
        console.log(`authors`)
        row.innerHTML = `
            <td>${book.book_id}</td>
            <td class="book-title">${book.title}</td>
            <td>${authors}</td>
            <td>${book.publish_year}</td>
            <td class="book-isbn">${book.isbn}</td>
        `;
        bookList.appendChild(row);
    });
}
async function fetchAuthors(bookID) {
    const response = await fetch(`http://localhost:5000/authorsOf/${bookID}`); 
    const authors = await response.json();
    let valasz = "";
    authors.forEach(author => {
        valasz += `${author.name}, `
    })
    console.log(`${valasz}`);
    return (valasz);
}
fetchBooks();
