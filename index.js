document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/tasks";

  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");

  const counterTotal = document.getElementById("counter-total");
  const counterCompleted = document.getElementById("counter-completed");
  const counterIncompleted = document.getElementById("counter-incompleted");

  function fetchTasks() {
    fetch(API_URL)
      .then((res) => res.json())
      .then((tasks) => {
        renderTasks(tasks);
      })
      .catch((err) => console.error("Error en GET:", err));
  }

  function updateCounters(tasks) {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const incompleted = total - completed;

    counterTotal.textContent = `Total: ${total}`;
    counterCompleted.textContent = `Completed: ${completed}`;
    counterIncompleted.textContent = `Incompleted: ${incompleted}`;
  }

  function renderTasks(tasks) {
    todoList.innerHTML = "";

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `todo-item ${task.completed ? "completed" : ""}`;
      li.dataset.id = task.id;

      li.innerHTML = `
        <button class="delete-btn" title="Eliminar">✕</button>
        <span class="todo-text">${task.text}</span>
        <button class="edit-btn" title="Editar">✎</button>
        <button class="check-btn" title="Completar">✓</button>
      `;
      todoList.appendChild(li);
    });

    updateCounters(tasks);
  }

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();

    if (taskText === "") {
      todoForm.classList.add("has-error");
      return;
    }

    todoForm.classList.remove("has-error");

    const newTask = {
      text: taskText,
      completed: false,
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then(() => {
        todoInput.value = "";
        fetchTasks();
      })
      .catch((err) => console.error("Error en POST:", err));
  });

  todoInput.addEventListener("input", () => {
    if (todoInput.value.trim() !== "") {
      todoForm.classList.remove("has-error");
    }
  });

  todoList.addEventListener("click", (e) => {
    const target = e.target;
    const todoItem = target.closest(".todo-item");
    if (!todoItem) return;

    const id = todoItem.dataset.id;

    if (target.classList.contains("delete-btn")) {
      fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })
        .then(() => fetchTasks())
        .catch((err) => console.error("Error en DELETE:", err));
    }

    if (target.classList.contains("edit-btn")) {
      const textSpan = todoItem.querySelector(".todo-text");
      const currentText = textSpan.textContent;
      const newText = prompt("Edita tu tarea:", currentText);

      if (newText !== null && newText.trim() !== "") {
        fetch(`${API_URL}/${id}`)
          .then((res) => res.json())
          .then((taskData) => {
            const updatedTask = {
              text: newText.trim(),
              completed: taskData.completed,
            };

            return fetch(`${API_URL}/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedTask),
            });
          })
          .then(() => fetchTasks())
          .catch((err) => console.error("Error en PUT:", err));
      }
    }

    if (target.classList.contains("check-btn")) {
      const isCompleted = todoItem.classList.contains("completed");

      fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !isCompleted }),
      })
        .then(() => fetchTasks())
        .catch((err) => console.error("Error en PATCH:", err));
    }
  });

  fetchTasks();
});
