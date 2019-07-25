import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getGenres } from "../services/genreService";
import { getBook, saveBook } from "../services/bookService";

class BookForm extends Form {
  state = {
    data: {
      title: "",
      author: "",
      genreId: "",
      numberInStock: ""
    },
    genres: [],
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Title"),
    author: Joi.string()
      .required()
      .label("Author"),
    genreId: Joi.string()
      .required()
      .label("Genre"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number in stock")
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateBook() {
    try {
      const bookId = this.props.match.params.id;
      if (bookId === "new") return;
      const { data: book } = await getBook(bookId);
      this.setState({ data: this.mapToViewModel(book) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateBook();
  }

  mapToViewModel = book => {
    return {
      _id: book._id,
      title: book.title,
      author: book.author,
      genreId: book.genre._id,
      numberInStock: book.numberInStock
    };
  };

  doSubmit = async () => {
    await saveBook(this.state.data);

    this.props.history.push("/books");
  };

  render() {
    return (
      <React.Fragment>
        <h1>Book Form</h1>
        <div>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("title", "Title")}
            {this.renderInput("author", "Author", "author")}
            {this.renderSelect("genreId", "Genre", this.state.genres)}
            {this.renderInput("numberInStock", "Number in Stock", "number")}
            {this.renderButton("Save")}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default BookForm;
