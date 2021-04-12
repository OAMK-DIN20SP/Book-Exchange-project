async function postData(url = '', data = {}) {
// How to use: postData('url', { ... }).then( data => { //function here })
// Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}


function insertHiddenIdmemberTo(parent) {
  const idmemberElem = document.createElement('input');
  idmemberElem.type = 'hidden';
  idmemberElem.name = 'idmember';
  idmemberElem.value = localStorage.getItem('idmember');
  parent.appendChild(idmemberElem);
}
  

function logout() {
  const idmember = localStorage.getItem('idmember');
  if (idmember && parseInt(idmember) > 0) {
    localStorage.removeItem('idmember');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
  }
}