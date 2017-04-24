import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import App from './App';
import './index.css';

firebase.initializeApp({
  apiKey: "AIzaSyDaVN5Zqf0La5C4YOw31Z2_dy9DZJ-Igk0",
  authDomain: "pseudogram-4a109.firebaseapp.com",
  databaseURL: "https://pseudogram-4a109.firebaseio.com",
  projectId: "pseudogram-4a109",
  storageBucket: "pseudogram-4a109.appspot.com",
  messagingSenderId: "259757591308"
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
