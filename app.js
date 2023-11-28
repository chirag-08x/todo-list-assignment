const btns = document.querySelectorAll(".btn-container button");
let tasks = [];
let taskType = "todo";

let sortPriority = "";
let sortDate = "";

// Load data from LocalStorage
window.addEventListener("DOMContentLoaded", () => {
  showTasks(taskType);
});

// Show/Load Tasks on Page
const showTasks = (category, selectedPriority = "", selectedDate = "") => {
  const taskListContainer = document.querySelector(".tasks");
  const allTasks = [...tasks];
  const tasksToDisplay = [];
  taskListContainer.innerHTML = "";

  if (allTasks.length === 0) {
    return (taskListContainer.innerHTML = `<p>No tasks available. Add new Tasks.</p>`);
  }

  allTasks.forEach(({ id, name, priority, date, type }) => {
    if (
      type === category &&
      (!selectedPriority || priority === selectedPriority) &&
      (!selectedDate || date === selectedDate)
    ) {
      const newElement = document.createElement("div");
      newElement.classList.add("single-task");
      newElement.setAttribute("data-id", id);
      newElement.innerHTML = `
                   ${
                     type !== "completed"
                       ? `<input type="checkbox" name="" id="mac">`
                       : ""
                   }
                  <p class="task-name">${name}</p>
                  <p class="task-priority">${priority}</p>
                  <p class="date">${date}</p>
                  <div class="btns">
                  ${
                    type === "todo"
                      ? `<button class="doing">Doing</button>`
                      : ""
                  }
                    <button class="remove">Remove</button>
                  </div>
                  `;

      const removeBtn = newElement.querySelector(".remove");
      const doingBtn = newElement.querySelector(".doing");
      const markAsCompletedBtn = newElement.querySelector("#mac");
      removeBtn.addEventListener("click", () => {
        removeTask(id);
      });
      if (doingBtn) {
        doingBtn.addEventListener("click", () => {
          markTaskAsDoing(id);
        });
      }
      if (markAsCompletedBtn) {
        markAsCompletedBtn.addEventListener("click", () => {
          markTaskAsCompleted(id);
        });
      }
      tasksToDisplay.push(newElement);
    }
  });
  if (tasksToDisplay.length === 0) {
    return (taskListContainer.innerHTML = `<p>No tasks available. Add new Tasks.</p>`);
  }

  tasksToDisplay.forEach((taskElement) => {
    taskListContainer.appendChild(taskElement);
  });
};

// Add Task to the List
document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

const showWarning = (msg) => {
  const warning = document.querySelector(".warning");
  warning.classList.remove("hide");
  warning.innerHTML = `<p>${msg}</p>`;
  setTimeout(() => {
    warning.classList.add("hide");
    warning.innerHTML = ``;
  }, 4000);
};

const addTask = () => {
  const taskName = document.querySelector("#task");
  const priority = document.querySelector("#priority");
  const date = document.querySelector("#task-date");
  const inputDate = new Date(date.value);
  inputDate.setHours(0, 0, 0, 0);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  if (!taskName.value) {
    return showWarning("Please enter task name.");
  } else if (!priority.value) {
    return showWarning("Please choose task priority");
  } else if (!date.value) {
    return showWarning("Please choose task date.");
  } else if (inputDate < currentDate) {
    return showWarning("Selected date must not be less than today's date.");
  }
  if (tasks.length === 0) {
    tasks.push({
      id: 1,
      name: taskName.value,
      priority: priority.value,
      date: date.value,
      type: "todo",
    });
  } else {
    tasks.push({
      id: tasks[tasks.length - 1].id + 1,
      name: taskName.value,
      priority: priority.value,
      date: date.value,
      type: "todo",
    });
  }

  taskType = "todo";
  showTasks(taskType);
  // Reset form values
  taskName.value = "";
  priority.value = "";
  date.value = "";
};

// Remove Task from List
const removeTask = (id) => {
  tasks = tasks.filter((item) => item.id !== id);
  showTasks(taskType);
};

// Mark task as completed
const markTaskAsCompleted = (id) => {
  tasks = tasks.map((element) => {
    if (element.id === id) {
      return { ...element, type: "completed" };
    }
    return element;
  });
  showTasks(taskType);
};

// Mark task as doing
const markTaskAsDoing = (id) => {
  tasks = tasks.map((element) => {
    if (element.id === id) {
      return { ...element, type: "doing" };
    }
    return element;
  });
  showTasks(taskType);
};

// Btns
btns.forEach((e) => {
  e.addEventListener("click", () => {
    btns.forEach(function (btn) {
      btn.classList.remove("active-btn");
    });

    e.classList.add("active-btn");
    const btnType = e.dataset.id;
    taskType = btnType;
    showTasks(btnType);
  });
});

// Sort Tasks
const priortityElement = document.querySelector(".sort-data #sort-priority");
priortityElement.addEventListener("change", (e) => {
  sortPriority = e.target.value;
  showTasks(taskType, sortPriority, sortDate);
});

const dateElement = document.querySelector(".sort-data #sort-date");
dateElement.addEventListener("change", (e) => {
  sortDate = e.target.value;
  showTasks(taskType, sortPriority, sortDate);
});
