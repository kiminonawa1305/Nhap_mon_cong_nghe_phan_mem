/*
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
const userId = 207;
$(document).ready(() => {
    $("#send-messenger").on('click', function (event) {
        send();
    });

    $("#input-message").on("keydown", event => {
        if (!event.shiftKey && event.key === "Enter") {
            event.preventDefault()
            send();
        }
    });

    onChildAdded(roomChatRef, data => {
        loadMessage(userId, data.key, data.val());
    });

    onChildChanged(roomChatRef, data => {
        const id = data.val().userId + "-" + data.key;
        if (data.val().status === STATUS_MESSAGE.REDEEM) {
            const parent = $(`#${id}`);
            parent.find(".message-text").addClass("redeem").text("Tin nhắn đã bị thu hồi");
            parent.find(".message-option-icon").remove()
            parent.find(".icon-status").remove()
        }
    })
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
    const date = new Date();
    if (!message) return null;
    return {
        userId: id,
        "message": message,
        status: STATUS_MESSAGE.SENT,
        time: `${date.getDate().toString().length === 1 ? "0" + date.getDate() : date.getDate()}/${date.getMonth().toString().length === 1 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes()}`,
        list_reader: []
    }
}


function loadMessage(userId, keyMessage, objMessage) {
    const messageId = objMessage.userId;
    const id = `${messageId}-${keyMessage}`;
    const data = objMessage.message;
    const status = objMessage.status;
    const role = userId === messageId ? ROLE.SENDER : ROLE.RECEIVER;
    const time = objMessage.time.split("-")[1]
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
                        <div class="message-text ${status === STATUS_MESSAGE.REDEEM ? 'redeem' : ''}">${data}</div>
                        <span class="message-time pull-right">${time}</span>
                    </div>
                ${role === ROLE.SENDER && status !== STATUS_MESSAGE.REDEEM ? `<i class="icon-status d-block ${iconStatusMessage}"></i>` : ``}
            </div>
         </div>
        `

    const conversation = $("#conversation")
    conversation.append(frameMessage);
    $('.message-body').scrollTop(conversation.height())

    $(`#${id} .message-option-icon`).on("click", function (event) {
        if ($(this).parent().prev()[0] === undefined) {
            $(".message-option-content").remove()
            $(this).parent().before(OPTION_MESSAGE_CONTENT);
            eventMessageOptionItem();
        } else $(this).parent().prev().remove()
    });
}

const OPTION_MESSAGE_CONTENT =
    `
    <ul class="message-option-content">
        <li class="option_message_item redeem">Thu hồi</li>
        <li class="option_message_item">Xóa tin nhắn</li>
        <li class="option_message_item">Chi tiết</li>
    </ul>
    `

function eventMessageOptionItem() {
    $('.option_message_item.redeem').on('click', function (event) {
        const id = $(this).parents('.message-content').attr("id").split("-")
        update(child(roomChatRef, id[1]), {
            "/message": "Tin nhắn đã bị thu hồi",
            "/status": STATUS_MESSAGE.REDEEM
        }).then(() => {
            $(".message-option-content").remove()
        })
    });
}
*/
