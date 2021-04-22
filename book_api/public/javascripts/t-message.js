function showOneToOneConversation(oneToOneData) {
  const messageContainerElem = document.querySelector('.t-message-container');
  let messageContainerElemHTMLString = '';

  for (let datum of oneToOneData) {
    const idmember = localStorage.getItem('idmember');

    const time = new Date(datum.time);
    const formattedTime = time.getHours() + ":" + time.getMinutes();

    messageContainerElemHTMLString += `
      <div class="${idmember == datum.idmember ? 'outgoing-message' : 'incoming-message'}">
        <div class="t-avatar-container">
          <div class="t-avatar">
            <img src="/images/avatars/${datum.member_image || 'placeholder.png'}">
          </div>
        </div>
        <div class="t-sender-time-message">
          <div class="t-sender-time">
            <div class="t-sender">${idmember == datum.idmember ? '' : datum.sender_name }</div>
            <div class="t-time">${formattedTime}</div>
          </div>
          <div class="t-message">${datum.message}</div>
        </div>
      </div>
    `;
  }

  messageContainerElem.innerHTML = messageContainerElemHTMLString;
}


function showSendArea() {
  document.querySelector('.t-send-area').innerHTML = `
    <input type="text" name="message" id="message" placeholder="Type here...">
    <button id="btn-send"><i class="far fa-paper-plane"></i></button>
  `;

  $('#message').keypress( (e) => {
    if (e.key == 'Enter') sendMessage();
  });

  $('#btn-send').click( () => sendMessage() );
}


function sendMessage() {
  const message = $('#message').val();
  $('#message').val("");
  document.querySelector('#message').value = '';

  // these 2 below for t-message.js only
  // const idreceiver = book_idmember;  // easier to understand
  // const idbook = data[0].idbook; // global var co r

  // $.ajax({
  //   url: '/message',
  //   type: 'GET',
  //   headers: { Accept: 'application/json' },
  //   success: (data) => { console.log(data); },
  //   error: (err) => { console.log(err); }
  // });

  const idmember = loggedinId;
  $.post( '/message', { idmember, idreceiver, message, idbook }, (data) => {
    //
  });
}


function handleClickOnAUser(userId){
  // set the receiver of the message (the global variable)
  idreceiver = userId;
  //click vao moi get data xuong
  const id1 = loggedinId;  // loggedinId, idreceiver, idbook: global vars
  const id2 = idreceiver;
  $.post('/message/b2p', { id1, id2, idbook }, (data) => {
    console.log(data);
    const oneToOneData = data.messages;
    showOneToOneConversation(oneToOneData);
    showSendArea();
  });
}


function addUserToList(userId, userFullName){
  const userElement = document.createElement('li');
  userElement.className = `t-user-item`; 
  userElement.classList.add(`user-${userId}`);
  userElement.innerText = userFullName;
  userElement.onclick = () => handleClickOnAUser(userId);
  document.querySelector('.t-user-list').append(userElement);
}


let idreceiver; // will be set/changed on click events
const loggedinId = localStorage.getItem('idmember');  // the logged in user
const idbook = data[0].idbook;
const book_idmember = data[0].book_idmember;
const book_image = data[0].image;

// add other member involved in the conversation to the list
for (let d of data) {  // data must be provided before calling this script
  // const otherUserElement = document.createElement('li');
  // otherUserElement.className = `t-user-item`; 
  const senderId = d.idmember;
  
  if (loggedinId == senderId) {
    if (document.getElementsByClassName(`user-${d.idreceiver}`).length <=0) { // add a user to list only once
      const userId = d.idreceiver;
      const userFullName = d.receiver_name;
      addUserToList(userId, userFullName);
    }
  } else if (loggedinId == d.idreceiver) {
    if (document.getElementsByClassName(`user-${senderId}`).length <= 0) { // add a user to list only once
      const userId = senderId;
      const userFullName = d.sender_name;
      addUserToList(userId, userFullName);
    }
  } else { // loggedinId not sender, not receiver => new conversation
      const newConversationElem = document.querySelector('.t-new-conversation');console.log(newConversationElem);
      // const idbook = new URLSearchParams(window.location.search).get('idbook');
      // const idmember = localStorage.getItem('idmember');
      // let book_idmember;

      if (newConversationElem) {console.log('newConversationElem not null');
        $.get('/book/search?idbook='+idbook, (data) => {
          // const book_image = data.books[0].image;
          // book_idmember = data.books[0].idmember;
          
          if (loggedinId == book_idmember) {
            // book owner view the conversations of one of his book
            newConversationElem.innerHTML = `<h4>There is no conversation about this book.<br>
                You can click the website's logo or <a href="/">click here</a> to go back to the home page.<br>
                You can also use the navigation bar at the top of the website <i class="far fa-smile"></i>.
              </h4>`;
          } else {
              document.querySelector('main').innerHTML = `
                <img class="t-book-cover" src="/images/books/${book_image || 'placeholder.png'}">
                <button>Exchange Done</button>
                <div class="t-conversation">
                  <div class="t-message-container">

                  </div>
                  <div class="t-send-area">
                    <input type="text" name="message" id="message" placeholder="Type here...">
                    <button id="btn-send"><i class="far fa-paper-plane"></i></button>
                  </div>
                </div>
                
              `;
          }
        });
      }
    }
  }
