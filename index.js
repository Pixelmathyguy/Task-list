document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");

  const counterTotal = document.getElementById("counter-total");
  const counterCompleted = document.getElementById("counter-completed");
  const counterIncompleted = document.getElementById("counter-incompleted");

  function updateCounters() {
    const totalTasks = todoList.querySelectorAll(".todo-item").length;
    const completedTasks = todoList.querySelectorAll(".todo-item.completed").length;
    const incompletedTasks = totalTasks - completedTasks;

    counterTotal.textContent = `Total: ${totalTasks}`;
    counterCompleted.textContent = `Completed: ${completedTasks}`;
    counterIncompleted.textContent = `Incompleted: ${incompletedTasks}`;
  }

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();

    if (taskText === "") {
      todoForm.classList.add("has-error");
      return;
    }

    todoForm.classList.remove("has-error");

    const li = document.createElement("li");
    li.className = "todo-item";

    li.innerHTML = `
      <button class="delete-btn">✕</button>
      <span class="todo-text"></span>
      <button class="check-btn">✓</button>
    `;

    li.querySelector(".todo-text").textContent = taskText;

    todoList.appendChild(li);

    todoInput.value = "";
    updateCounters();
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

    if (target.classList.contains("delete-btn")) {
      todoItem.remove();
      updateCounters();
    }

    if (target.classList.contains("check-btn")) {
      todoItem.classList.toggle("completed");
      updateCounters();
    }
  });

  updateCounters();
});