document.addEventListener('DOMContentLoaded', () => {

    const notesContainer =
        document.getElementById('notes-container');

    const createSection =
        document.getElementById('create-note-section');

    const createForm =
        document.getElementById('create-note-form');

    const showCreateButton =
        document.getElementById('show-create-note-form');

    const cancelCreateButton =
        document.getElementById('cancel-create-note');

    const createError =
        document.getElementById('create-error');


    const NOTES_API_URL = '/api/notes/';


    /*
     * =========================
     * Initial state
     * =========================
     */

    loadNotes();


    /*
     * =========================
     * Open create form
     * =========================
     */

    if (showCreateButton) {

        showCreateButton.addEventListener(
            'click',
            openCreateForm
        );

    }


    /*
     * =========================
     * Cancel create
     * =========================
     */

    if (cancelCreateButton) {

        cancelCreateButton.addEventListener(
            'click',
            closeCreateForm
        );

    }


    /*
     * =========================
     * Create note
     * =========================
     */

    if (createForm) {

        createForm.addEventListener(
            'submit',
            createNote
        );

    }


    /*
     * =========================
     * Open form
     * =========================
     */

    function openCreateForm() {

        createSection.hidden = false;

        showCreateButton.hidden = true;

        notesContainer.hidden = true;

        createForm.reset();

        clearCreateError();

    }


    /*
     * =========================
     * Close form
     * =========================
     */

    function closeCreateForm() {

        createSection.hidden = true;

        showCreateButton.hidden = false;

        notesContainer.hidden = false;

        createForm.reset();

        clearCreateError();

    }


    /*
     * =========================
     * Create note
     * =========================
     */

    async function createNote(event) {

        event.preventDefault();


        clearCreateError();


        const titleInput =
            document.getElementById('create-title');

        const textInput =
            document.getElementById('create-text');


        const title =
            titleInput.value.trim();

        const text =
            textInput.value.trim();


        /*
         * Client-side validation
         */

        if (!title || !text) {

            showCreateError(
                'Заполните все поля.'
            );

            return;
        }


        try {

            const response = await fetch(
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


            /*
             * Note successfully created.
             *
             * First close the form.
             */

            closeCreateForm();


            /*
             * Then reload notes.
             */

            await loadNotes();

        }

        catch (error) {

            console.error(
                'Ошибка создания заметки:',
                error
            );

            showCreateError(
                'Не удалось создать заметку.'
            );

        }

    }


    /*
     * =========================
     * Load notes
     * =========================
     */

    async function loadNotes() {

        try {

            const response =
                await fetch(NOTES_API_URL);


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const notes =
                await response.json();


            renderNotes(notes);

        }

        catch (error) {

            console.error(
                'Ошибка загрузки заметок:',
                error
            );


            notesContainer.innerHTML = `
                <p class="notes-empty">
                    Не удалось загрузить заметки.
                </p>
            `;

        }

    }


    /*
     * =========================
     * Render notes
     * =========================
     */

    function renderNotes(notes) {

        notesContainer.innerHTML = '';


        /*
         * No notes
         */

        if (
            !Array.isArray(notes) ||
            notes.length === 0
        ) {

            notesContainer.innerHTML = `
                <p class="notes-empty">
                    У вас пока нет заметок.
                </p>
            `;

            return;
        }


        /*
         * Render cards
         */

        notes.forEach(note => {

            const noteElement =
                document.createElement('article');


            noteElement.className = 'note';

            noteElement.dataset.noteId =
                note.id;


            noteElement.innerHTML = `
                <h3></h3>

                <p></p>

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


            noteElement
                .querySelector('h3')
                .textContent =
                    note.title;


            noteElement
                .querySelector('p')
                .textContent =
                    note.text;


            /*
             * Edit
             */

            noteElement
                .querySelector(
                    '.edit-note-button'
                )
                .addEventListener(
                    'click',
                    () => {

                        startEdit(note);

                    }
                );


            /*
             * Delete
             */

            noteElement
                .querySelector(
                    '.delete-note-button'
                )
                .addEventListener(
                    'click',
                    () => {

                        deleteNote(note.id);

                    }
                );


            notesContainer.appendChild(
                noteElement
            );

        });

    }


    /*
     * =========================
     * Edit note
     * =========================
     */

    function startEdit(note) {

        const noteElement =
            document.querySelector(
                `.note[data-note-id="${note.id}"]`
            );


        if (!noteElement) {
            return;
        }


        noteElement.innerHTML = `
            <form class="note-edit-form">

                <div class="form-group">

                    <label>
                        Заголовок
                    </label>

                    <input
                        type="text"
                        class="edit-title"
                        value=""
                        maxlength="200"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Текст
                    </label>

                    <textarea
                        class="edit-text"
                        required
                    ></textarea>

                </div>


                <div class="note-edit-actions">

                    <button
                        type="submit"
                        class="edit-save-button"
                    >
                        Сохранить
                    </button>

                    <button
                        type="button"
                        class="edit-cancel-button"
                    >
                        Отмена
                    </button>

                </div>

            </form>
        `;


        const titleInput =
            noteElement.querySelector(
                '.edit-title'
            );


        const textInput =
            noteElement.querySelector(
                '.edit-text'
            );


        titleInput.value =
            note.title;


        textInput.value =
            note.text;


        /*
         * Save edit
         */

        noteElement
            .querySelector(
                '.note-edit-form'
            )
            .addEventListener(
                'submit',
                async (event) => {

                    event.preventDefault();


                    await updateNote(
                        note.id,
                        titleInput.value.trim(),
                        textInput.value.trim()
                    );

                }
            );


        /*
         * Cancel edit
         */

        noteElement
            .querySelector(
                '.edit-cancel-button'
            )
            .addEventListener(
                'click',
                () => {

                    renderSingleNote(
                        noteElement,
                        note
                    );

                }
            );

    }


    /*
     * =========================
     * Update note
     * =========================
     */

    async function updateNote(
        noteId,
        title,
        text
    ) {

        if (!title || !text) {

            alert(
                'Заполните все поля.'
            );

            return;
        }


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

                alert(error);

                return;
            }


            await loadNotes();

        }

        catch (error) {

            console.error(
                'Ошибка изменения заметки:',
                error
            );

            alert(
                'Не удалось изменить заметку.'
            );

        }

    }


    /*
     * =========================
     * Render single note
     * =========================
     */

    function renderSingleNote(
        noteElement,
        note
    ) {

        noteElement.innerHTML = `
            <h3></h3>

            <p></p>

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


        noteElement
            .querySelector('h3')
            .textContent =
                note.title;


        noteElement
            .querySelector('p')
            .textContent =
                note.text;


        noteElement
            .querySelector(
                '.edit-note-button'
            )
            .addEventListener(
                'click',
                () => {

                    startEdit(note);

                }
            );


        noteElement
            .querySelector(
                '.delete-note-button'
            )
            .addEventListener(
                'click',
                () => {

                    deleteNote(note.id);

                }
            );

    }


    /*
     * =========================
     * Delete note
     * =========================
     */

    async function deleteNote(noteId) {

        const confirmed =
            confirm(
                'Удалить эту заметку?'
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

                alert(error);

                return;
            }


            await loadNotes();

        }

        catch (error) {

            console.error(
                'Ошибка удаления заметки:',
                error
            );

            alert(
                'Не удалось удалить заметку.'
            );

        }

    }


    /*
     * =========================
     * CSRF token
     * =========================
     */

    function getCsrfToken() {

        const cookie =
            document.cookie
                .split('; ')
                .find(
                    row =>
                        row.startsWith(
                            'csrftoken='
                        )
                );


        if (!cookie) {
            return '';
        }


        return decodeURIComponent(
            cookie.split('=')[1]
        );

    }


    /*
     * =========================
     * API error
     * =========================
     */

    async function parseApiError(response) {

        try {

            const data =
                await response.json();


            if (data.detail) {
                return data.detail;
            }


            const messages = [];


            Object.values(data)
                .flat()
                .forEach(message => {

                    messages.push(
                        message
                    );

                });


            if (messages.length) {

                return messages.join(' ');

            }

        }

        catch (error) {

            console.error(
                'Ошибка обработки ответа:',
                error
            );

        }


        return (
            `Ошибка сервера: ${response.status}`
        );

    }


    /*
     * =========================
     * Create form errors
     * =========================
     */

    function showCreateError(message) {

        if (!createError) {
            return;
        }


        createError.textContent =
            message;

    }


    function clearCreateError() {

        if (!createError) {
            return;
        }


        createError.textContent =
            '';

    }

});