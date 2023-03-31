const parentPadding = 30;
const objWidth = 30;
const step = 20;

for (let obj of document.getElementsByClassName('task-6-object')) {
    obj.style.backgroundColor = `hsl(${Math.floor(Math.random() * 360)} 50% 50%)`;
    obj.setAttribute('xPercent', '100');
    obj.onmouseover = function() {
        let parentWidth = obj.parentElement.clientWidth - parentPadding;
        let deltaPercent = step * 100 / parentWidth;
        let xPercent = parseFloat(obj.getAttribute('xPercent'));
        let xPercentNew = xPercent - deltaPercent;
        if (xPercentNew < objWidth * 100 / parentWidth) xPercentNew = 100;
        obj.setAttribute('xPercent', String(xPercentNew));
        obj.style.left = `calc(${xPercentNew}% - ${objWidth}px)`;
    }
}