import React, { Component } from "react";

class Profile extends Component {
  render() {
    const { user } = this.props;

    return <h1>Howdy {user.name}!</h1>;
  }
}

export default Profile;
