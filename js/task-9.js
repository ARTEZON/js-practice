const form = document.querySelector('#task-9 .registration-form');
const fields = {
    login:        document.getElementById('login'),
    pass:         document.getElementById('pass'),
    pass_confirm: document.getElementById('pass-confirm'),
    email:        document.getElementById('email'),
    phone:        document.getElementById('phone'),
    surname:      document.getElementById('surname'),
    name:         document.getElementById('name'),
    patronym:     document.getElementById('patronym'),
    genderMale:   document.getElementById('gender-male'),
    genderFemale: document.getElementById('gender-female'),
    birthdate:    document.getElementById('birthdate'),
    specialty:    document.getElementById('specialty'),
    skills:       document.getElementById('skills')
}

function submitForm(event) {
    event.preventDefault();
    clearAllErrorMsg(form);
    let error = false;
    let specialtyInput = fields.specialty;
    if (fields.pass.value !== fields.pass_confirm.value) {
        errorMsg(fields.pass_confirm, 'Пароли не совпадают.');
        scrollToElement(fields.pass);
        if (!error) error = true;
    }
    if (specialtyInput.value.length === 0) {
        errorMsg(specialtyInput, 'Необходимо выбрать один из вариантов.');
        scrollToElement(specialtyInput);
        if (!error) error = true;
    }
    let genderInput = [fields.genderMale, fields.genderFemale];
    if (!fields.genderMale.checked && !fields.genderFemale.checked) {
        let msgBox = document.getElementById('form-msg-gender');
        errorMsg(genderInput, 'Необходимо выбрать один из вариантов.', msgBox);
        scrollToElement(genderInput[0]);
        if (!error) error = true;
    }
    for (let textInput of [fields.login, fields.pass, fields.pass_confirm, fields.phone, fields.surname, fields.name].reverse()) {
        if (textInput.value.length === 0) {
            errorMsg(textInput);
            scrollToElement(textInput);
            if (!error) error = true;
        }
    }
    if (!fields.email.value.includes('@')) {
        errorMsg(fields.email, 'Email адрес должен содержать символ "@".');
        scrollToElement(fields.email)
        if (!error) error = true;
    }
    if (error) return;

    let skillsArray = [];
    for (let skill of fields.skills.getElementsByTagName('input')) {
        if (skill.checked) skillsArray.push(skill.nextElementSibling.innerHTML);
    }
    let birthdate = fields.birthdate.value;
    if (birthdate.length) birthdate = new Date(birthdate).toLocaleDateString('ru');
    else birthdate = 'не задана';

    alert(
`Поздравляем, вы были успешно зарегистрированы!

Ваш логин: ${fields.login.value}
Ваш пароль: ${fields.pass.value}
Ваш email: ${fields.email.value}
Ваш телефон: ${fields.phone.value}
Ваше ФИО: ${fields.surname.value} ${fields.name.value} ${fields.patronym.value}
Ваш пол: ${fields.genderMale.checked ? 'мужской' : 'женский'}
Ваша дата рождения: ${birthdate}
Ваша специальность: ${fields.specialty.value}
Ваши навыки: ${skillsArray.length ? skillsArray.join(', ') : 'нет навыков :('}`
    );
}

function check(event) {
    if (event.target === fields.pass || event.target === fields.pass_confirm) {
        if (fields.pass.value !== fields.pass_confirm.value) {
            clearErrorMsg(form, fields.pass_confirm)
            errorMsg(fields.pass_confirm, 'Пароли не совпадают.');
        }
    }
    if (event.target === fields.specialty && fields.specialty.value.length === 0) {
        clearErrorMsg(form, event.target)
        errorMsg(event.target, 'Необходимо выбрать один из вариантов.');
    }

    for (let textInput of [fields.login, fields.pass, fields.pass_confirm, fields.phone, fields.surname, fields.name].reverse()) {
        if (event.target === textInput && textInput.value.length === 0) {
            clearErrorMsg(form, event.target)
            errorMsg(event.target);
        }
    }
    if (event.target === fields.email && !fields.email.value.includes('@')) {
        clearErrorMsg(form, event.target)
        errorMsg(event.target, 'Email адрес должен содержать символ "@".');
    }
}

form.onsubmit = submitForm;
document.getElementById('clear-button').onclick = () => clearForm(form);
form.onchange = (e) => clearErrorMsg(form, e.target);
form.oninput = (e) => clearErrorMsg(form, e.target);
fields.specialty.onfocus = (e) => clearErrorMsg(form, e.target);
fields.genderMale.oninput = () => clearErrorMsg(form, [fields.genderMale, fields.genderFemale]);
fields.genderFemale.oninput = () => clearErrorMsg(form, [fields.genderMale, fields.genderFemale]);
for (let field of Object.values(fields)) {
    field.onblur = (e) => check(e);
}