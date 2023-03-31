let task3_content = document.querySelector('#task-3 > .task-content');
task3_content.innerHTML = `<p>Количество форм на странице: ${String(document.forms.length)}</p>${task3_content.innerHTML}`;