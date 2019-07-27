import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Customers from "./components/customers";
import BookForm from "./components/bookForm";
import Books from "./components/books";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import NavBar from "./components/navBar";
import NotFound from "./components/notFound";
import Profile from "./components/profile";
import ProtectedRoute from "./components/common/protectedRoute";
import RegisterForm from "./components/registerForm";
import SkipNav from "./components/skipNav";
import auth from "./services/authService";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {
    collapse: false
  };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  toggleCollapse = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  render() {
    const { user, collapse } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <SkipNav />
        <NavBar user={user} collapse={collapse} onClick={this.toggleCollapse} />
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute path="/books/:id" component={BookForm} />
            <Route
              path="/books"
              render={props => <Books {...props} user={this.state.user} />}
            />
            <Route path="/customers" component={Customers} />
            <Route
              path="/profile"
              render={props => <Profile {...props} user={this.state.user} />}
            />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/books" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
