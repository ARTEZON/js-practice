const toggle = document.getElementById('dark-mode-toggle');
const icon = toggle.firstElementChild;

toggle.onclick = () => {
    if (!document.body.classList.contains('dark-theme')) {
        icon.setAttribute('src', icon.getAttribute('src').replace('dark', 'light'));
        document.documentElement.style.colorScheme = 'dark';
    }
    else {
        icon.setAttribute('src', icon.getAttribute('src').replace('light', 'dark'));
        document.documentElement.style.colorScheme = 'light';
    }
    document.body.classList.toggle('dark-theme');
}