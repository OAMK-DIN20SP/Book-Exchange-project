function showOneToOneConversation(oneToOneData) {
  const messageContainerElem = document.querySelector('.t-message-container');
  // messageContainerElem.innerHTML = '';
  let messageContainerElemHTMLString = '';

  for (let datum of oneToOneData) {
    const idmember = localStorage.getItem('idmember');

    // let messageElem = document.createElement('div');

    // if (idmember == datum.idmember) {
    //   messageElem.className = 'outgoing-message';
    // } else {
    //   messageElem.className = 'incoming-message';
    // }

    const time = new Date(datum.time);
    const formattedTime = time.getHours() + ":" + time.getMinutes();

    // messageElem.innerHTML = `
    //   <div class="t-avatar-container">
    //     <div class="t-avatar">
    //       <img src="/images/avatars/${datum.member_image || 'placeholder.png'}">
    //     </div>
    //   </div>
    //   <div class="t-sender-time-message">
    //     <div class="t-sender-time">
    //       <div class="t-sender">${messageElem.className == 'incoming-message' ? datum.sender_name : '' }</div>
    //       <div class="t-time">${formattedTime}</div>
    //     </div>
    //     <div class="t-message">${datum.message}</div>
    //   </div>
    // `;

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
    // messageContainerElem.append(messageElem);
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
  const idbook = data[0].idbook;

  // $.ajax({
  //   url: '/message',
  //   type: 'GET',
  //   headers: { Accept: 'application/json' },
  //   success: (data) => { console.log(data); },
  //   error: (err) => { console.log(err); }
  // });

  $.post( '/message', { idmember, idreceiver, message, idbook }, (data) => {
    //
  });

  // setInterval( () => {  // sai r chua filter
  //   $.get( `/message?idmember=${idmember}&idbook=${idbook}&accept=json`, (data) => {
  //     showOneToOneConversation(data);
  //   });
  // }, 500);
}




let idreceiver; // will be set/changed on click events
const idmember = localStorage.getItem('idmember');  // the logged in user
const book_idmember = data[0].book_idmember;

// add other member involved in the conversation to the list
for (let d of data) {  // data must be provided before calling this script
  const otherUserElement = document.createElement('li');
  otherUserElement.className = `t-user-item`; 
  
  if (idmember == d.idmember) { // logged in member == sender
    if (document.getElementsByClassName(`user-${d.idreceiver}`).length <=0) { // add a user to list only once
      otherUserElement.classList.add(`user-${d.idreceiver}`);    
      otherUserElement.innerText = d.receiver_name;
      otherUserElement.onclick = () => {
        // set the receiver of the message
        idreceiver = d.idreceiver;
        const oneToOneData = data.filter( datum => datum.idreceiver == idreceiver || datum.idmember == idreceiver );
        showOneToOneConversation(oneToOneData);
        showSendArea();
      };
      document.querySelector('.t-user-list').append(otherUserElement);
    }
  } else if (idmember == d.idreceiver) { // logged in member == receiver
    if (document.getElementsByClassName(`user-${d.idmember}`).length <= 0) { // add a user to list only once
      otherUserElement.classList.add(`user-${d.idmember}`);    
      otherUserElement.innerText = d.sender_name;
      otherUserElement.onclick = () => {
        // set the receiver of the message
        idreceiver = d.idmember;
        const oneToOneData = data.filter( datum => datum.idreceiver == idreceiver || datum.idmember == idreceiver );
        showOneToOneConversation(oneToOneData);
        showSendArea();
      };
      document.querySelector('.t-user-list').append(otherUserElement);
    }
  }
}

// boundary case: when a new member (a potential receiver) start the converation (with the book's owner, of course)
if ( document.querySelector('.t-user-list').children.length <= 0 ) {
  idreceiver = data[0].book_idmember;
  const oneToOneData = data.filter( datum => datum.idreceiver == idreceiver || datum.idmember == idreceiver );
  console.log('bound casse, one one data:', oneToOneData);
  showOneToOneConversation(oneToOneData);
}

