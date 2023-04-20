const toggle = document.getElementById('dark-mode-toggle');
const icon = toggle.firstElementChild;

toggle.onclick = toggleTheme;

function toggleTheme() {
    if (document.documentElement.getAttribute('data-theme') === 'dark') setTheme('light');
    else setTheme('dark');
}

function setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
        document.documentElement.style.colorScheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'light') icon.src = 'img/dark.svg';
        else                   icon.src = 'img/light.svg';
    }
}