$(document).ready(() => addNew(false));
const container = $('.todo-container');
try {
    new ResizeObserver(() => {
        container.find('textarea').each((i, textarea) => {
            $(textarea).css('height', '0');
            $(textarea).css('height', String(textarea.scrollHeight) + 'px');
        })
    }).observe(container[0]);
}
catch (e) {}
const table = $('.todo-list')[0];
$(table).on('input', onInput);
$('#clear-button').on('click', () => {
    if (confirm('Очистить список?')) {
        $('.todo-task:not(.new)').each((i, task) => task.remove());
        $('.todo-title')[0].firstElementChild.textContent = ':: todolist ::';
        unsavedChanges = true;
        save();
    }
});
$('#save-button').on('click', () => save(true));
$('.todo-title > span').on('input', () => save());
$(document).on('DOMContentLoaded', load);
$(window).on('beforeunload', () => {
    if (unsavedChanges) return false;
});

const saveStatus = $('#save-status')[0];
let autosave = true;
let saveDelay = 500;
let saveTimer;
let unsavedChanges = false;

function addNew(slide = true, checked = false) {
    const task = $('<tr class="todo-task new"></tr>');
    task.append($(`<td class="todo-task-checkmark"><div><label class="checkbox"><input type="checkbox"${checked ? ' checked' : ''} disabled><span class="tick"></span></label></div></td>`));
    task.append($('<td class="todo-task-title"><div><textarea></textarea></div></td>'));
    if (checked) task.find('label').addClass('checked');
    task.on('keydown', (e) => {
        if (!e.shiftKey) {
            let preventDefault = true;
            switch (e.key) {
                case 'Enter':
                    if (!task.hasClass('new'))
                        task.next().find('textarea').focus();
                    break;
                case 'ArrowDown':
                    let next = task.next();
                    if (next.length) next.find('textarea').focus();
                    break;
                case 'ArrowUp':
                    let prev = task.prev();
                    if (prev.length) prev.find('textarea').focus();
                    break;
                default: preventDefault = false;
            }
            if (preventDefault) e.preventDefault();
        }
    });
    task[0].querySelector('input[type=checkbox]').oninput = (e) => {
        e.target.checked
        ? e.target.parentElement.classList.add('checked')
        : e.target.parentElement.classList.remove('checked');
    }
    task.appendTo(table);
    if (slide) {
        task.find('div').css('display', 'none');
        task.find('div').slideDown(100);
    }
    return task;
}

function onInput(e) {
    const target = e.target;
    if (target.tagName.toLowerCase() === 'textarea') {
        const task = $(target).parent().parent().parent();
        updateTask(task, target, true);
    }
    save();
}

function updateTask(task, textarea, appendEmptyTask = false) {
    if (task.hasClass('new')) {
        task.removeClass('new');
        $(textarea).attr('placeholder', 'Без названия');
        task.find('input').removeAttr('disabled');
        if (appendEmptyTask) addNew();

        // drag and drop
        task[0].addEventListener('mousedown', mouseDownHandler);
    }
    $(textarea).css('height', '0');
    $(textarea).css('height', String(textarea.scrollHeight) + 'px');
}

function save(forced = false) {
    unsavedChanges = true;
    saveStatus.textContent = autosave ? 'Ожидание сохранения...' : 'Есть несохранённые изменения';

    if (autosave || forced) {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            try {
                const list = [];
                $('.todo-task:not(:last-child)').each((i, taskElement) => {
                    list.push({
                        task: taskElement.querySelector('textarea').value,
                        done: taskElement.querySelector('input').checked
                    });
                })
                const data = {title: $('.todo-title')[0].firstElementChild.textContent, list}
                localStorage.setItem('saved-tasks', JSON.stringify(data));
                unsavedChanges = false;
                saveStatus.textContent = 'Сохранено';
            }
            catch (e) { autosave = false; }
        }, forced ? 1 : saveDelay);
    }
}

function load() {
    try {
        const autosaveSetting = localStorage.getItem('autosave-tasks');
        if (autosaveSetting !== null) autosave = autosaveSetting === 'true';
        else {
            try { localStorage.setItem('autosave-tasks', autosave); }
            catch (e) { autosave = false; }
        }
        $('#autosave-label').prepend(`<input type="checkbox" id="autosave-checkbox"${autosave ? ' checked' : ''}>`)
        const autosaveCheckbox = $('#autosave-checkbox');
        autosaveCheckbox.on('input', (e) => {
            autosave = e.target.checked;
            if (autosave) save(true);
            try { localStorage.setItem('autosave-tasks', autosave); }
            catch (e) { autosaveCheckbox.disabled = true; }
        });

        const json = localStorage.getItem('saved-tasks');
        if (json !== null) {
            const data = JSON.parse(json);
            $('.todo-title')[0].firstElementChild.textContent = data.title;
            data.list.forEach(taskData => {
                const taskElement = addNew(false, taskData.done)[0];
                const textarea = taskElement.querySelector('textarea');
                textarea.value = taskData.task;
                updateTask($(taskElement), textarea);
            });
        }
    }
    catch (e) { autosave = false; }

    container.removeClass('fadein');
}