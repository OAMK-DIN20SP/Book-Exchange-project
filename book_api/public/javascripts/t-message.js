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
    console.log('showOneToOneConversation(): arg undefined');
    return
  }

  document.querySelector('.t-message-container').innerHTML = '';

  for (let datum of oneToOneData) {
    appendMessage(datum);
  }
}


function showSendArea() {
  document.querySelector('.t-send-area').innerHTML = `
    <input type="text" name="message" id="message" placeholder="Type here...">
    <button id="btn-send" disabled><i class="far fa-paper-plane"></i></button>
  `;

  $('#message').keypress( (e) => {
    if (e.key == 'Enter') sendMessage();
  });

  $('#message').on( "input", (e) => {
    document.querySelector('#btn-send').disabled = (document.querySelector('#message').value.trim() == '');
  });

  $('#btn-send').click( () => sendMessage() );
}


function sendMessage() {
  const message = $('#message').val();
  $('#message').val("");

  if (message.trim() == '') return;

  const idmember = loggedinId;
  $.post( '/message', { idmember, idreceiver, message, idbook }, (data) => {
    //
  });
}


function updateMsg_seen_totals(messages, idmember, idreceiver, idbook){
  if (!messages) return;  // case []: still set LS in case of delete conv

  let msg_seen_totals = getMsg_seen_totals() || [];
  let cur_msg_seen_total = {};
  const seen = messages.length;

  for (i = 0; i < msg_seen_totals.length; i++){
    m = msg_seen_totals[i];
    if ( m.idbook == idbook && m.idmember == idmember && m.idreceiver == idreceiver ) {
      cur_msg_seen_total = m;
      msg_seen_totals.splice(i, 1);
      break
    }
  }

  cur_msg_seen_total = { idbook, idmember, idreceiver, seen };
  msg_seen_totals.push( cur_msg_seen_total );
  setMsg_seen_totals(msg_seen_totals);
}


function getAndShowNewConversationData(){  
  $.get(`/book?idbook=${idbook}&accept=json` , (data) => {
    if(data && data.success == false) {
      if (intervalId) clearInterval(intervalId);
      alert("The owner has just deleted this book.")
      window.location.href = '/message?idmember=' + localStorage.getItem('idmember');
      return
    }
  })
  // loggedinId, idreceiver, idbook, lastMessageTime: global vars
  const id1 = loggedinId;
  const id2 = idreceiver;
  const time = lastMessageTime;
  const idmember = loggedinId;

  $.post('/message/b2p', { id1, id2, idbook, time }, (data) => {
    if (data.success == true) {
      const newConversationData = data.messages;
      updateMsg_seen_totals(newConversationData, idmember, idreceiver, idbook);
      showOneToOneConversation(newConversationData);
    }
  });
}


function handleClickOnUser(userId){
  // intervalId: global
  if (intervalId) clearInterval(intervalId);
  lastMessageTime = "1970-01-01T00:00:00.000Z";

  // set the receiver of the message (the global variable)
  idreceiver = userId;
  if ($('#btn-delete-conversation')) $('#btn-delete-conversation').prop('disabled', false);
  document.querySelector('.t-message-container'). innerHTML = '';
  getAndShowNewConversationData();
  showSendArea();
  intervalId = setInterval( getAndShowNewConversationData, 500); 
}


