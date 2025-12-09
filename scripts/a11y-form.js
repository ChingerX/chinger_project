/**
 * Практическое занятие №17: A11y-аудит и обеспечение доступности
 * JavaScript для улучшения доступности формы
 */

(function() {
    'use strict';
    
    const form = document.getElementById('contactForm');
    const formMessages = document.getElementById('form-messages');
    
    if (!form) return;
    
    // Получаем все поля формы
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // ============================================
    // ВАЛИДАЦИЯ В РЕАЛЬНОМ ВРЕМЕНИ
    // ============================================
    
    function validateField(field) {
        const isValid = field.checkValidity();
        const errorElement = document.getElementById(field.id + '-error');
        
        if (isValid) {
            field.setAttribute('aria-invalid', 'false');
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            if (errorElement) {
                errorElement.textContent = '';
            }
        } else {
            field.setAttribute('aria-invalid', 'true');
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            if (errorElement) {
                // Показываем конкретное сообщение об ошибке
                let errorMessage = '';
                if (field.validity.valueMissing) {
                    errorMessage = 'Это поле обязательно для заполнения.';
                } else if (field.validity.typeMismatch && field.type === 'email') {
                    errorMessage = 'Пожалуйста, введите корректный email адрес.';
                } else if (field.validity.tooShort) {
                    errorMessage = `Минимальная длина: ${field.minLength} символов.`;
                } else if (field.validity.tooLong) {
                    errorMessage = `Максимальная длина: ${field.maxLength} символов.`;
                } else {
                    errorMessage = 'Пожалуйста, проверьте правильность введенных данных.';
                }
                errorElement.textContent = errorMessage;
            }
        }
        
        return isValid;
    }
    
    // Валидация при потере фокуса
    [nameField, emailField, messageField].forEach(field => {
        if (field) {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Валидация при вводе (после первой попытки отправки)
            field.addEventListener('input', function() {
                if (form.classList.contains('was-validated')) {
                    validateField(this);
                }
            });
        }
    });
    
    // ============================================
    // ОБРАБОТКА ОТПРАВКИ ФОРМЫ
    // ============================================
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Валидируем все поля
        const isNameValid = validateField(nameField);
        const isEmailValid = validateField(emailField);
        const isMessageValid = validateField(messageField);
        
        const isFormValid = isNameValid && isEmailValid && isMessageValid;
        
        if (isFormValid) {
            // Форма валидна - показываем сообщение об успехе
            showSuccessMessage();
            
            // Сбрасываем форму
            setTimeout(() => {
                form.reset();
                form.classList.remove('was-validated');
                [nameField, emailField, messageField].forEach(field => {
                    if (field) {
                        field.classList.remove('is-valid', 'is-invalid');
                        field.setAttribute('aria-invalid', 'false');
                    }
                });
                formMessages.textContent = '';
                formMessages.className = 'visually-hidden';
                
                // Возвращаем фокус на первое поле
                nameField.focus();
            }, 3000);
        } else {
            // Форма невалидна - фокусируемся на первом невалидном поле
            const firstInvalidField = form.querySelector(':invalid');
            if (firstInvalidField) {
                firstInvalidField.focus();
                showErrorMessage('Пожалуйста, исправьте ошибки в форме.');
            }
        }
        
        form.classList.add('was-validated');
    });
    
    // ============================================
    // СООБЩЕНИЯ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ
    // ============================================
    
    function showSuccessMessage() {
        formMessages.textContent = 'Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.';
        formMessages.className = 'success';
        formMessages.setAttribute('role', 'status');
        formMessages.removeAttribute('aria-hidden');
        
        // Объявляем для скринридеров
        announceToScreenReader('Сообщение успешно отправлено');
    }
    
    function showErrorMessage(message) {
        formMessages.textContent = message;
        formMessages.className = 'error';
        formMessages.setAttribute('role', 'alert');
        formMessages.removeAttribute('aria-hidden');
        
        // Объявляем для скринридеров
        announceToScreenReader(message);
    }
    
    function announceToScreenReader(message) {
        // Создаем временный элемент для объявления
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Удаляем после объявления
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // ============================================
    // КЛАВИАТУРНАЯ НАВИГАЦИЯ
    // ============================================
    
    // Обработка Escape для очистки формы
    form.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            // Если форма была изменена, спрашиваем подтверждение
            if (form.classList.contains('was-validated') || 
                nameField.value || emailField.value || messageField.value) {
                if (confirm('Вы уверены, что хотите очистить форму?')) {
                    form.reset();
                    form.classList.remove('was-validated');
                    [nameField, emailField, messageField].forEach(field => {
                        if (field) {
                            field.classList.remove('is-valid', 'is-invalid');
                            field.setAttribute('aria-invalid', 'false');
                        }
                    });
                    nameField.focus();
                }
            }
        }
    });
    
    // ============================================
    // УЛУЧШЕНИЕ ДОСТУПНОСТИ КНОПОК
    // ============================================
    
    // Убеждаемся, что кнопки доступны с клавиатуры
    const buttons = form.querySelectorAll('button');
    buttons.forEach(button => {
        // Добавляем обработчик для Enter и Space
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                if (event.key === ' ') {
                    event.preventDefault(); // Предотвращаем прокрутку при Space
                }
                this.click();
            }
        });
    });
    
    // ============================================
    // ЛОВУШКА ФОКУСА В ФОРМЕ
    // ============================================
    
    // Улучшаем навигацию Tab внутри формы
    const focusableElements = form.querySelectorAll(
        'input, textarea, button, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        form.addEventListener('keydown', function(event) {
            if (event.key === 'Tab') {
                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
    
    // ============================================
    // ИНИЦИАЛИЗАЦИЯ
    // ============================================
    
    // Устанавливаем начальные состояния
    [nameField, emailField, messageField].forEach(field => {
        if (field) {
            field.setAttribute('aria-invalid', 'false');
        }
    });
    
    console.log('A11y form enhancements initialized');
})();

