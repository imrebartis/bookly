import http from "./httpService";

const apiEndpoint = `/books`;

function bookUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getBooks() {
  return http.get(apiEndpoint);
}

export function getBook(bookId) {
  return http.get(bookUrl(bookId));
}

export function saveBook(book) {
  if (book._id) {
    // avoid directly modifying the book object
    // which is part of the state (see doSubmit)
    const body = {...book};
    delete body._id;
    return http.put(bookUrl(book._id), body);
  }

  return http.post(`${apiEndpoint}`, book);
}

export function deleteBook(bookId) {
  return http.delete(bookUrl(bookId))
}