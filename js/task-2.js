const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function addCalendar(container, date = new Date()) {
    container.innerHTML += '<div class="calendar-wrapper"></div>';
    let wrapper = container.lastElementChild;
    let month = date.getMonth();
    let year = date.getFullYear();
    let monthString = monthNames[month];
    date.setDate(1);
    let weekDay = date.getDay();
    if (weekDay === 0) weekDay = 7;
    let daysCount = new Date(year, month + 1, 0).getDate();

    let calendar = `<p class="month-name">${monthString}</p>`;
    calendar += '<table class="calendar"><tr>';
    for (let i = 0; i < 7; i++) calendar += `<th>${weekDays[i]}</th>`;
    calendar += '</tr><tr>';
    for (let i = 0; i < weekDay - 1; i++) calendar += '<td></td>';
    for (let day = 1; day <= daysCount; day++) {
        if (weekDay === 1) calendar += '<tr>';
        calendar += `<td${([6, 7].includes(weekDay)) ? ' class="day-off"' : ''}>${day}</td>`;
        weekDay++;
        if (weekDay === 8) {
            weekDay = 1;
            calendar += '</tr>';
        }
    }
    if (weekDay !== 1) {
        for (let i = 0; i <= 7 - weekDay; i++) calendar += '<td></td>';
        calendar += '</tr>';
    }
    calendar += '</table>';

    wrapper.innerHTML = calendar;
}


let task2_content = document.querySelector('#task-2 > .task-content');
addCalendar(task2_content);