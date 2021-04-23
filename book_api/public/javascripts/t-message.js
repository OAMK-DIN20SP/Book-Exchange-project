function appendMessage(message){
  //append the message (arg) to .t-messsage-container
  const idmember = localStorage.getItem('idmember');
  const time = new Date(message.time);
  const formattedTime = time.getHours() + ":" + time.getMinutes();
  let messageElem = document.createElement('div');
  let messageElemHTMLString = '';

  messageElemHTMLString += `
    <div class="${idmember == message.idmember ? 'outgoing-message' : 'incoming-message'}">
      <div class="t-avatar-container">
        <div class="t-avatar">
          <img src="/images/avatars/${message.member_image || 'placeholder.png'}">
        </div>
      </div>
      <div class="t-sender-time-message">
        <div class="t-sender-time">
          <div class="t-sender">${idmember == message.idmember ? '' : message.sender_name }</div>
          <div class="t-time">${formattedTime}</div>
        </div>
        <div class="t-message">${message.message}</div>
      </div>
    </div>
  `;

  messageElem.innerHTML = messageElemHTMLString;
  document.querySelector('.t-message-container').append(messageElem);
}


function showOneToOneConversation(oneToOneData) {
  if ( !oneToOneData ) {
    console.log('showOneToOneConversation(): undefined arg');
    return
  }

  // CAUTION: temp solution, not append but load all (lastMessageTime not change now)
  document.querySelector('.t-message-container').innerHTML = '';

  for (let datum of oneToOneData) {
    appendMessage(datum);
  }
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


function getAndShowNewConversationData(){  
  // loggedinId, idreceiver, idbook, lastMessageTime: global vars
  const id1 = loggedinId;
  const id2 = idreceiver;
  const time = lastMessageTime;
  $.post('/message/b2p', { id1, id2, idbook, time }, (data) => {
    const newConversationData = data.messages;
    showOneToOneConversation(newConversationData);
    // window.scrollTo(0, document.body.scrollHeight);

    // tam thoi lay het messages lun, vi last time con phai theo user nua met vcl, vay thi append eu duoc :v
    // if (newConversationData.length > 0) {
    //   lastMessageTime = newConversationData.reduce( 
    //     (acc, cval) => new Date(cval.time) > new Date(acc.time) ? cval : acc 
    //   ).time;
    // }
  });
}


function handleClickOnUser(userId){
  // intervalId: global
  if (intervalId) clearInterval(intervalId);

  // set the receiver of the message (the global variable)
  idreceiver = userId;
  document.querySelector('.t-message-container'). innerHTML = '';
  getAndShowNewConversationData();
  showSendArea();
  intervalId = setInterval( getAndShowNewConversationData, 5000); 
}


function addUserToList(userId, userFullName){
  const userElement = document.createElement('li');
  userElement.className = `t-user-item`; 
  userElement.classList.add(`user-${userId}`);
  userElement.innerText = userFullName;
  userElement.onclick = () => handleClickOnUser(userId);
  document.querySelector('.t-user-list').append(userElement);
}


let idreceiver; // will be set/changed on click events
const loggedinId = localStorage.getItem('idmember');  // the logged in user
let intervalId, book_idmember, book_image;
let lastMessageTime = "1970-01-01T00:00:00.000Z";
let idbook = new URLSearchParams(window.location.search).get('idbook');

if ( Object.keys(data).length > 0 && idbook && parseInt(idbook) > 0 ){
  // idbook = data[0].idbook;
  book_idmember = data[0].book_idmember;
  book_image = data[0].image || 'placeholder.png';
  $('.t-book-cover').attr('src', `/images/books/${book_image}`);

  // add other member involved in the conversation to the list
  for (let d of data) {  // data must be provided before calling this script
    // const otherUserElement = document.createElement('li');
    // otherUserElement.className = `t-user-item`; 
    const senderId = d.idmember;
    
    if (loggedinId == senderId) {
      if (document.getElementsByClassName(`user-${d.idreceiver}`).length <= 0) { // add a user to list only once
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
    } 
  }
} else { // Object.keys(data).length = 0, aka new conversation
  idbook = new URLSearchParams(window.location.search).get('idbook');

  if (idbook && parseInt(idbook) > 0) {
    $.get(`/book/b_mb?idbook=${idbook}&accept=json`, (response) => {
      book_idmember = response.book_members[0].idmember;
      book_image = response.book_members[0].image || 'placeholder.png';
      $('.t-book-cover').attr('src', `/images/books/${book_image}`);

      const userId = book_idmember;
      const userFullName = response.book_members[0].firstname + ' ' + response.book_members[0].lastname;
      addUserToList(userId, userFullName);
      handleClickOnUser(userId);
    }); 
  } else {
    // no idbook <=> click "Messages" on the nav bar
    const idmember = localStorage.getItem('idmember');
    $.get(`/message?idmember=${idmember}&accept=json`, (response) => {console.log(response);
      book_idmember = response[0].idmember;
      book_image = response[0].image || 'placeholder.png';
      $('.t-book-cover').attr('src', `/images/books/${book_image}`);

      const userId = book_idmember;
      const userFullName = response.book_members[0].firstname + ' ' + response.book_members[0].lastname;
      addUserToList(userId, userFullName);
      handleClickOnUser(userId);
    }); 
  }
}