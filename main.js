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
}

// Закрытие модалки по клику на кнопку закрытия
const closeDialogBtn = document.getElementById('closeDialog');
if (closeDialogBtn) {
    closeDialogBtn.addEventListener('click', () => {
        if (contactDialog) {
            contactDialog.close();
            // Фокус вернётся на кнопку открытия через обработчик 'close'
        }
    });
}

// Валидация формы
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Очищаем предыдущие сообщения об ошибках
        clearErrorMessages();
        
        // Проверка валидности всех полей
        if (contactForm.reportValidity()) {
            // Если форма валидна, показываем сообщение об успехе
            showSuccessMessage();
            // Очищаем форму
            contactForm.reset();
            // Убираем aria-invalid со всех полей
            formFields?.forEach(field => {
                field.removeAttribute('aria-invalid');
            });
            // Закрываем модалку
            if (contactDialog) {
                contactDialog.close();
            }
        } else {
            // Показываем сообщения об ошибках для невалидных полей
            showValidationErrors();
        }
    });
}

// Функция очистки сообщений об ошибках
function clearErrorMessages() {
    const errorMessages = contactForm?.querySelectorAll('.error-message');
    errorMessages?.forEach(msg => {
        msg.textContent = '';
    });
}

// Функция показа ошибок валидации
function showValidationErrors() {
    const fields = contactForm?.querySelectorAll('input, select, textarea');
    fields?.forEach(field => {
        const errorId = field.getAttribute('aria-describedby')?.split(' ').find(id => id.includes('error'));
        if (errorId) {
            const errorElement = document.getElementById(errorId);
            if (errorElement && !field.validity.valid) {
                errorElement.textContent = field.validationMessage;
            }
        }
    });
}

// Функция показа сообщения об успехе
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        // Скрываем сообщение через 5 секунд
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
}

/**
 * Опциональная маска для телефона (лёгкая маска)
 * Автоматически форматирует ввод в формат +7 (XXX) XXX-XX-XX
 */
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
        
        // Форматируем номер телефона: +7 (XXX) XXX-XX-XX
        if (value.length > 0) {
            if (value[0] === '8') {
                value = '7' + value.slice(1);
            }
            if (value[0] !== '7' && value.length > 0) {
                value = '7' + value;
            }
            
            let formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
            }
            if (value.length >= 4) {
                formatted += ') ' + value.slice(4, 7);
            }
            if (value.length >= 7) {
                formatted += '-' + value.slice(7, 9);
            }
            if (value.length >= 9) {
                formatted += '-' + value.slice(9, 11);
            }
            
            e.target.value = formatted;
            
            // Обновляем валидность после форматирования
            if (value.length === 11) {
                e.target.removeAttribute('aria-invalid');
            }
        } else {
            e.target.value = '';
        }
    });
    
    // Валидация телефона при потере фокуса
    phoneInput.addEventListener('blur', (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length > 0 && value.length !== 11) {
            e.target.setAttribute('aria-invalid', 'true');
            const errorId = e.target.getAttribute('aria-describedby')?.split(' ').find(id => id.includes('error'));
            if (errorId) {
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.textContent = 'Введите полный номер телефона в формате +7 (XXX) XXX-XX-XX';
                }
            }
        } else if (value.length === 11) {
            e.target.removeAttribute('aria-invalid');
            const errorId = e.target.getAttribute('aria-describedby')?.split(' ').find(id => id.includes('error'));
            if (errorId) {
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            }
        }
    });
}

// Обработка валидации для всех полей
const formFields = contactForm?.querySelectorAll('input, select, textarea');
if (formFields) {
    formFields.forEach(field => {
        field.addEventListener('invalid', (e) => {
            e.preventDefault(); // Предотвращаем стандартное сообщение
            e.target.setAttribute('aria-invalid', 'true');
            const errorId = e.target.getAttribute('aria-describedby')?.split(' ').find(id => id.includes('error'));
            if (errorId) {
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.textContent = e.target.validationMessage;
                }
            }
        });
        
        field.addEventListener('input', (e) => {
            if (e.target.validity.valid) {
                e.target.removeAttribute('aria-invalid');
                const errorId = e.target.getAttribute('aria-describedby')?.split(' ').find(id => id.includes('error'));
                if (errorId) {
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                }
            }
        });
        
        // Валидация при потере фокуса
        field.addEventListener('blur', (e) => {
            if (!e.target.validity.valid) {
                e.target.setAttribute('aria-invalid', 'true');
                const errorId = e.target.getAttribute('aria-describedby')?.split(' ').find(id => id.includes('error'));
                if (errorId) {
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.textContent = e.target.validationMessage;
                    }
                }
            }
        });
    });
}

