const vanishingArray = Array.from(document.querySelectorAll('#task-4 .vanishing-block'));
let lastVanishedElement = -1;

function vanish() {
    if (lastVanishedElement !== -1) lastVanishedElement.style.opacity = '100%';
    const randomElement = vanishingArray[Math.floor(Math.random() * vanishingArray.length)];
    randomElement.style.opacity = '0';
    lastVanishedElement = randomElement;
}

let taskOpened = false;
let timer;
document.getElementById('task-4-button').addEventListener('click', () => {
    if (!taskOpened) timer = setInterval(vanish, 120);
    else clearInterval(timer);
    taskOpened = !taskOpened;
});