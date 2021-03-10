import firebase from 'firebase'


//firestore secret data
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAy1Kq-zBvge_GPjcJDNiudq91kWVeH2UM",
    authDomain: "nier-a.firebaseapp.com",
    projectId: "nier-a",
    storageBucket: "nier-a.appspot.com",
    messagingSenderId: "312947698137",
    appId: "1:312947698137:web:8cae3c09502eb907da91c8",
    measurementId: "G-WQZWGZXZ73"
  })

const db=firebaseApp.firestore()
const auth=firebase.auth()
const storage=firebase.storage()

export {db, auth, storage}

 