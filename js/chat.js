// Import the functions you need from the SDKs you need
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

let userId = null;

while ((userId = parseInt(prompt("Nhập User ID của bạn:", "1305"))) === null) {
}

$(document).ready(() => {
    findListRoomChatId();

    $("#send-messenger").on("click", event => {
        send();
    })

    onChildAdded(roomChatRef, data => {
        const message = data.val();
        const messengerId = message.userId;
        const key = data.key;
        loadMessage(key, message, userId);
        onReceivedMessage(roomChatRef, userId, data);
        onReaderMessage(roomChatRef, userId, data)
    });

    onChildChanged(roomChatRef, data => {
        const key = data.key;
        const message = data.val();
        const iconStatusMessage = message.status === STATUS_MESSAGE.SENT ? ICON_STATUS_MESSAGE.SENT :
            message.status === STATUS_MESSAGE.RECEIVED ? ICON_STATUS_MESSAGE.RECEIVED : ICON_STATUS_MESSAGE.READ

        $(`#${message.userId}-${key}`).find(".icon-status").attr("class", `icon-status ${iconStatusMessage}`)
    })
});

function send() {
    const date = new Date();
    const message = getMessage(userId);
    $("#comment").val("");
    if (!message) return;
    const key = date.getTime().toString();
    set(child(roomChatRef, key), message);
}

function onReceivedMessage(roomChatRef, userId, data) {
    const key = data.key;
    const messengerId = data.val().userId
    const status = data.val().status;
    if (userId === messengerId || key === "set_up" || status === STATUS_MESSAGE.READ || status === STATUS_MESSAGE.READ) return;
    console.log("Đã nhận");

    update(child(roomChatRef, key), {
        "/status": STATUS_MESSAGE.RECEIVED
    }).then((data) => {
        $(`#${messengerId}-${key}`).find(".icon-status").attr("class", `icon-status ${ICON_STATUS_MESSAGE.RECEIVED}`)
    });
}

function onReaderMessage(roomChatRef, userId, data) {
    const key = data.key;
    const messengerId = data.val().userId
    if (data.val().status === STATUS_MESSAGE.READ || userId === messengerId || key === "set_up") return;
    console.log("Đã đọc");

    update(child(roomChatRef, key), {
        "/status": STATUS_MESSAGE.READ
    }).then((data) => {
        $(`#${messengerId}-${key}`).find(".icon-status").attr("class", `icon-status ${ICON_STATUS_MESSAGE.READ}`)
    });
}

function getMessage(id) {
    const message = $("#comment").val();
    if (!message) return null;
    return {
        userId: id,
        "message": message,
        status: STATUS_MESSAGE.SENT
    }
}

const STATUS_MESSAGE = {SENT: "SENT", RECEIVED: "RECEIVED", READ: "READ"}
const ICON_STATUS_MESSAGE = {
    SENT: "fa-regular fa-circle-check",
    RECEIVED: "fa-solid fa-circle-check",
    READ: "fa-solid fa-book-open-reader",
}

function findListRoomChatId() {
    onValue(ref(db, "room_chats"), (snapshot) => {
        const data = snapshot.val()
        const roomId = Object.keys(data);
        // roomId.forEach(key => {
        //     console.log(data[key].set_up.member.includes(userId))
        // });
    });
}

function loadMessage(key, message, userId) {
    const messageId = message.userId;
    const data = message.message;


    const role = userId === messageId ? "sender" : "receiver";
    const iconStatusMessage = message.status === STATUS_MESSAGE.SENT ? ICON_STATUS_MESSAGE.SENT :
        message.status === STATUS_MESSAGE.RECEIVED ? ICON_STATUS_MESSAGE.RECEIVED : ICON_STATUS_MESSAGE.READ
    const frameMessage =
        `
         <div id="${messageId}-${key}" class="col-12 align-items-end d-flex  message-main-${role} ">
            <div class="${role}">
                <div class="message-text">
                    ${data.replaceAll("\n", '<br>')}
                </div>
                <span class="message-time pull-right">Sun</span>
            </div>
            <i class="icon-status ${iconStatusMessage}"></i>
         </div>
        `

    const messageBody = $(`.message-body`);
    messageBody.append(frameMessage);
    $("#conversation").scrollTop(messageBody.height());
}


$("#comment").on("keydown", event => {
    if (!event.shiftKey && event.key === "Enter") {
        event.preventDefault()
        send();
    }
});