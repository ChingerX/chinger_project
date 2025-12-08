/**
 * Работа с модалкой <dialog> и формой обратной связи
 * Обеспечивает открытие/закрытие модалки, валидацию формы и клавиатурную доступность
 */

// Получаем элементы модалки и формы
const contactDialog = document.getElementById('contactDialog');
const openContactFormBtn = document.getElementById('openContactForm');
const contactForm = document.getElementById('contactForm');

// Открытие модалки
if (openContactFormBtn) {
    openContactFormBtn.addEventListener('click', () => {
        if (contactDialog) {
            contactDialog.showModal();
            // Устанавливаем фокус на первый интерактивный элемент формы
            const firstInput = contactForm?.querySelector('input, select, textarea, button');
            if (firstInput) {
                firstInput.focus();
            }
        }
    });
}

// Закрытие модалки по Esc (встроено в <dialog>)
if (contactDialog) {
    contactDialog.addEventListener('cancel', (e) => {
        // При закрытии по Esc возвращаем фокус на кнопку открытия
        if (openContactFormBtn) {
            openContactFormBtn.focus();
        }
    });
    
    // При закрытии модалки возвращаем фокус на кнопку открытия
    contactDialog.addEventListener('close', () => {
        if (openContactFormBtn) {
            openContactFormBtn.focus();
        }
    });
    
    // Закрытие модального окна по клику на фон
    contactDialog.addEventListener('click', function(event) {
        if (event.target === this) {
            this.close();
        }
    });
}

/**
 * Функция для отправки формы (согласно заданию)
 */
function submitForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formData = new FormData(form);
    
    // Простая валидация
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Собираем данные формы
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        category: formData.get('category'),
        message: formData.get('message')
    };
    
    // В реальном приложении здесь был бы AJAX-запрос
    console.log('Данные формы:', data);
    
    // Показываем уведомление об успешной отправке
    alert('Спасибо! Ваше обращение отправлено. Мы свяжемся с вами в ближайшее время.');
    
    // Закрываем модальное окно
    if (contactDialog) {
        contactDialog.close();
    }
    
    // Очищаем форму
    form.reset();
}

// Обработка отправки формы через Enter (предотвращаем стандартное поведение)
if (contactForm) {
    contactForm.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && event.target.type !== 'textarea') {
            event.preventDefault();
        }
    });
}
