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


// thêm 0 sao, và có 2 loại sao "far fa-star" vs "fas fa-star"
function creditScoreToHTMLStar(score) {
  if (score < 0.5) {
    return `<i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>`
  }
  else if (score < 1.5) {
    return `<i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>`
  }
  else if (score < 2.5) {
    return `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>`
  }
  else if (score < 3.5) {
    return `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>`
  }
  else if (score < 4.5) {
    return `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i>`
  }
  else {
    return `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>`
  }
}


function forceLogin() {
  const idmember = localStorage.getItem('idmember');
  if ( !idmember || parseInt(idmember) <= 0 ){
    alert('Please login first.');
    window.location.href = '/';
  }
}


function addLabelNewTo(element, additionalCSS="", className=""){
  const labelNew = document.createElement('span');
  labelNew.className = className || 't-label-new';
  labelNew.style = "color:red;position:relative;top:-10px;text-decoration:none;display:inline-block;" + additionalCSS;
  labelNew.innerText = "(new)";
  element.append(labelNew);
}


function addLabelNewToBookCover(bookCoverElement){
  addLabelNewTo(bookCoverElement, "float:right;width:0px;", "t-label-new-book-cover", CSS);
}


function getMsg_seen_totals(){
  const rv = JSON.parse(localStorage.getItem('msg_seen_totals'));
  if (rv) {
    return rv;
  } else {
    return [];
  };
}


function setMsg_seen_totals(theObj){
  localStorage.setItem('msg_seen_totals', JSON.stringify(theObj));
}