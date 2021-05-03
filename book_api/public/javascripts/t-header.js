function openSignupForm() {
    document.getElementById("signupForm").style.display = "block";
}


function closeSignupForm() {
    document.getElementById("signupForm").style.display = "none";
}


function openLoginForm() {
    document.getElementById("loginForm").style.display = "block";
}


function closeLoginForm() {
    document.getElementById("loginForm").style.display = "none";
}


function validate(obj) {
    removeValidatingNotification(obj);

    if (obj.value.trim() == "") {
      const notificationElement = document.createElement('p');
      notificationElement.innerText = "Please enter your " + obj.name + ".";
      notificationElement.style.color = 'red';
      notificationElement.id = obj.name + '-validating-notification';
      obj.parentNode.append(notificationElement);
      return false;
    }

    return true;
}


function removeValidatingNotification(obj) {
  const x = document.getElementById(obj.name + '-validating-notification');
  if(x) x.remove();
}


function validatePasswordMatch(){
  const pw = document.forms.signupForm["password"];
  const pw2 = document.forms.signupForm["password2"];

  removeValidatingNotification(pw2);

  if (pw2.value != pw.value){
      const notificationElement = document.createElement('p');
      notificationElement.innerText = "Your password does not match. Please try again.";
      notificationElement.style.color = 'red';
      notificationElement.id = pw2.name + '-validating-notification';
      pw2.parentNode.append(notificationElement);
      return false;
  }

  return true;
}


function validateSignupForm() {
  return validate( document.querySelector('#signupForm input[name="firstname"]') )
      && validate( document.querySelector('#signupForm input[name="emailaddress"]') )
      && validate( document.querySelector('#signupForm input[name="password"]') )
      && validate( document.querySelector('#signupForm input[name="address"]') )
      && validatePasswordMatch();
} 




// main()
$(document).ready( () => {

  $('button.signup-button').click( () => openSignupForm());
  $('button.login-button').click( () => openLoginForm());

  $('#my-profile').click( (e) => {
    e.preventDefault();
    const idmember = localStorage.getItem('idmember');
    if (idmember) window.location.href = '/member?idmember=' + idmember;
  });

  $('#btn-login').click( () => {
    $.post( '/member/login2', $('form.login-form').serialize(), (data, status) => {
      if (data.success == false) {
        alert("Invalid email and/or password");
      } else {
        localStorage.setItem('idmember', data[0].idmember);
        localStorage.setItem('firstname', data[0].firstname);
        localStorage.setItem('lastname', data[0].lastname);
        window.location.href = '/member?idmember=' + data[0].idmember;
      }
    });
  });

  $('#btn-signup').click( () => {
    if ( !validateSignupForm() ) return;

    $.post( '/member/add', $('form.signup-form').serialize(), (data, status) => {
      alert(data.message);
      if (data.success) {
        openLoginForm();
      }
    });
  });

  const idmember = localStorage.getItem('idmember');

  if (idmember && parseInt(idmember) > 0) {
    for (elem of document.querySelectorAll(".header-navbar button") ) {
      elem.remove();
    }

    const headerElem = document.querySelector('.header-navbar-inner');
    headerElem.innerHTML += `
      <a id="my-profile" href="/member?idmember=${idmember}" style="right: 220px;">Profile</a>
      <a id="my-messages" href="/message?idmember=${idmember}" style="right: 275px;">Messages</a>
      <a id="upload-book" href="/book/upload?idmember=${idmember}" style="right: 360px;">Upload</a>
      <a id="search-book" href="/#welcome-message" style="right: 420px;">Search</a>
      `;

    const firstname = localStorage.getItem('firstname');
    const logOutButton = document.createElement('button');

    // new, simple UI
    logOutButton.id = "btn-logout";
    logOutButton.style.right = '80px';
    logOutButton.innerText = 'Log Out';

    headerElem.append(logOutButton);

    let avatarElem = document.createElement('img');
    avatarElem.className = 't-header-avatar';

    $.get(`/member?idmember=${idmember}&accept=json`, (data) => {
      const member_image = data.members[0].image;
      avatarElem.src = `/images/avatars/${member_image || 'placeholder.png'}`;
      headerElem.append(avatarElem);
      $('img.t-header-avatar').click( () => window.location.href = '/member?idmember=' + localStorage.getItem('idmember'));
      $('img.t-header-avatar').css('cursor', 'pointer');
    });

    $('#btn-logout').click( () => {
      const idmember = localStorage.getItem('idmember');
      if (idmember && parseInt(idmember) > 0) {
        localStorage.removeItem('idmember');
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        window.location.href = "/";
      }
    });

  }

  let headerIntervalId;

  headerIntervalId = setInterval( function() {
    const idmember = localStorage.getItem('idmember');
    if (!idmember || parseInt(idmember) <= 0) return;

    $.get(`/message?idmember=${idmember}&accept=json`, (data) => {
      if (data.success == false) return;

      let msg_seen_totals = getMsg_seen_totals() || [];
      const idmember = localStorage.getItem('idmember');

      // const totalSeenMessages = msg_seen_totals.filter( e => e.idmember == idmember ).reduce( (a, b) => a + b.total, 0);
      // console.log(data.messages.length, totalSeenMessages);

      // if (data.messages.length > totalSeenMessages) {
      //   if($('.t-label-new-my-message')) $('.t-label-new-my-message').remove();
      //   addLabelNewTo(document.querySelector('#my-messages'), "", "t-label-new-my-message");
      // };

      const pathname = window.location.pathname;
      const urlSearchParams = new URLSearchParams(window.location.search);
      const urlIdmember = urlSearchParams.get('idmember');
      const urlIdbook = urlSearchParams.get('idbook');

      if (pathname == '/message' && urlIdmember && parseInt(urlIdmember)) {
        if (!idbook) {
          // console.log('first view');
          const ss = document.querySelectorAll('.t-book-list .t-book-cover');
          
          for (let m of ss) {
            const msg_seen_totals = getMsg_seen_totals() || [];
            const filtered_msg_seen_totals = msg_seen_totals.filter( e => e.idbook == +m.getAttribute('data-idbook') );

            if (filtered_msg_seen_totals.length == 0) {
              if (m.querySelector('.t-label-new-book-cover')) m.querySelector('.t-label-new-book-cover').remove();
              addLabelNewToBookCover(m);
            };

            const totalSeenMessages = filtered_msg_seen_totals.reduce( (a, b) => a + b.total, 0 );
            const totalDataMessages = data.messages.filter( e => e.idbook == +m.getAttribute('data-idbook') ).length;

            if (totalDataMessages > totalSeenMessages) {
              if (m.querySelector('.t-label-new-book-cover')) m.querySelector('.t-label-new-book-cover').remove();
              addLabelNewToBookCover(m);
            };

          }
        } else if (urlIdbook && parseInt(urlIdbook) > 0) {
          if (!document.getElementById('btn-send')) {
            // console.log('second view');
            const ss = document.querySelectorAll('.t-user-item');
          
            for (let m of ss) {
              const msg_seen_totals = getMsg_seen_totals() || [];
              const id1 = localStorage.getItem('idmember');
              const id2 = m.classList[1].split('-')[1];
              const filtered_msg_seen_totals = msg_seen_totals.filter( e => e.idbook == urlIdbook && (e.idmember == id1 || e.idreceiver == id1) && (e.idmember == id2 || e.idreceiver == id2) );
              
              if (filtered_msg_seen_totals.length == 0) {
                if (m.querySelector('.t-label-new-user-item')) m.querySelector('.t-label-new-user-item').remove();
                addLabelNewTo(m, "", "t-label-new-user-item");
              };

              const totalSeenMessages = filtered_msg_seen_totals.reduce( (a, b) => a + b.total, 0 );
              const totalDataMessages = data.messages.filter( e => e.idbook == urlIdbook && (e.idmember == id1 || e.idreceiver == id1) && (e.idmember == id2 || e.idreceiver == id2) ).length;

              if (totalDataMessages > totalSeenMessages) {
                if (m.querySelector('.t-label-new-user-item')) m.querySelector('.t-label-new-user-item').remove();
                addLabelNewTo(m, "top:0px;padding-left:4px;", "t-label-new-user-item");
              };
            }
          } else {
            // console.log('"third" view');
            // nothing, handleclickonuser handles
          }
        }
      }
      
    });
  }, 500);
});