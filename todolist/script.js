$(document).ready(() => addNew(false));
const table = $('.todo-list')[0];
$(table).on('input', onInput);
$(window).on('beforeunload', e => {
    if (table.childElementCount > 1) return false;
});

function addNew(slide = true) {
    const task = $('<tr class="todo-task new"></tr>');
    task.append($('<td class="todo-task-checkmark"><div><label class="checkbox"><input type="checkbox" disabled><span class="tick"></span></label></div></td>'));
    task.append($('<td class="todo-task-title"><div><textarea></textarea></div></td>'));
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
}

function onInput(e) {
    const target = e.target;
    const task = $(target).parent().parent().parent();
    if (task.hasClass('new')) {
        task.removeClass('new');
        $(target).attr('placeholder', 'Без названия');
        task.find('input').removeAttr('disabled');
        addNew();

        // drag and drop
        task[0].addEventListener('mousedown', mouseDownHandler);
    }
    $(target).css('height', '0');
    $(target).css('height', String(target.scrollHeight) + 'px');
}