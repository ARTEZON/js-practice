loadSettings();

let delay = 0;
for (let task of document.getElementsByClassName('task-wrapper')) {
    delay += 50;
    setTimeout(() => task.classList.remove('fadein'), delay);
}

function expandTask(taskId) {
    let taskObject = document.getElementById(taskId);
    if (!taskObject.hasAttribute('show')) {
        taskObject.style.display = 'block';
        taskObject.style.maxHeight = String(taskObject.scrollHeight) + 'px';
        taskObject.style.overflow = 'hidden';
        setTimeout(() => {
            if (taskObject.hasAttribute('show')) {
                taskObject.style.maxHeight = 'none';
                taskObject.style.overflow = 'visible';
            }
        }, 500);
        taskObject.setAttribute('show', '');
        let button = document.getElementById(taskId + '-button');
        button.innerHTML = button.innerHTML.replace('➕', '➖');
    }
    else {
        taskObject.style.maxHeight = String(taskObject.scrollHeight) + 'px';
        taskObject.style.overflow = 'hidden';
        setTimeout(() => {
            taskObject.style.maxHeight = '0';
            setTimeout(() => {
                if (!taskObject.hasAttribute('show')) {
                    taskObject.style.display = 'none';
                    taskObject.style.overflow = 'visible';
                }
            }, 500);
        }, 1);
        taskObject.removeAttribute('show');
        let button = document.getElementById(taskId + '-button');
        button.innerHTML = button.innerHTML.replace('➖', '➕');
    }
}

function loadSettings() {
    try {
        const theme = localStorage.getItem('theme');
        if (theme !== null) setTheme(theme);
        else localStorage.setItem('theme', 'light');
        return true;
    }
    catch(e) {
        return false;
    }
}