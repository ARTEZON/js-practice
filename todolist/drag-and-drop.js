let draggingRow;
let draggingElement;
let placehodler;
let isDraggingStarted = false;
let mouseX, mouseY, mouseElementX, mouseElementY;
const tint = document.createElement('div');
tint.classList.add('tint');
tint.style.width = '100%';
tint.style.height = '100%';
tint.style.top = '0';
tint.style.left = '0';
tint.style.position = 'absolute';
tint.style.zIndex = '10';
tint.style.backgroundColor = 'rgba(255,0,0,0.5)'
let remove;

function mouseDownHandler(e) {
    draggingRow = this;
    remove = false;

    $(document).on('mousemove', mouseMoveHandler);
    $(document).on('mouseup', mouseUpHandler);
    Array.from(table.querySelectorAll('tr:not(.dragging-element)')).forEach(row => {
        $(row).on('mouseover', mouseOverHandler);
    })
}

function mouseMoveHandler(e) {
    if (!isDraggingStarted) {
        const width = $(table).width();

        draggingElement = draggingRow.cloneNode(true);
        draggingElement.classList.add('dragging-element')
        draggingElement.style.width = width + 'px';
        draggingElement.style.position = 'fixed';
        draggingElement.style.backgroundColor = '#fff';
        draggingElement.style.boxShadow = '0 0 0.5em rgba(0,0,0,0.2)';
        draggingElement.style.borderRadius = '0.4em';
        draggingElement.style.overflow = 'hidden';
        draggingElement.style.transform = 'scale(1)';
        $('.todo-list').append(draggingElement);

        placehodler = document.createElement('div');
        placehodler.classList.add('placeholder');
        placehodler.style.width = width + 'px';
        placehodler.style.height = draggingRow.scrollHeight + 'px';
        placehodler.style.position = 'absolute';
        placehodler.style.left = '0';
        placehodler.style.top = '0';
        placehodler.style.backgroundColor = '#efe';
        placehodler.style.boxShadow = 'inset 0 2px 30px #9a9';
        $(draggingRow).append(placehodler);

        const rect = draggingRow.getBoundingClientRect();
        mouseElementX = e.clientX - rect.left;
        mouseElementY = e.clientY - rect.top;

        isDraggingStarted = true;
    }

    mouseX = e.clientX;
    mouseY = e.clientY;

    draggingElement.style.left = `${mouseX - mouseElementX}px`;
    draggingElement.style.top = `${mouseY - mouseElementY}px`;

    if (document.elementFromPoint(mouseX, mouseY).classList.contains('wrapper')) {
        if (!remove) draggingElement.appendChild(tint);
        remove = true;
    }
    else {
        if (remove) draggingElement.querySelector('.tint').remove();
        remove = false;
    }

    window.getSelection().empty();
}

function mouseOverHandler() {
    $(draggingRow).insertBefore(this);
}

function mouseUpHandler() {
    if (isDraggingStarted) window.getSelection().empty();
    $(document).off('mousemove', mouseMoveHandler);
    $(document).off('mouseup', mouseUpHandler);
    Array.from(table.querySelectorAll('tr:not(.dragging-element)')).forEach(row => {
        $(row).off('mouseover', mouseOverHandler);
    })

    if (remove) {
        draggingElement.style.transition = 'all 300ms';
        draggingElement.style.scale = '0';
        setTimeout(() => {
            draggingElement.remove();
        }, 300);
        placehodler.remove();
        draggingRow.remove();
    }

    const rect = draggingRow.getBoundingClientRect();
    if (draggingElement !== undefined) {
        const floatingElementRect = draggingElement.getBoundingClientRect();
        const deltaX = rect.x - floatingElementRect.x;
        const deltaY = rect.y - floatingElementRect.y;
        if (Math.hypot(deltaX, deltaY) > 9)
            $(draggingElement).animate({left: rect.left + 'px', top: rect.top + 'px'}, 300, stopDragging);
        else
            stopDragging();
    }
    else isDraggingStarted = false;
}

function stopDragging() {
    placehodler.remove();
    draggingElement.remove();
    isDraggingStarted = false;
}