function addUserToList(userId, userFullName){
  const userElement = document.createElement('li');
  userElement.className = `t-user-item`; 
  userElement.classList.add(`user-${userId}`);
  userElement.innerText = userFullName;
  userElement.onclick = () => {
    handleClickOnUser(userId);
    $('.t-conversation').removeAttr('style');
    if (userElement.querySelector('.t-label-new-user-item')) userElement.querySelector('.t-label-new-user-item').remove();
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
  bookCoverElem.setAttribute('data-idbook', idbook);
  const idmember = localStorage.getItem('idmember');

  bookCoverElem.innerHTML = `
    <a href="/message?idmember=${idmember}&idbook=${idbook}">
      <img src="/images/books/${imageSrc || 'placeholder.png'}" alt="">
    </a>`;

  bookCoverListElem.append(bookCoverElem);
  $('.t-book-list').find('.t-book-cover').sort( (a,b) => +a.dataset.idbook - +b.dataset.idbook ).appendTo($('.t-book-list'));
}




// main() :v
$('#btn-delete-conversation').click( () => {
  const deleteConfirmed = confirm('Are you sure you want to delete THIS CONVERSATION?\n\nYou can NOT undo this action.')
  if (deleteConfirmed) {
    const idmember = localStorage.getItem('idmember');
    //idbook, idreceiver: global

    fetch(`/message/b2p?id1=${idmember}&id2=${idreceiver}&idbook=${idbook}`, {
        method: "DELETE",
      })
      .then( (res) => res.json() )
      .then( (data) => {
        const msg_seen_totals = getMsg_seen_totals() || [];
        let cur_msg_seen_total = {};

        for (i = 0; i < msg_seen_totals.length; i++){
          m = msg_seen_totals[i];
          if ( m.idbook == idbook && m.idmember == idmember && m.idreceiver == idreceiver ) {  // partners
            cur_msg_seen_total = m;
            msg_seen_totals.splice(i, 1);  
            break
          }
        }

        const seen = 0;  // delete conv => reset
        cur_msg_seen_total = { idbook, idmember, idreceiver, seen };
        msg_seen_totals.push( cur_msg_seen_total );
        setMsg_seen_totals(msg_seen_totals);

        alert("Deleted");
        window.location.href = `/message?idmember=${idmember}`;
      });
  }
});

$('#btn-exchange-done').click( () => {
  const deleteConfirmed = confirm('Are you sure you want to delete THIS BOOK AND ALL OF ITS CONVERSATIONS?\n\nYou can NOT undo this action.')
  if (deleteConfirmed) {
    const idmember = localStorage.getItem('idmember');
    //idbook: global

    fetch(`/book/delete?idmember=${idmember}&idbook=${idbook}`, {
        method: "DELETE",
      })
      .then( (res) => res.json() )
      .then( (data) => {
        alert("Deleted");
        window.location.href = `/member?idmember=${idmember}`;
      });
  }
});

let idreceiver; // will be set/changed on click events
const loggedinId = localStorage.getItem('idmember');  // the logged in user
let intervalId, book_idmember, book_image;
let lastMessageTime = "1970-01-01T00:00:00.000Z";
let idbook = new URLSearchParams(window.location.search).get('idbook');

// code to list books that have conversation(s) below :v ("should be first")
if ( Object.keys(data).length > 0 && idbook && parseInt(idbook) > 0 ){ // old conversations

  // idbook = data[0].idbook;
  book_idmember = data[0].book_idmember;
  book_image = data[0].book_image || 'placeholder.png';
  $('img.t-book-cover').attr('src', `/images/books/${book_image}`);
  $('a.t-book-cover').attr('href', `/book?idbook=${idbook}`);

  // add other member involved in the conversation to the list
  for (let d of data) {  // data must be provided before calling this script
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
} else { // new conversation

  idbook = new URLSearchParams(window.location.search).get('idbook');

  if (idbook && parseInt(idbook) > 0) {

    $.get(`/book/b_mb?idbook=${idbook}&accept=json`, (response) => {
      if (response.success == false || response.book_members.length == 0) return;

      book_idmember = response.book_members[0].idmember;
      book_image = response.book_members[0].image || 'placeholder.png';
      $('img.t-book-cover').attr('src', `/images/books/${book_image}`);
      $('a.t-book-cover').attr('href', `/book?idbook=${idbook}`);

      const userId = book_idmember;
      const userFullName = response.book_members[0].firstname + ' ' + response.book_members[0].lastname;
      addUserToList(userId, userFullName);
      // handleClickOnUser(userId);  // no click simulation
    }); 
  } else { // no idbook <=> click "Messages" on the nav bar
    if ($('#btn-delete-conversation')) $('#btn-delete-conversation').remove();
    // list books that have conversation(s)
    if (document.querySelector('main h4')) document.querySelector('main h4').remove();
    if (document.querySelector('main button')) document.querySelector('main button').remove();
    let infoElem = document.createElement('div');
    infoElem.className = 't-info';
    infoElem.innerHTML = `
      Please click on a book to see the conversation.
    `;
    document.querySelector('main').prepend(infoElem);

    const idmember = localStorage.getItem('idmember');
    $.get(`/message?idmember=${idmember}&accept=json`, (response) => {
      const messages = response.messages;
      const idbooks = [];

      if (messages.length > 0){
        for (let message of messages){
          const idbook = message.idbook;

          if (!idbooks.includes(idbook)) {
            idbooks.push(idbook);
            $.get(`/book?idbook=${idbook}&accept=json`, (response2) => {
              if( response2 && response2.books && response2.books.length > 0) {
                const book = response2.books[0];
                book_image = book.image || 'placeholder.png';
                book_idmember = book.idmember;
                addBookCoverToList(book.image, idbook);
              }
            });
          };
          
          //
        }
      } else { // no conv. at all
        if (document.querySelector('main h4')) document.querySelector('main h4').remove();
        if (document.querySelector('main button')) document.querySelector('main button').remove();
        if (document.querySelector('.t-info')) document.querySelector('.t-info').remove();
        let infoElem = document.createElement('div');
        infoElem.innerHTML = `
          You have no messages.<br><br>
          Messages will get deleted along with the books by clicking on the "Exchange done".<br><br><br>
        `;
        infoElem.style = "clear: both; margin-left: 50px;"
        document.querySelector('main').append(infoElem);
      }
    }); 
  }
}

if (window.location.href.split("?")[1].indexOf("&") != -1) {
  document.querySelector("#hidan").style.display = "block";
}