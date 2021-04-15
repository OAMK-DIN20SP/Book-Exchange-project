

//start thuc:signup update data validation

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

    function validateForm2() {
    return validate(document.forms.signupForm["name"])
        && validate(document.forms.signupForm["email"])
        && validate(document.forms.signupForm["password"])
        && validatePasswordMatch();
    }

//end thuc:signup update data validation


//profile pages

    function toggleEdit() {
        let editMyProfileButton = document.getElementById('edit-my-profile');

        if (editMyProfileButton.innerText == 'Edit my profile'){  //contentEditable == false
            editMyProfileButton.innerText = 'Done editing';
        } else {
            editMyProfileButton.innerText = 'Edit my profile';
        }
        
        for (let element of document.getElementsByName('profile-info-to-edit')){
            element.onkeypress = (event) => {
                if (event.key == 'Enter') {
                    event.preventDefault();
                }
            }

                if (element.isContentEditable == false){
                element.contentEditable = true;
                element.classList.remove('non-editable');
                element.classList.add('editable');
                } else {
                element.contentEditable = false;
                element.classList.remove('editable');
                element.classList.add('non-editable');
                }
        }
    }

    const element = document.getElementById('edit-my-profile');
    if (element) element.onclick=toggleEdit;

    