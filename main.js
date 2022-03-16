window.addEventListener('load', () => {
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");

    function init() {
        form.addEventListener('submit', newTodo);
        updateList();
    }

    function* index() {
        let i = todos.length;

        while (true) {
            yield i;

            i = i + 1;
        }
    }

    function createTodo({ content = '', completed = false } = {}) {
        const id = index().next().value;

        return {
            id: id,
            content: content,
            complete: completed,
        };
    }

    function newTodo(e) {
        e.preventDefault();

        const newTodoContentInput = this.querySelector('[name="new-task-input"]')
        const content = newTodoContentInput.value || '';

        if (content.length === 0) {
            return;
        }

        const newTodo = createTodo({ content: content });

        const newTodos = [...todos, newTodo];

        newTodoContentInput.value = '';
        updateTodos(newTodos);
    }

    function removeTodo(e) {
        e.preventDefault();
        if (!this.parentNode && !this.parentNode.parentNode.dataset && !this.parentNode.parentNode.dataset.id) {
            return;
        }

        const id = +this.parentNode.parentNode.dataset.id;
        const newTodos = todos.filter(todo => todo.id !== id);

        updateTodos(newTodos);
    }

    function toggleComplete(e) {
        if (!this.parentNode && !this.parentNode.parentNode.dataset && !this.parentNode.parentNode.dataset.id) {
            return;
        }

        const id = +this.parentNode.parentNode.dataset.id;
        const newTodos = todos.slice();
        newTodos[id] = { ...newTodos[id], done: true };

        var audio = new Audio("/checklist-checkoff.mp3");
        audio.play();

        updateTodos(newTodos);
    }

    function updateTodos(newTodos) {
        todos = newTodos;
        localStorage.setItem('todos', JSON.stringify(todos));

        updateList();
    }

    function updateList() {
        let content = todos.map(todo => {
            return `
            <div class="task ${todo.done ? 'done' : ''}" data-id="${todo.id}">
					<div class="content">
						<input 
							type="text" 
							class="text" 
							value="${ todo.content }" 
                            readonly>
					</div>
					<div class="actions">
						<button class="done">Done</button>
						<button class="delete">Delete</button>
					</div>
				</div>
          `;
        }).join('');

        list_el.innerHTML = content;

        const deleteButtons = list_el.querySelectorAll('.task .actions .delete');
        deleteButtons.forEach(button => button.addEventListener('click', removeTodo));

        const completedCheckboxes = list_el.querySelectorAll('.task .actions .done');
        completedCheckboxes.forEach(checkbox => checkbox.addEventListener('click', toggleComplete));
    }

    init();
});