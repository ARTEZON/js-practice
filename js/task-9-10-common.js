function scrollToElement(elem, center = false) {
    let where = center ? 'center' : 'nearest';
    elem.scrollIntoView({ behavior: 'smooth', block: where, inline: where });
}

function clearForm(form) {
    clearAllErrorMsg(form);
    form.reset();
    scrollToElement(form.parentElement.querySelector('.register-header'));
}

function errorMsg(target, msg = 'Данное поле обязательно для заполнения.', msgBox = null) {
    if (Array.isArray(target)) {
        for (let option of target) option.classList.add('error-red');
        target = target[0];
    }
    else target.classList.add('error-red');
    let errorMessage = document.createElement('label');
    errorMessage.innerHTML = msg;
    errorMessage.classList.add('form-error-message')
    errorMessage.setAttribute('for', target.id)
    if (msgBox == null) target.after(errorMessage)
    else msgBox.appendChild(errorMessage);
}

function clearErrorMsg(form, target) {
    if (Array.isArray(target)) {
        for (let option of target) option.classList.remove('error-red');
        target = target[0];
    }
    else target.classList.remove('error-red');
    let msg = form.querySelector(`.form-error-message[for=${target.id}]`);
    if (msg) msg.remove();
}

function clearAllErrorMsg(form) {
    for (let target of form.querySelectorAll('.form-error-message')) {
        target.remove();
    }
    for (let target of form.querySelectorAll('.error-red')) {
        target.classList.remove('error-red');
    }
}