/**
 * Переключатель темы (светлая/темная)
 * Использует CSS переменные для динамического изменения темы
 */

const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');

// Проверяем сохраненную тему или используем системную
const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Применяем сохраненную тему
if (savedTheme === 'dark') {
    document.body.classList.add('theme-dark');
    if (themeIcon) themeIcon.textContent = '☀️';
} else {
    document.body.classList.remove('theme-dark');
    if (themeIcon) themeIcon.textContent = '🌙';
}

// Обработчик переключения темы
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('theme-dark');
        
        // Сохраняем выбор пользователя
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Обновляем иконку
        if (themeIcon) {
            themeIcon.textContent = isDark ? '☀️' : '🌙';
        }
    });
}

