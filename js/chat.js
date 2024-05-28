import {
  child,
  FirebaseDatabase,
  onChildAdded,
  onChildChanged,
  ref,
  update,
} from "./firebase.config.js";

const ROLE = { SENDER: "sender", RECEIVER: "receiver" };
const STATUS_MESSAGE = {
  SENT: "SENT",
  RECEIVED: "RECEIVED",
  READ: "READ",
  REDEEM: "REDEEM",
};

const ICON_STATUS_MESSAGE = {
  SENT: "fa-regular fa-circle-check",
  RECEIVED: "fa-solid fa-circle-check",
  READ: "fa-solid fa-book-open-reader",
};

let room_id = "room_1";
let type = "rooms";
const userId = "207";
const roomChatRef = ref(FirebaseDatabase, `${type}/${room_id}`);
$(document).ready(() => {
  Swal.fire({
    title: "Loading", // Tiêu đề của thông báo
    allowOutsideClick: false, // Ngăn người dùng đóng thông báo bằng cách nhấp ra ngoài
    allowEscapeKey: false, // Ngăn người dùng đóng thông báo bằng cách nhấn ESC
    didOpen: () => {
      Swal.showLoading(); // Hiển thị biểu tượng quay loading
    },
  });

  $("#send-messenger").on("click", function (event) {
    send();
  });

  $("#search-btn").on("click", function (event) {
    search();
  });

  $("#input-message").on("keydown", (event) => {
    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      send();
    }
  });

  onChildAdded(roomChatRef, (data) => {
    Swal.close();
    loadMessage(userId, data.key, data.val());
  });

  onChildChanged(roomChatRef, (data) => {
    const id = data.val().userId + "-" + data.key;
    if (data.val().status === STATUS_MESSAGE.REDEEM) {
      const parent = $(`#${id}`);
      parent
        .find(".message-text")
        .addClass("redeem")
        .text("Tin nhắn đã bị thu hồi");
      parent.find(".message-option-icon").remove();
      parent.find(".icon-status").remove();
    }
  });
});

function send() {
  const message = $("#input-message");
  if (!message) return;
  $.ajax({
    url: `http://localhost:8081/api/send/${type}/${room_id}`,
    method: "POST",
    contentType: "application/json",
    type: "json",
    data: JSON.stringify({
      message: message.val().toString(),
      userId: userId,
    }),
    success: (response) => {
      message.val("");
    },
    error: (request, status, error) => {
      console.log(request.responseText);
    },
  });
}

function loadMessage(userId, keyMessage, objMessage) {
  const { message, status, time } = objMessage;
  const messageId = objMessage.userId;
  const id = `${messageId}-${keyMessage}`;
  const role = userId === messageId ? ROLE.SENDER : ROLE.RECEIVER;
  const timeSend = time.split("-")[1];
  const iconStatusMessage =
    status === STATUS_MESSAGE.SENT
      ? ICON_STATUS_MESSAGE.SENT
      : status === STATUS_MESSAGE.RECEIVED
      ? ICON_STATUS_MESSAGE.RECEIVED
      : ICON_STATUS_MESSAGE.READ;
  const frameMessage = `
         <div id="${id}" class="d-flex message-content message-${role}">
            <div class="message-main">
                    ${
                      role === ROLE.SENDER && status !== STATUS_MESSAGE.REDEEM
                        ? '<i class="fa-solid fa-ellipsis-vertical message-option-icon"></i>'
                        : ""
                    }
                    <div class="message d-inline-block">
                        <div class="message-text ${
                          status === STATUS_MESSAGE.REDEEM ? "redeem" : ""
                        }">${message}</div>
                        <span class="message-time pull-right">${timeSend}</span>
                    </div>
                ${
                  role === ROLE.SENDER && status !== STATUS_MESSAGE.REDEEM
                    ? `<i class="icon-status d-block ${iconStatusMessage}"></i>`
                    : ``
                }
            </div>
         </div>
        `;

  const conversation = $("#conversation");
  conversation.append(frameMessage);
  $(".message-body").scrollTop(conversation.height());

  $(`#${id} .message-option-icon`).on("click", function (event) {
    if ($(this).parent().prev()[0] === undefined) {
      $(".message-option-content").remove();
      $(this).parent().before(OPTION_MESSAGE_CONTENT);
      eventMessageOptionItem();
    } else $(this).parent().prev().remove();
  });
}

function search() {
  const message = $("#search-input").val();
  if (!message.trim()) return;
  $.ajax({
    url: `http://localhost:8081/api/search/${type}/${room_id}?content=${encodeURIComponent(
      message
    )}`,
    method: "GET",
    contentType: "application/json",
    type: "json",

    success: (response) => {
      $(".toast").addClass("show");
      let data = "";

      response.forEach((message) => {
        const subData = `
        <div class="row sideBar" >
        <div class="row sideBar-body align-items-center" style="height: fit-content;">
          <div class="col-sm-3 col-xs-3 sideBar-avatar">
            <div class="avatar-icon">
              <img
                src="https://bootdey.com/img/Content/avatar/avatar${Math.floor(Math.random() * 4) + 1}.png"
              />
            </div>
          </div>
          <div class="col-sm-9 col-xs-9 sideBar-main">
            <div class="row">
              <div class="col-sm-8 col-xs-8 sideBar-name">
                <div class="name-meta">John Doe</div>
                <div class="name-meta">${message.message}</div>
              </div>
              <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
                <span class="time-meta pull-right">${message.time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        `;
        data += subData;
      });
      $(".toast .toast-body").empty().append(data);
    },
    error: (request, status, error) => {
      console.log(request.responseText);
    },
  });
}

const OPTION_MESSAGE_CONTENT = `
    <ul class="message-option-content">
        <li class="option_message_item redeem">Thu hồi</li>
        <li class="option_message_item">Xóa tin nhắn</li>
        <li class="option_message_item">Chi tiết</li>
    </ul>
    `;

function eventMessageOptionItem() {
  $(".option_message_item.redeem").on("click", function (event) {
    const id = $(this).parents(".message-content").attr("id").split("-");
    update(child(roomChatRef, id[1]), {
      "/message": "Tin nhắn đã bị thu hồi",
      "/status": STATUS_MESSAGE.REDEEM,
    }).then(() => {
      $(".message-option-content").remove();
    });
  });
}
