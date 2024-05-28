import {child, FirebaseDatabase, onChildAdded, onChildChanged, ref, update} from "./firebase.config.js";

const ROLE = {"SENDER": "sender", "RECEIVER": "receiver"}
const STATUS_MESSAGE = {SENT: "SENT", RECEIVED: "RECEIVED", READ: "READ", REDEEM: "REDEEM"}

const ICON_STATUS_MESSAGE = {
    SENT: "fa-regular fa-circle-check",
    RECEIVED: "fa-solid fa-circle-check",
    READ: "fa-solid fa-book-open-reader",
    ERROR: "fa-sharp fa-regular fa-circle-exclamation"
}

let room_id = "room_1"
let type = "rooms";
const userId = "1305";
const roomChatRef = ref(FirebaseDatabase, `${type}/${room_id}`);
$(document).ready(() => {
    Swal.fire({
        title: 'Loading', // Tiêu đề của thông báo
        allowOutsideClick: false, // Ngăn người dùng đóng thông báo bằng cách nhấp ra ngoài
        allowEscapeKey: false, // Ngăn người dùng đóng thông báo bằng cách nhấn ESC
        didOpen: () => {
            Swal.showLoading(); // Hiển thị biểu tượng quay loading
        },
    });

    $("#send-messenger").on('click', function (event) {
        send();
    });

    $("#input-message").on("keydown", event => {
        if (!event.shiftKey && event.key === "Enter") {
            event.preventDefault()
            send();
        }
    });


    /*7. Firebase gửi thông báo đến các user nằm trong RoomChat*/
    onChildAdded(roomChatRef, data => {
        Swal.close()
        loadMessage(userId, data.key, data.val());
    });

    /*7. Firebase gửi thông báo đến các user nằm trong RoomChat*/
    /*onChildChanged(roomChatRef, data => {
        //Xác định tin nhắn cụ thể
        const id = data.val().userId + "-" + data.key;
        //Kiểm tra xem trạng thái tin nhắn có phải là thu hồi hay không
        if (data.val().status === STATUS_MESSAGE.REDEEM) {
            //Lấy phần tử HTML chứa tin nhắn bằng id
            const parent = $(`#${id}`);
            parent.find(".message-text").addClass("redeem").text("Tin nhắn đã bị thu hồi");
            //Xoa cac thong tin như la trạng thái xem, tùy chọn tin nhắn
            parent.find(".message-option-icon").remove()
            parent.find(".icon-status").remove()
        }
    })*/
    onChildChanged(roomChatRef, data => {
        // Xác định tin nhắn cụ thể
        const id = data.val().userId + "-" + data.key;
        const messageStatus = data.val().status;

        // Kiểm tra xem trạng thái tin nhắn có phải là thu hồi hay không
        if (messageStatus === STATUS_MESSAGE.REDEEM) {
            // Lấy phần tử HTML chứa tin nhắn bằng id
            const parent = $(`#${id}`);

            // Đảm bảo phần tử HTML tồn tại trước khi thao tác
            if (parent.length) {
                updateMessageStatusToRedeem(parent);
            } else {
                console.error(`Element with ID ${id} not found.`);
            }
        }
    });

// Hàm cập nhật trạng thái tin nhắn thành "Tin nhắn đã bị thu hồi"
    function updateMessageStatusToRedeem(parentElement) {
        // Cập nhật nội dung tin nhắn và thêm lớp "redeem"
        parentElement.find(".message-text").addClass("redeem").text("Tin nhắn đã bị thu hồi");

        // Xóa các thông tin như trạng thái xem, tùy chọn tin nhắn
        parentElement.find(".message-option-icon").remove();
        parentElement.find(".icon-status").remove();
    }


    setTimeout(() => {
        Swal.close()
    }, 2000);
});

/*4. Hệ thống gửi message kèm userId lên MessageController*/
function send() {
    const message = $("#input-message")
    const data = message.val().toString();
    message.val("")
    if (!message) return;
    $.ajax({
        url: `http://localhost:8081/api/send/${type}/${room_id}`,
        method: "POST",
        contentType: "application/json",
        type: "json",
        data: JSON.stringify({
            message: data,
            userId: userId
        }),
        success: (response) => {
        },
        error: (request, status, error) => {
            console.log(request.responseText)
            const date = new Date();
            const hours = date.getHours()
            const minutes = date.getMinutes()
            const time = `${hours < 10 ? `0` + hours : hours}:${minutes < 10 ? `0` + minutes : minutes}`
            loadMessageError(time, data)
        }
    });
}

/*8. Hệ thông hiển thị tin nhắn lên màng hình.*/
function loadMessage(userId, keyMessage, objMessage) {
    const {message, status, time} = objMessage;
    const messageId = objMessage.userId;
    const id = `${messageId}-${keyMessage}`;
    const role = userId === messageId ? ROLE.SENDER : ROLE.RECEIVER;
    const timeSend = time.split("-")[1]
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
                        <div class="message-text ${status === STATUS_MESSAGE.REDEEM ? 'redeem' : ''}">${message}</div>
                        <span class="message-time pull-right">${timeSend}</span>
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

const loadMessageError = (timeSend, message) => {
    const frameMessage =
        `
         <div class="d-flex message-content message-${ROLE.SENDER} error">
            <div class="message-main">
                    <div class="message d-inline-block">
                        <div class="message-text">${message}</div>
                        <span class="message-time pull-right">${timeSend}</span>
                    </div>
                    <span class="material-symbols-outlined icon-status d-block" style="color: #da2b2b;">error</span>
            </div>
         </div>
        `

    const conversation = $("#conversation")
    conversation.append(frameMessage);
    $('.message-body').scrollTop(conversation.height())
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
    //Class option_message_item.redeem khi được click sẽ thực hiện nhiệm vụ  lấy id của tin nhắn cần xóa
    $('.option_message_item.redeem').on('click', function (event) {
        const id = $(this).parents('.message-content').attr("id").split("-")
        /*
        *  Sử dụng phương thức update để cập nhật nội dung và trạng thái của tin nhắn trong Firebase
        * thành Tin nhắn đã bị thu hồi và trạng thái là STATUS_MESSAGE.REDEEM.
        * */
        update(child(roomChatRef, id[1]), {
            "/message": "Tin nhắn đã bị thu hồi",
            "/status": STATUS_MESSAGE.REDEEM
        }).then(() => {
            //Xóa menu tùy chọn sau khi người dùng chọn chức năng xóa tin nhắn
            $(".message-option-content").remove()
        })
    });
}

