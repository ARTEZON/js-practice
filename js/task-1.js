function datetime() {
    let now = new Date();
    let date = fillZeros(now.getDate());
    let month = fillZeros(now.getMonth() + 1);
    let year = now.getFullYear();
    let weekday = now.toLocaleDateString('ru', {weekday: 'long'});
    let dateStr = date + "-" + month + "-" + year + ", " + weekday;
    document.getElementById('date').innerHTML = dateStr;

    let hours = now.getHours();
    let minutes = fillZeros(now.getMinutes());
    let seconds = fillZeros(now.getSeconds());
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    hours = fillZeros(hours);
    let timeStr = hours + '/' + minutes + '/' + seconds + ' ' + ampm;
    document.getElementById('time').innerHTML = timeStr;
}

function fillZeros(number, length = 2) {
    return String(number).padStart(length, '0');
}

datetime()
setInterval(datetime, 1000);