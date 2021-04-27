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
          <img class="avatar" src="/images/avatars/${message.member_image || 'placeholder.png'}">
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

  // CAUTION: temp solution, not append but load all (lastMessageTime always 1970 0:0)
  document.querySelector('.t-message-container').innerHTML = '';

  for (let datum of oneToOneData) {
    appendMessage(datum);
  }

  // window.scrollTo(0, document.body.scrollHeight);
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
  lastMessageTime = "1970-01-01T00:00:00.000Z";

  // set the receiver of the message (the global variable)
  idreceiver = userId;
  document.querySelector('.t-message-container'). innerHTML = '';
  getAndShowNewConversationData();
  showSendArea();
  intervalId = setInterval( getAndShowNewConversationData, 500); 
  // window.scrollTo(0, document.body.scrollHeight);
}


function addUserToList(userId, userFullName){
  const userElement = document.createElement('li');
  userElement.className = `t-user-item`; 
  userElement.classList.add(`user-${userId}`);
  userElement.innerText = userFullName;
  userElement.onclick = () => {
    handleClickOnUser(userId);
    $('.t-conversation').removeAttr('style');
  }
  document.querySelector('.t-user-list').append(userElement)
  
}


function addBookCoverToList(imageSrc, idbook){
  let bookCoverListElem = document.querySelector('.t-book-list');

  if (!bookCoverListElem){
    bookCoverListElem = document.createElement('div');
    bookCoverListElem.className = 't-book-list';
    document.querySelector('#blocka').before(bookCoverListElem);
  }

  const bookCoverElem = document.createElement('div');
  bookCoverElem.classList = 't-book-cover';
  const idmember = localStorage.getItem('idmember');

  bookCoverElem.innerHTML = `
    <a href="/message?idmember=${idmember}&idbook=${idbook}">
      <img src="/images/books/${imageSrc || 'placeholder.png'}" alt="">
    </a>`;

  bookCoverListElem.append(bookCoverElem);
}




// main() :v
let idreceiver; // will be set/changed on click events
const loggedinId = localStorage.getItem('idmember');  // the logged in user
let intervalId, book_idmember, book_image;
let lastMessageTime = "1970-01-01T00:00:00.000Z";
let idbook = new URLSearchParams(window.location.search).get('idbook');

// code to list books that have conversation(s) below :v ("should be first")
if ( Object.keys(data).length > 0 && idbook && parseInt(idbook) > 0 ){
  // idbook = data[0].idbook;
  book_idmember = data[0].book_idmember;
  book_image = data[0].book_image || 'placeholder.png';
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
    // list books that have conversation(s)
    if (document.querySelector('main h4')) document.querySelector('main h4').remove();
    if (document.querySelector('main button')) document.querySelector('main button').remove();
    let infoElem = document.createElement('div');
    infoElem.className = 't-info';
    infoElem.innerHTML = `
      Please click on a book to see the conversation(s) belong to it (that you get involved).
    `;
    document.querySelector('main').prepend(infoElem);

    const idmember = localStorage.getItem('idmember');
    $.get(`/message?idmember=${idmember}&accept=json`, (response) => {console.log(response);
      const messages = response.messages;

      if (messages.length > 0){
        const idbooks = [];

        for (let message of messages){
          if (!idbooks.includes(message.idbook)) idbooks.push(message.idbook);
        }

        idbooks.sort( (a, b) => a - b );
        console.log(idbooks);

        for (let idbook of idbooks){
          $.get(`/book?idbook=${idbook}&accept=json`, (response2) => {
            console.log(response2);
            const book = response2.books[0]; // get by id => only 1 book in response array
            book_image = book.image || 'placeholder.png';
            book_idmember = book.idmember;
            addBookCoverToList(book.image, idbook);
          });
        }
      } else { // no conv. at all
        // luoi viet lai, xoa cho nhanh
        if (document.querySelector('main h4')) document.querySelector('main h4').remove();
        if (document.querySelector('main button')) document.querySelector('main button').remove();
        if (document.querySelector('.t-info')) document.querySelector('.t-info').remove();
        let infoElem = document.createElement('div');
        infoElem.innerHTML = `
          You have no message.<br><br>
          Conversations in this website are special in a way that they are one-to-one, grouped by books,
          and a conversation will be gone when the book\'s owner delete his/her book
          or mark it as "Exchange Completed".<br><br><br>
        `;
        infoElem.style = "clear: both; margin-left: 50px;"
        document.querySelector('main').append(infoElem);
      }
    }); 
  }
}