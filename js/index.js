const books = [],
  RENDER_EVENT = "render-book",
  SAVED_EVENT = "saved-book",
  STORAGE_KEY = "DATA_BOOK";
function isStorageExists() {
  return (
    "undefined" != typeof Storage ||
    (alert("Browser anda tidak mendukung local storage"), !1)
  );
}
function loadDataFromStorage() {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (null !== data) for (const book of data) books.push(book);
  document.dispatchEvent(new Event(RENDER_EVENT));
}
function updateDataFromStorage() {
  isStorageExists() &&
    (localStorage.setItem(STORAGE_KEY, JSON.stringify(books)),
    document.dispatchEvent(new Event(SAVED_EVENT)));
}
function findBook(bookId) {
  for (const book of books) if (book.id === bookId) return book;
  return null;
}
function findBookIndex(bookId) {
  let index = 0;
  for (const book of books) {
    if (book.id === bookId) return index;
    index++;
  }
  return -1;
}
const addBook = () => {
    const title = document.getElementById("inputBookTitle").value,
      author = document.getElementById("inputBookAuthor").value,
      year = document.getElementById("inputBookYear").value,
      isComplete = document.getElementById("inputBookIsComplete").checked,
      newBook = {
        id: +new Date(),
        title: title,
        author: author,
        year: parseInt(year),
        isComplete: isComplete,
      };
    books.push(newBook),
      document.dispatchEvent(new Event(RENDER_EVENT)),
      updateDataFromStorage();
  },
  makeBook = (book) => {
    const bookElement = document.createElement("article");
    return (
      bookElement.classList.add("book_item"),
      (bookElement.innerHTML = ""),
      (bookElement.innerHTML = book.isComplete
        ? `
          <h3>${book.title}</h3>
          <p>Penulis: ${book.author}</p>
          <p>Tahun: ${book.year}</p>
  
          <div class="action">
            <button class="green" onclick= "moveToUnCompleted(${book.id})">- Belum Selesai</button>
            <button class="red" onclick= "removeBookFromBookShelf(${book.id})"><i class="fa-solid fa-trash"></i></button>
          </div>
          `
        : `
      <h3>${book.title}</h3>
      <p>Penulis: ${book.author}</p>
      <p>Tahun: ${book.year}</p>
  
      <div class="action">
        <button class="green" onclick="moveToCompleted(${book.id})">+ Selesai dibaca</button>
        <button class="red" onclick ="removeBookFromBookShelf(${book.id})"><i class="fa-solid fa-trash"></i></button>
      </div>
      `),
      bookElement
    );
  },
  moveToCompleted = (bookId) => {
    const book = findBook(bookId);
    null == book ||
      ((book.isComplete = !0),
      document.dispatchEvent(new Event(RENDER_EVENT)),
      updateDataFromStorage());
  },
  moveToUnCompleted = (bookId) => {
    const book = findBook(bookId);
    null == book ||
      ((book.isComplete = !1),
      document.dispatchEvent(new Event(RENDER_EVENT)),
      updateDataFromStorage());
  },
  removeBookFromBookShelf = (bookId) => {
    const index = findBookIndex(bookId);
    -1 === index ||
      (books.splice(index, 1),
      document.dispatchEvent(new Event(RENDER_EVENT)),
      updateDataFromStorage());
  },
  searchBook = (query) => {
    const bookItems = document.querySelectorAll(".book_item");
    for (const bookElement of bookItems) {
      const title = bookElement.querySelector("h3").textContent.toUpperCase(),
        author = bookElement
          .querySelector("p:nth-of-type(1)")
          .textContent.toUpperCase(),
        year = bookElement
          .querySelector("p:nth-of-type(2)")
          .textContent.toUpperCase(),
        found =
          title.includes(query) ||
          author.includes(query) ||
          year.includes(query);
      bookElement.style.display = found ? "" : "none";
    }
  };
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("inputBook").addEventListener("submit", (event) => {
    event.preventDefault(), addBook();
  }),
    document.getElementById("searchBookTitle"),
    document.addEventListener("keyup", (event) => {
      const query = event.target.value.toUpperCase();
      searchBook(query);
    }),
    document
      .getElementById("searchBook")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const query = document
          .getElementById("searchBookTitle")
          .value.toUpperCase();
        searchBook(query);
      }),
    isStorageExists() && loadDataFromStorage();
}),
  document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelf = document.getElementById(
        "incompleteBookshelfList"
      ),
      completeBookshelf = document.getElementById("completeBookshelfList");
    (incompleteBookshelf.innerHTML = ""), (completeBookshelf.innerHTML = "");
    for (const book of books) {
      const bookElement = makeBook(book);
      book.isComplete
        ? completeBookshelf.append(bookElement)
        : incompleteBookshelf.append(bookElement);
    }
  }),
  document.addEventListener(SAVED_EVENT, () =>
    console.log(localStorage.getItem(STORAGE_KEY))
  );
