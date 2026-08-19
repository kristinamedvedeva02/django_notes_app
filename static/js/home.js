const NOTES_API_URL = '/api/notes/';


/* =========================================
   Инициализация
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    loadNotes();


    const createForm =
        document.getElementById('create-note-form');


    if (createForm) {

        createForm.addEventListener(
            'submit',
            createNote
        );

    }

});


/* =========================================
   GET /api/notes/
   Получение всех заметок
   ========================================= */

async function loadNotes() {

    const container =
        document.getElementById('notes-container');


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(NOTES_API_URL);


        if (!response.ok) {

            const error =
                await parseApiError(response);

            throw new Error(error.message);
        }


        const notes =
            await response.json();


        renderNotes(notes);


    } catch (error) {

        container.innerHTML = `
            <p class="note-error">
                Не удалось загрузить заметки:
                ${escapeHtml(error.message)}
            </p>
        `;

    }

}


/* =========================================
   Отображение заметок
   ========================================= */

function renderNotes(notes) {

    const container =
        document.getElementById('notes-container');


    container.innerHTML = '';


    if (!notes || notes.length === 0) {

        container.innerHTML = `
            <p class="notes-empty">
                У вас пока нет заметок.
            </p>
        `;

        return;
    }


    notes.forEach(note => {

        const noteElement =
            createNoteElement(note);


        container.appendChild(noteElement);

    });

}


/* =========================================
   Создание HTML карточки заметки
   ========================================= */

function createNoteElement(note) {

    const element =
        document.createElement('article');


    element.className = 'note';

    element.dataset.id = note.id;


    element.innerHTML = `

        <h3 class="note-title">
            ${escapeHtml(note.title)}
        </h3>


        <div class="note-text">
            ${escapeHtml(note.text)}
        </div>


        <div class="note-date">

            Создано:
            ${formatDate(note.created_at)}

            <br>

            Изменено:
            ${formatDate(note.updated_at)}

        </div>


        <div class="note-actions">

            <button
                type="button"
                class="edit-note-button"
            >
                Изменить
            </button>


            <button
                type="button"
                class="delete-note-button"
            >
                Удалить
            </button>

        </div>

    `;


    const editButton =
        element.querySelector(
            '.edit-note-button'
        );


    editButton.addEventListener(
        'click',
        () => startEdit(note)
    );


    const deleteButton =
        element.querySelector(
            '.delete-note-button'
        );


    deleteButton.addEventListener(
        'click',
        () => deleteNote(note.id)
    );


    return element;
}


/* =========================================
   POST /api/notes/
   Создание заметки
   ========================================= */

async function createNote(event) {

    event.preventDefault();


    const title =
        document.getElementById(
            'create-title'
        ).value.trim();


    const text =
        document.getElementById(
            'create-text'
        ).value.trim();


    const errorElement =
        document.getElementById(
            'create-error'
        );


    errorElement.textContent = '';


    try {

        const response =
            await fetch(
                NOTES_API_URL,
                {

                    method: 'POST',

                    headers: {

                        'Content-Type':
                            'application/json',

                        'X-CSRFToken':
                            getCsrfToken()

                    },

                    body: JSON.stringify({

                        title: title,

                        text: text

                    })

                }
            );


        if (!response.ok) {

            const error =
                await parseApiError(response);


            showCreateError(error);


            return;
        }


        document
            .getElementById(
                'create-note-form'
            )
            .reset();


        await loadNotes();


    } catch (error) {

        showCreateError({

            message:
                error.message

        });

    }

}


/* =========================================
   Начало редактирования
   ========================================= */

function startEdit(note) {

    const element =
        document.querySelector(
            `.note[data-id="${note.id}"]`
        );


    if (!element) {
        return;
    }


    element.innerHTML = `

        <form class="note-edit-form">

            <input
                type="text"
                class="edit-title"
                value="${escapeAttribute(note.title)}"
                maxlength="200"
                required
            >


            <textarea
                class="edit-text"
                required
            >${escapeHtml(note.text)}</textarea>


            <div class="note-actions">

                <button
                    type="submit"
                    class="button"
                >
                    Сохранить
                </button>


                <button
                    type="button"
                    class="cancel-edit-button"
                >
                    Отмена
                </button>

            </div>


            <div class="note-error"></div>

        </form>

    `;


    const form =
        element.querySelector(
            '.note-edit-form'
        );


    form.addEventListener(
        'submit',
        event => updateNote(
            event,
            note.id
        )
    );


    const cancelButton =
        element.querySelector(
            '.cancel-edit-button'
        );


    cancelButton.addEventListener(
        'click',
        loadNotes
    );

}


