import React, { Component } from 'react';
import firebase from 'firebase';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.renderLoginButton = this.renderLoginButton.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user })
    });
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout() {
    firebase.auth().signOut()
      .then(response => console.log(`ha salido`))
      .catch(error => console.error(`Error ${error.code}: ${error.message}`));
  }

  renderLoginButton() {
    if (this.state.user) {
      return (
        <div>
          <img src={this.state.user.photoURL} alt={this.state.user.displayName} width="100px" />
          <p>Hola {this.state.user.displayName}</p>
          <button type="button" onClick={this.handleLogout}>Salir</button>
        </div>
      );
    } else {
      //Si no lo está
      return (
        <button onClick={this.handleAuth}>Login con Google</button>
      );
    }

  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Pseudogram</h2>
        </div>
        <div>
          {this.renderLoginButton()}
        </div>
      </div>
    );
  }
}

export default App;
