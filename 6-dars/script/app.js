document.addEventListener('DOMContentLoaded', () => {
    const todoDiv = document.querySelector('.todoDiv')
    const todoInput = todoDiv.querySelector('#todo-input')
    const addTodoButton = todoDiv.querySelector('#add-todo')
    const todoList = todoDiv.querySelector('#todo-list')
    const filterTodos = todoDiv.querySelector('#filter-todos')

    let todos = JSON.parse(localStorage.getItem('todos')) || []
    let deletedTodos = JSON.parse(localStorage.getItem('deletedTodos')) || []
    let filter = 'all'

    addTodoButton.addEventListener('click', () => {
        const todoName = todoInput.value.trim()
        if (todoName === '') {
            Toastify({
                text: "Please enter a todo name",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            }).showToast()
            return
        }

        const now = new Date()
        const todo = {
            name: todoName,
            createdAt: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
            completed: false
        }

        todos.push(todo)
        saveTodos()
        renderTodos()
        todoInput.value = ''
        window.alert('Todo successfully added')
    })

    filterTodos.addEventListener('change', (e) => {
        filter = e.target.value
        renderTodos()
    })

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos))
        localStorage.setItem('deletedTodos', JSON.stringify(deletedTodos))
    }

    function renderTodos() {
        todoList.innerHTML = ''
        let filteredTodos = []

        if (filter === 'all') {
            filteredTodos = todos
        } else if (filter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed)
        } else if (filter === 'incomplete') {
            filteredTodos = todos.filter(todo => !todo.completed)
        } else if (filter === 'deleted') {
            filteredTodos = deletedTodos
        }

        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li')
            li.className = `flex justify-between items-center p-2 rounded ${todo.completed ? 'bg-green-200' : 'bg-gray-200'}`
            li.innerHTML = `
                <span class="${todo.completed ? 'line-through' : ''}">${todo.name} (Created at: ${todo.createdAt})</span>
                <div>
                    ${filter !== 'deleted' ? `<button class="bg-green-500 text-white px-2 py-1 rounded complete-todo" data-index="${index}">Complete</button>` : ''}
                    <button class="bg-red-500 text-white px-2 py-1 rounded remove-todo" data-index="${index}">${filter === 'deleted' ? 'Restore' : 'Remove'}</button>
                </div>
            `
            todoList.appendChild(li)
        })

        document.querySelectorAll('.remove-todo').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index')
                if (filter === 'deleted') {
                    const restoredTodo = deletedTodos.splice(index, 1)[0]
                    todos.push(restoredTodo)
                    window.alert('Todo successfully restored')
                } else {
                    const deletedTodo = todos.splice(index, 1)[0]
                    deletedTodos.push(deletedTodo)
                    window.alert('Todo successfully deleted')
                }
                saveTodos()
                renderTodos()
            })
        })

        document.querySelectorAll('.complete-todo').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index')
                todos[index].completed = !todos[index].completed
                saveTodos()
                renderTodos()
                window.alert('Todo successfully completed')
            })
        })
    }

    renderTodos()
});
