function toggleMenu(btn, dropdown) {
    let duration = dropdown.childElementCount > 0 ? dropdown.childElementCount * 150 : 150;
    document.documentElement.style.setProperty('--duration', String(duration) + 'ms')
    if (!dropdown.classList.contains('shown')) {
        dropdown.classList.add('shown');
        dropdown.style.transform = 'translateY(0%)';
        container.style.height = String(container.scrollHeight) + 'px';
        setTimeout(() => {
            if (dropdown.classList.contains('shown')) container.style.height = 'auto';
        }, duration);
    }
    else {
        dropdown.classList.remove('shown');
        dropdown.style.transform = 'translateY(-100%)';
        container.style.height = String(container.scrollHeight) + 'px';
        setTimeout(() => {
            container.style.height = '0';
        }, 1);
    }
}

function remove(event, callback) {
    const target = event.target;
    if (target.nodeName !== 'LI' || target.hasAttribute('clicked')) return;
    target.toggleAttribute('clicked');
    const h = String(target.offsetHeight) + 'px';
    const duration = 500;
    const removeAnimation = [
        { opacity: '100%', height: h, padding: '10px' },
        { opacity: '0', height: h, padding: '10px'},
        { opacity: '0', height: '0', padding: '0' }
    ]

    const animation = target.animate(removeAnimation, duration);
    animation.onfinish = () => callback(target);
}

function removed(elem) {
    elem.remove();
    const content = document.querySelector('#task-7 > .task-content');
    if (!content.querySelector('ul.dropdown').childElementCount) {
        const ended = content.querySelector('.sweets-ended');
        ended.style.display = 'block';
        ended.style.setProperty('--height', String(ended.scrollHeight) + 'px');
        ended.style.animation = '0.5s 1 forwards show-message';
    }
}

function reset() {
    const sweets = ['Пирожное', 'Конфета', 'Мармелад', 'Зефир', 'Пряник', 'Шоколад', 'Печенье'];
    dropdown.innerHTML = sweets.map(x => (`<li>${x}</li>`)).join('');
    document.querySelector('.sweets-ended').style.display = 'none';
}

const btn = document.querySelector('.sweets-menu-container > button');
const dropdown = document.querySelector('ul.dropdown');
const container = dropdown.parentElement;
const btnReset = document.getElementById('sweets-reset');
btn.onclick = e => toggleMenu(e.target, dropdown);
dropdown.onclick = e => remove(e, removed);
btnReset.onclick = reset;
// container.ontransitioncancel = () => container.ontransitionend = () => {}