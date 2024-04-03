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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const room_id = "room_1"
const roomChatRef = ref(db, `room_chats/${room_id}`);
const userId = 1305;
$(document).ready(() => {
    $("#send-messenger").on('click', function (event) {
        send();
    });

    onChildAdded(roomChatRef, data => {
        loadMessage(userId, data.key, data.val());
    });
});

function send() {
    const date = new Date();
    const message = getMessage(userId);
    if (!message) return;
    const key = date.getTime().toString();
    set(child(roomChatRef, key), message).then(() => {
        $("#input-message").val("");
    });
}


function getMessage(id) {
    const message = $("#input-message").val();
    if (!message) return null;
    return {
        userId: id,
        "message": message,
        status: STATUS_MESSAGE.SENT,
        time: new Date().toString(),
        list_reader: []
    }
}


function loadMessage(userId, keyMessage, objMessage) {
    const messageId = objMessage.userId;
    const id = `${messageId}-${keyMessage}`;
    const data = objMessage.message;
    const status = objMessage.status;
    const role = userId === messageId ? ROLE.SENDER : ROLE.RECEIVER;
    const iconStatusMessage = status === STATUS_MESSAGE.SENT ? ICON_STATUS_MESSAGE.SENT :
        status === STATUS_MESSAGE.RECEIVED ? ICON_STATUS_MESSAGE.RECEIVED : ICON_STATUS_MESSAGE.READ
    const frameMessage =
        `
         <div id="${id}" class="d-flex message-content message-${role}">
            <div class="message-main">
                    ${role === ROLE.SENDER && status !== STATUS_MESSAGE.REDEEM
            ? '<i class="fa-solid fa-ellipsis-vertical message-option-icon"></i>'
            : ''}
                    <div class="message d-inline-block">
                        <div class="message-text ${status === STATUS_MESSAGE.REDEEM ? 'redem' : ''}">${data}</div>
                        <span class="message-time pull-right">Sun</span>
                    </div>
                <i class="icon-status d-block ${iconStatusMessage}"></i>
            </div>
         </div>
        `

    const conversation = $("#conversation")
    conversation.append(frameMessage);
    $('.message-body').scrollTop(conversation.height())

}


$("#input-message").on("keydown", event => {
    if (!event.shiftKey && event.key === "Enter") {
        event.preventDefault()
        send();
    }
});
