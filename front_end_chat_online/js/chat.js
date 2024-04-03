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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const room_id = "room_1"
const roomChatRef = ref(db, "room_chats/room_1");