/* =========================================
   PATCH /api/notes/{id}/
   Изменение заметки
   ========================================= */

async function updateNote(
    event,
    noteId
) {

    event.preventDefault();


    const form =
        event.target;


    const title =
        form
            .querySelector('.edit-title')
            .value
            .trim();


    const text =
        form
            .querySelector('.edit-text')
            .value
            .trim();


    const errorElement =
        form.querySelector(
            '.note-error'
        );


    errorElement.textContent = '';


    try {

        const response =
            await fetch(
                `${NOTES_API_URL}${noteId}/`,
                {

                    method: 'PATCH',

                    headers: {

                        'Content-Type':
                            'application/json',

                        'X-CSRFToken':
                            getCsrfToken()

                    },

                    body: JSON.stringify({

                        title: title,

                        text: text

                    })

                }
            );


        if (!response.ok) {

            const error =
                await parseApiError(response);


            errorElement.textContent =
                getErrorMessage(error);


            return;
        }


        await loadNotes();


    } catch (error) {

        errorElement.textContent =
            error.message;

    }

}


/* =========================================
   DELETE /api/notes/{id}/
   Удаление заметки
   ========================================= */

async function deleteNote(noteId) {

    const confirmed =
        confirm(
            'Вы действительно хотите удалить эту заметку?'
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${NOTES_API_URL}${noteId}/`,
                {

                    method: 'DELETE',

                    headers: {

                        'X-CSRFToken':
                            getCsrfToken()

                    }

                }
            );


        if (!response.ok) {

            const error =
                await parseApiError(response);


            alert(
                getErrorMessage(error)
            );


            return;
        }


        await loadNotes();


    } catch (error) {

        alert(
            error.message
        );

    }

}


/* =========================================
   Обработка ошибок API
   ========================================= */

async function parseApiError(response) {

    try {

        const data =
            await response.json();


        if (data.error) {

            return data.error;

        }


        return {

            message:
                'Произошла ошибка.'

        };


    } catch {

        return {

            message:
                'Не удалось обработать ответ сервера.'

        };

    }

}


/* =========================================
   Получение текста ошибки
   ========================================= */

function getErrorMessage(error) {

    if (!error) {

        return 'Произошла ошибка.';

    }


    if (error.details) {

        const details =
            Object.values(
                error.details
            )
            .flat()
            .join(' ');


        if (details) {

            return details;

        }

    }


    return (
        error.message ||
        'Произошла ошибка.'
    );

}


/* =========================================
   Отображение ошибки создания
   ========================================= */

function showCreateError(error) {

    const errorElement =
        document.getElementById(
            'create-error'
        );


    if (!errorElement) {
        return;
    }


    errorElement.textContent =
        getErrorMessage(error);

}


/* =========================================
   CSRF token
   ========================================= */

function getCsrfToken() {

    const name =
        'csrftoken=';


    const cookies =
        document.cookie.split(';');


    for (
        let cookie of cookies
    ) {

        cookie =
            cookie.trim();


        if (
            cookie.startsWith(name)
        ) {

            return decodeURIComponent(
                cookie.substring(
                    name.length
                )
            );

        }

    }


    return '';

}


/* =========================================
   Безопасный HTML
   ========================================= */

function escapeHtml(value) {

    const element =
        document.createElement(
            'div'
        );


    element.textContent =
        value ?? '';


    return element.innerHTML;

}


/* =========================================
   Безопасное значение атрибута
   ========================================= */

function escapeAttribute(value) {

    return escapeHtml(value)
        .replace(
            /"/g,
            '&quot;'
        )
        .replace(
            /'/g,
            '&#039;'
        );

}


/* =========================================
   Форматирование даты
   ========================================= */

function formatDate(
    dateString
) {

    if (!dateString) {
        return '—';
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return '—';

    }


    return date.toLocaleString(
        'ru-RU',
        {

            dateStyle: 'short',

            timeStyle: 'short'

        }
    );

}