import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      pictures: []
    }

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.renderLoginButton = this.renderLoginButton.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user })
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      })
    })
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout() {
    firebase.auth().signOut()
      .then(response => console.log(`Ha salido`))
      .catch(error => console.error(`Error ${error.code}: ${error.message}`));
  }

  handleUpload(event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`photos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.log(error.message)
    }, () => {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      }

      const dbRef = firebase.database().ref("pictures");
      const newPicture = dbRef.push();
      newPicture.set(record);
    });
  }

  renderLoginButton() {
    if (this.state.user) {
      return (
        <div className="App-intro">
          <img src={this.state.user.photoURL} alt={this.state.user.displayName} width="100px" />
          <p className="App-intro">Hola {this.state.user.displayName}</p>
          <button type="button" className="App-btn" onClick={this.handleLogout}>Salir</button>

          <FileUpload onUpload={this.handleUpload} />

          {
            this.state.pictures.map((picture,index) => (
              <div className="App-card" key={index}>
                <figure className="App-card-image">
                  <img src={picture.image} alt="" width="320" />
                  <figcaption>
                    <img src={picture.photoURL} className="App-card-avatar" alt={picture.displayName} width="60px" />
                    <span className="App-card-name">{picture.displayName}</span>
                  </figcaption>
                </figure>
              </div>
            )).reverse()
          }

        </div>
      );
    } else {
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
