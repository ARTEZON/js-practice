const task10_form = document.querySelector('#task-10 .registration-form');
const task10_fields = {
    login:        document.getElementById('login--task10'),
    pass:         document.getElementById('pass--task10'),
    pass_confirm: document.getElementById('pass-confirm--task10'),
    email:        document.getElementById('email--task10'),
    phone:        document.getElementById('phone--task10'),
    surname:      document.getElementById('surname--task10'),
    name:         document.getElementById('name--task10'),
    patronym:     document.getElementById('patronym--task10'),
    genderMale:   document.getElementById('gender-male--task10'),
    genderFemale: document.getElementById('gender-female--task10'),
    birthdate:    document.getElementById('birthdate--task10'),
    specialty:    document.getElementById('specialty--task10'),
    skills:       document.getElementById('skills--task10')
}
const regexp = {
    login:     /^(?=.*[a-zA-Z])[A-Za-z0-9_\-]*$/,
    login_any: /^[A-Za-z0-9_\-]*$/,
    pass:      /^[A-Za-z0-9_\-+.@$!%*?&#^()]*$/,
    email:     /^([a-zA-Z0-9_+-]{2,}(?:\.[a-zA-Z0-9_+-]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)$/,
    name:      /^([а-яё]+|[a-z]+)$/i
}

function task10_SubmitForm(event) {
    event.preventDefault();
    clearAllErrorMsg(task10_form);
    let ok = true;

    let login      = checkLogin(task10_fields.login);
    let pass       = checkPass(task10_fields.pass);
    let email      = checkEmail(task10_fields.email);
    let phone      = checkPhone(task10_fields.phone);
    let surname    = checkName(task10_fields.surname, true, 1);
    let name       = checkName(task10_fields.name, true, 2);
    let patronym   = checkName(task10_fields.patronym, false, 3);
    let gender     = checkGender(task10_fields.genderMale, task10_fields.genderFemale);
    let birthdate  = checkBirthdate(task10_fields.birthdate);
    let specialty  = checkSpecialty(task10_fields.specialty);
    let skills     = checkSkills(task10_fields.skills);

    if (!task10_fields.pass_confirm.value.length) checkPass(task10_fields.pass_confirm);
    if (!checkPassMatch(task10_fields.pass, task10_fields.pass_confirm)) pass = undefined;

    if      (login     === undefined) { ok = false; scrollToElement(task10_fields.login); }
    else if (pass      === undefined) { ok = false; scrollToElement(task10_fields.pass); }
    else if (email     === undefined) { ok = false; scrollToElement(task10_fields.email); }
    else if (phone     === undefined) { ok = false; scrollToElement(task10_fields.phone); }
    else if (surname   === undefined) { ok = false; scrollToElement(task10_fields.surname); }
    else if (name      === undefined) { ok = false; scrollToElement(task10_fields.name); }
    else if (gender    === undefined) { ok = false; scrollToElement(task10_fields.genderMale.nextElementSibling); }
    else if (specialty === undefined) { ok = false; scrollToElement(task10_fields.specialty); }

    if (ok) alert(`Поздравляем, вы были успешно зарегистрированы!

Ваш логин: ${login}
Ваш пароль: ${pass}
Ваш email: ${email}
Ваш телефон: ${phone}
Ваше ФИО: ${surname} ${name} ${patronym}
Ваш пол: ${gender}
Ваша дата рождения: ${birthdate}
Ваша специальность: ${specialty}
Ваши навыки: ${skills}`);
}

function checkLogin(field) {
    let login = field.value.trim();
    field.value = login;
    if (!login.length) errorMsg(field);
    else if (login.length < 3) errorMsg(field, 'Слишком короткий логин.');
    else if (login.length > 20) errorMsg(field, 'Длина логина не должна превышать 20 символов.');
    else if (regexp.login.test(login)) return login;
    else if (regexp.login_any.test(login)) errorMsg(field, 'В логине должна присутствовать хотя бы одна буква.');
    else errorMsg(field, 'Логин может содержать только буквы латинского алфавита, цифры, тире и знаки подчёркивания.');
}

function checkPass(field) {
    let pass = field.value;
    if (!pass.length) errorMsg(field);
    else if (!regexp.pass.test(pass)) errorMsg(field, 'Пароль содержит недопустимые символы.');
    else if (pass.length < 8)    errorMsg(field, 'Минимальная длина пароля - 8 символов.');
    else if (pass.length > 64)   errorMsg(field, 'Слишком длинный пароль.');
    else return pass;
}

function checkPassMatch(field1, field2) {
    let match = field1.value === field2.value;
    if (!match && field2.value.length) errorMsg(field2, 'Пароли не совпадают.');
    return match;
}

function checkEmail(field) {
    let email = field.value.trim();
    field.value = email;
    if (!email.length) errorMsg(field);
    else if (!email.includes('@')) errorMsg(field, 'Email должен содержать символ "@".');
    else if (email.length < 3) errorMsg(field, 'Слишком короткий Email.');
    else if (email.length > 320) errorMsg(field, 'Слишком длинный Email.');
    else if (regexp.email.test(email)) return email;
    else errorMsg(field, 'Введён некорректный Email.');
}

function checkPhone(field) {
    let phone = field.value;
    if (phone.length) {
        let min = 10;
        if (phone.startsWith('+7')) min = 11;
        if (phone.replace(/\D/g, '').length >= min) return phone;
        else errorMsg(field, 'Слишком короткий номер телефона.');
    }
    else errorMsg(field);
}

function checkName(field, required, type) {
    let name = field.value.trim();
    if (!name.length) {
        if (required) errorMsg(field);
        else return '';
    }
    else if (name.length < 2 || name.length > 20) {
        let msg = 'Недопустимая длина.';
        switch (type) {
            case 1: msg = 'Введена слишком короткая или слишком длинная фамилия.'; break;
            case 2: msg = 'Введено слишком короткое или слишком длинное имя.'; break;
            case 3: msg = 'Введено слишком короткое или слишком длинное отчество.';
        }
        errorMsg(field, msg);
    }
    else if (regexp.name.test(name)) {
        let fixedCaseName = name[0].toUpperCase() + name.slice(1).toLowerCase();
        field.value = fixedCaseName;
        return fixedCaseName;
    }
    else {
        let msg = 'Недопустимый формат.';
        switch (type) {
            case 1: msg += ' Фамилия должна быть записана'; break;
            case 2: msg += ' Имя должно быть записано'; break;
            case 3: msg += ' Отчество должно быть записано';
        }
        msg += ' кириллицей или латиницей без пробелов и знаков препинания.'
        errorMsg(field, msg);
    }
}

function checkGender(fieldMale, fieldFemale) {
    if (fieldMale.checked || fieldFemale.checked)
        return fieldMale.checked ? 'мужской' : 'женский';
    else {
        let msgBox = document.getElementById('form-msg-gender--task10');
        errorMsg([fieldMale, fieldFemale], 'Необходимо выбрать один из вариантов.', msgBox);
    }
}

function checkBirthdate(field) {
    let birthdate = field.value;
    if (birthdate.length) {
        birthdate = new Date(birthdate);
        let min = new Date('1900-01-01');
        let today = new Date()
        if (min <= birthdate && birthdate <= today) birthdate = birthdate.toLocaleDateString('ru');
        else {
            if (birthdate > today) errorMsg(field, 'Здравствуй, гость из будущего! К сожалению, мы не сможем тебя зарегистрировать 😢. Попробуй вписать другую дату...');
            else errorMsg(field, 'Недопустимая дата.');
            return;
        }
    }
    else birthdate = 'не задана';
    return birthdate;
}

function checkSpecialty(field) {
    if (field.value.length) return field.value;
    else errorMsg(field, 'Необходимо выбрать один из предложенных вариантов.');
}

function checkSkills(field) {
    let skills = [];
    for (let skill of field.getElementsByTagName('input')) {
        if (skill.checked) skills.push(skill.nextElementSibling.innerHTML);
    }
    skills = skills.length ? skills.join(', ') : 'нет навыков :('
    return skills;
}

function phoneFormatting(field) {
    let phone = field.value;
    if (phone.length) {
        let phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length <= 11) {
            if (['7', '8'].includes(phoneDigits[0])) {
                phone = '+7' + phoneDigits.slice(1);
                if (phoneDigits.length > 1) phone = phone.slice(0, 2) + ' ' + phone.slice(2);
                if (phoneDigits.length > 4) phone = phone.slice(0, 6) + ' ' + phone.slice(6);
                if (phoneDigits.length > 7) phone = phone.slice(0, 10) + '-' + phone.slice(10);
                if (phoneDigits.length > 9) phone = phone.slice(0, 13) + '-' + phone.slice(13);
            }
        }
        else {
            phone = phone.replace(/[^\d+]/g, '');
            phoneDigits = phone.replace(/\D/g, '');
            if (phoneDigits.length > 15) {
                phone = (phone[0] === '+' ? '+' : '') + phoneDigits.slice(0, 15);
            }
        }
    }
    field.value = phone;
}

task10_form.onsubmit = task10_SubmitForm;
document.getElementById('clear-button--task10').onclick = () => clearForm(task10_form);
task10_form.onchange = (e) => clearErrorMsg(task10_form, e.target);
task10_form.oninput = (e) => clearErrorMsg(task10_form, e.target);
task10_fields.specialty.onfocus = (e) => clearErrorMsg(task10_form, e.target);
task10_fields.phone.oninput = (e) => phoneFormatting(e.target);
task10_fields.genderMale.oninput = () => clearErrorMsg(task10_form, [task10_fields.genderMale, task10_fields.genderFemale]);
task10_fields.genderFemale.oninput = () => clearErrorMsg(task10_form, [task10_fields.genderMale, task10_fields.genderFemale]);
task10_fields.login.onblur = (e) => {
    clearErrorMsg(task10_form, e.target);
    checkLogin(e.target);
}
task10_fields.pass.onblur = (e) => {
    clearErrorMsg(task10_form, e.target);
    clearErrorMsg(task10_form, task10_fields.pass_confirm);
    checkPass(e.target);
    checkPassMatch(task10_fields.pass, task10_fields.pass_confirm);
}
task10_fields.pass_confirm.onblur = (e) => {
    clearErrorMsg(task10_form, e.target);
    if (!e.target.value.length) checkPass(e.target);
    else checkPassMatch(task10_fields.pass, task10_fields.pass_confirm);
}
task10_fields.email.onblur = (e) => {
    clearErrorMsg(task10_form, e.target);
    checkEmail(e.target);
}
task10_fields.phone.onblur = (e) => {
    clearErrorMsg(task10_form, e.target);
    checkPhone(e.target);
}
task10_fields.surname.onblur = (e) => {
    clearErrorMsg(task10_form, e.target);
    checkName(e.target, true, 1);
}
task10_fields.name.onblur = (e) => {
    clearErrorMsg(task10_form, e.target);
    checkName(e.target, true, 2);
}
task10_fields.patronym.onblur = (e) => {
    clearErrorMsg(task10_form, e.target);
    checkName(e.target, false, 3);
}
task10_fields.specialty.onblur = (e) => {
    clearErrorMsg(task10_form, e.target);
    checkSpecialty(e.target, false, 3);
}