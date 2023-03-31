function swap() {
    const list = document.getElementById('task-5-list');
    const childCount = list.childElementCount;

    let elem = prompt('Введите номер элемента, который нужно поменять со следующим:');
    if (elem == null) return;
    elem = parseInt(elem);
    if (isNaN(elem)) { alert('Вы ввели не число!'); return; }
    if (elem <= 0 || elem > childCount) {
        alert(`Элемента с номером ${elem} не существует`);
        return;
    }
    if (elem === childCount) {
        alert(`Не могу поменять ${elem}-й элемент со следующим, так как слудующего элемента нет.`);
        return;
    }

    let first = list.querySelector(`li:nth-child(${elem})`);
    let second = list.querySelector(`li:nth-child(${elem + 1})`);
    second.after(first);
}

document.getElementById('swap-list-items-button').addEventListener('click', swap);