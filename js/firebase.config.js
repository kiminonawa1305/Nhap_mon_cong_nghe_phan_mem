import {initializeApp} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    child,
    onChildAdded,
    update,
    onChildChanged,
    onValue,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js"

const STATUS_MESSAGE = {SENT: "SENT", RECEIVED: "RECEIVED", READ: "READ", REDEEM: "REDEEM"}
const ROLE = {"SENDER": "sender", "RECEIVER": "receiver"}
const ICON_STATUS_MESSAGE = {
    SENT: "fa-regular fa-circle-check",
    RECEIVED: "fa-solid fa-circle-check",
    READ: "fa-solid fa-book-open-reader",
}

const firebaseConfig = {
    apiKey: "AIzaSyB8pBkXJ6i0sGcwY4_FyC_91zp3p4afqHo",
    authDomain: "program-chat-online.firebaseapp.com",
    databaseURL: "https://program-chat-online-default-rtdb.firebaseio.com",
    projectId: "program-chat-online",
    storageBucket: "program-chat-online.appspot.com",
    messagingSenderId: "330494060028",
    appId: "1:330494060028:web:2de5d6324fbad434f7be79",
    measurementId: "G-VMVPVFNC77"
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const FirebaseDatabase = getDatabase(FirebaseApp);
export {FirebaseDatabase, ref, set, child, onChildAdded, update, onChildChanged, onValue}

