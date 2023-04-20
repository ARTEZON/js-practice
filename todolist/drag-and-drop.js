let draggingRow;
let draggingElement;
let placehodler;
let isDraggingStarted = false;
let mouseX, mouseY, mouseElementX, mouseElementY;
let mouseOverElement = null;
const tint = document.createElement('div');
tint.classList.add('tint');
let remove;

function mouseDownHandler() {
    draggingRow = this;
    remove = false;

    $(document).on('mousemove', mouseMoveHandler);
    $(document).on('mouseup', mouseUpHandler);
    Array.from(table.querySelectorAll('tr:not(.dragging-element)')).forEach(row => {
        $(row).on('mouseenter', mouseEnterHandler);
        $(row).on('mouseleave', mouseLeaveHandler);
    })
}

function mouseMoveHandler(e) {
    if (!isDraggingStarted) {
        const width = $(table).width();

        draggingElement = draggingRow.cloneNode(true);
        draggingElement.classList.add('dragging-element')
        draggingElement.style.width = width + 'px';
        $('.todo-list').append(draggingElement);

        placehodler = document.createElement('div');
        placehodler.classList.add('placeholder');
        placehodler.style.width = width + 'px';
        placehodler.style.height = draggingRow.scrollHeight + 'px';
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

    if (mouseOverElement) {
        const rect = mouseOverElement.getBoundingClientRect();
        if (mouseY < (rect.top + rect.height / 2) || mouseOverElement.classList.contains('new'))
            $(draggingRow).insertBefore(mouseOverElement);
        else
            $(draggingRow).insertAfter(mouseOverElement);
    }

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

function mouseEnterHandler() {
    mouseOverElement = this;
}

function mouseLeaveHandler() {
    mouseOverElement = null;
}

function mouseUpHandler() {
    if (isDraggingStarted) window.getSelection().empty();
    $(document).off('mousemove', mouseMoveHandler);
    $(document).off('mouseup', mouseUpHandler);
    Array.from(table.querySelectorAll('tr:not(.dragging-element)')).forEach(row => {
        $(row).off('mouseenter', mouseEnterHandler);
        $(row).off('mouseleave', mouseLeaveHandler);
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
    save();
}