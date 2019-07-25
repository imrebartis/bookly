import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BooksTable from "./booksTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import SearchBox from "./searchBox";
import { getBooks, deleteBook } from "../services/bookService";
import { getGenres } from "../services/genreService.js";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import auth from "../services/authService";

class Books extends Component {
  state = {
    books: [],
    genres: [],
    currentPage: 1,
    pageSize: 5,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];
    const { data: books } = await getBooks();
    this.setState({ books, genres });
  }

  handleDelete = async book => {
    const originalBooks = this.state.books;
    const books = originalBooks.filter(b => b._id !== book._id);
    this.setState({ books });

    try {
      await deleteBook(book._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This book has already been deleted.");

      this.setState({ books: originalBooks });
    }
  };

  handleLike = book => {
    if (!auth.getCurrentUser()) {
      toast("You need to be logged in.");
    } else {
      const books = [...this.state.books];
      const index = books.indexOf(book);
      books[index] = { ...books[index] };
      books[index].liked = !books[index].liked;
      this.setState({ books });
    }
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({
      selectedGenre: genre,
      searchQuery: "",
      currentPage: 1
    });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      books: allBooks
    } = this.state;

    let filtered = allBooks;
    if (searchQuery)
      filtered = allBooks.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allBooks.filter(b => b.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const books = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: books };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    const { totalCount, data: books } = this.getPagedData();

    return (
      <div className="row">
        <aside className="sidebar">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </aside>
        <div className="main-content">
          {user && user.isAdmin && (
            <Link
              to={"/books/new"}
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Book
            </Link>
          )}
          <p>Showing {totalCount} books in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <BooksTable
            books={books}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Books;
