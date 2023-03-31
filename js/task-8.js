const image = document.querySelector('#task-8-container > img');

image.onmouseover = function() {
    image.style.opacity = '0';
}

image.onmouseout = function() {
    image.style.opacity = '100%';
}