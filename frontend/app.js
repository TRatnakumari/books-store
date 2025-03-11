const apiUrl = 'http://localhost:5000/api/books';
let editingBookId = null; // Store the ID of the book being edited

// Fetch and display books
async function loadBooks() {
  const response = await fetch(apiUrl);
  const books = await response.json();

  const bookList = document.getElementById('book-list');
  bookList.innerHTML = '';  // Clear the current book list

  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.innerHTML = `
      <h3>${book.title}</h3>
      <p>Author: ${book.author}</p>
      <p>Genre: ${book.genre}</p>
      <p>Price: $${book.price}</p>
      <p>${book.description}</p>
      <button onclick="editBook('${book._id}')">Edit</button>
      <button onclick="deleteBook('${book._id}')">Delete</button>
    `;
    bookList.appendChild(bookCard);
  });
}

// Add new book with frontend validation
document.getElementById('add-book-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Frontend validation
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const genre = document.getElementById('genre').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const description = document.getElementById('description').value.trim();

  if (!title || !author || !genre || isNaN(price) || !description) {
    alert('All fields are required, and price must be a number.');
    return;
  }

  const newBook = {
    title,
    author,
    genre,
    price,
    description
  };

  // POST request to add the new book
  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newBook)
  });

  loadBooks();
  document.getElementById('add-book-form').reset();
});

// Edit a book
function editBook(bookId) {
  fetch(`${apiUrl}/${bookId}`)
    .then(response => response.json())
    .then(book => {
      // Populate the edit form with the book's current details
      document.getElementById('title').value = book.title;
      document.getElementById('author').value = book.author;
      document.getElementById('genre').value = book.genre;
      document.getElementById('price').value = book.price;
      document.getElementById('description').value = book.description;

      // Change form mode to Edit
      document.getElementById('add-book-form').style.display = 'none';
      document.getElementById('edit-book-form').style.display = 'block';

      // Store the ID of the book being edited
      editingBookId = bookId;

      // Change the submit button functionality to update the book
      document.getElementById('update-book-btn').onclick = async function () {
        const updatedTitle = document.getElementById('title').value.trim();
        const updatedAuthor = document.getElementById('author').value.trim();
        const updatedGenre = document.getElementById('genre').value.trim();
        const updatedPrice = parseFloat(document.getElementById('price').value);
        const updatedDescription = document.getElementById('description').value.trim();

        if (!updatedTitle || !updatedAuthor || !updatedGenre || isNaN(updatedPrice) || !updatedDescription) {
          alert('All fields are required, and price must be a number.');
          return;
        }

        const updatedBook = {
          title: updatedTitle,
          author: updatedAuthor,
          genre: updatedGenre,
          price: updatedPrice,
          description: updatedDescription
        };

        // PUT request to update the existing book
        await fetch(`${apiUrl}/${editingBookId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedBook)
        });

        loadBooks();
        document.getElementById('edit-book-form').reset();
        document.getElementById('edit-book-form').style.display = 'none';
        document.getElementById('add-book-form').style.display = 'block';  // Show Add form again
      };
    });
}

// Cancel edit action
document.getElementById('cancel-edit-btn').addEventListener('click', () => {
  document.getElementById('edit-book-form').reset();
  document.getElementById('edit-book-form').style.display = 'none';
  document.getElementById('add-book-form').style.display = 'block';  // Show Add form again
});

// Delete a book
async function deleteBook(bookId) {
  const confirmed = confirm('Are you sure you want to delete this book?');
  if (confirmed) {
    await fetch(`${apiUrl}/${bookId}`, {
      method: 'DELETE'
    });
    loadBooks();
  }
}

// Load books initially
loadBooks();
