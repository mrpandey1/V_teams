import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyCnl8I7m-ANG0tJH1PiNhXfIrwE1lW6WXc",
    authDomain: "v-teams.firebaseapp.com",
    projectId: "v-teams",
    storageBucket: "v-teams.appspot.com",
    messagingSenderId: "1076714292051",
    appId: "1:1076714292051:web:3add0ee1e2908e770d97a6",
    measurementId: "G-R06FSWKV5N"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebase;