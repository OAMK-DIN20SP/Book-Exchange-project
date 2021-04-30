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
      console.log( 'Data responded from server:', data);
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
      console.log(data.success);
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

    const headerElem = document.querySelector('.header-navbar');
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
});