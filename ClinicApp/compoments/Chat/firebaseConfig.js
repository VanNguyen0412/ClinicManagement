import "firebase/firestore"; // Dùng Firestore cho nhắn tin
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB6bDvoYmzRiOIGGtLkZut0aHVeJ8nUB5c",
    authDomain: "chat-bf93c.firebaseapp.com",
    databaseURL: "https://chat-bf93c-default-rtdb.firebaseio.com",
    projectId: "chat-bf93c",
    storageBucket: "chat-bf93c.appspot.com",
    messagingSenderId: "518943141537",
    appId: "1:518943141537:web:edc1278eb2cca93b8c8ae0",
    measurementId: "G-SST024F754"
  };

// Khởi tạo Firebase
initializeApp(firebaseConfig);


export const db = getFirestore();
