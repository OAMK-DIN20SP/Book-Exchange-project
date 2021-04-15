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
    $.post( '/member/add', $('form.signup-form').serialize(), (data, status) => {
      console.log(data.success);
      alert(data.message);
      if (data.success) {
        openLoginForm();
      }
    });
  });

  $(document).mouseup(function(e) 
  {
      var container = $("#user-avatar-menu-panel");

      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) 
      {
          container.hide();
      }
  });

  const idmember = localStorage.getItem('idmember');

  if (idmember && parseInt(idmember) > 0) {
    document.querySelector("button.signup-button").parentNode.remove();
    document.querySelector("button.login-button").parentNode.remove();

    const headerElem = document.body.querySelector('.header_navbar ul');
    headerElem.innerHTML += `
      <li><a id="my-profile" href="/member?idmember=${idmember}">Profile</a></li>
      <li><a id="my-messages" href="/message?idmember=${idmember}">Messages</a></li>
      `;


    const firstname = localStorage.getItem('firstname');
    const userAvatarElem = document.createElement('li');
    userAvatarElem.id = "user-avatar";
    // userAvatarElem.innerText = `Hi, ${firstname}!`;
    userAvatarElem.style = `
      background-image: url(http://localhost:3000/images/avatar.jpg);
      background-size: cover;
      display: block;
      width: 32px;
      height: 32px;
      border-radius: 50%;
    `;
    headerElem.append(userAvatarElem);
    
    const lastname = localStorage.getItem('lastname'); 
    let userAvatarMenuPanelElem = document.createElement('div');
    userAvatarMenuPanelElem.innerHTML = `
       <div id="user-avatar-menu-panel" style="display: none; background: white; position: fixed; width: 120px; padding-top: 10px;">
         <div style="display: flex; flex-direction: column; align-items: center;">
           <img src="/images/avatar.jpg" style="width: 80px; height: 80px">
           <h4 style="text-transform: capitalize;">${firstname + ' ' + lastname}</h4>
           <button id="btn-logout">Log Out</button>
         </div>
       </div>`;
    headerElem.append(userAvatarMenuPanelElem);

    $('#user-avatar').click( () => {
      $('#user-avatar-menu-panel').show();  
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