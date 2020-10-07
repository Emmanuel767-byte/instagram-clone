// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from "firebase";

const firebaseApp= firebase.initializeApp({
  apiKey: "AIzaSyDYWbG87pihjyTsGx1Tiak6So8PaTObkWA",
  authDomain: "social-network-bc869.firebaseapp.com",
  databaseURL: "https://social-network-bc869.firebaseio.com",
  projectId: "social-network-bc869",
  storageBucket: "social-network-bc869.appspot.com",
  messagingSenderId: "380110956940",
  appId: "1:380110956940:web:b3fe9de9ea8bfaf9864ea9",
  measurementId: "G-8S04X19V3V"
});

const db = firebaseApp.firestore();//database
const auth = firebase.auth();//authenticaion users usage
const storage = firebase.storage();// how we upload data to database

export {db, auth, storage}