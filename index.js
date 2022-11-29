window.onload = () => {
  Task.getAllTasks();
};
//Setting
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isEdit = false,
  editId;

//SELECT ELEMENTS
const taskTitleInput = document.getElementById("taskTitle");
const taskDescInput = document.getElementById("taskDescription");
const addTaskBtn = document.getElementById("addTaskBtn");
const tasksBox = document.getElementById("tasksContainer");
const clearBtn = document.getElementById("clearBtn");
const saveEditBtn = document.getElementById("saveEditBtn");

function resetInputs(...inputs) {
  inputs.forEach((input) => (input.value = ""));
}
class Task {
  static getAllTasks() {
    let tasksItems = "";
    tasks.forEach((task) => {
      tasksItems += `<div class="task-item p-3 my-4">
      <div class="task-content">
        <div class="d-flex align-items-center">
          <h5 class="task-h me-2">${task.title}</h5>
          <div class="icon-box">
            <span
              onclick="Task.updateTask(${task.id}, '${task.title}', '${
        task.description
      }')" class="badge bg-success">
              <i class="fa-regular fa-pen-to-square"></i>
            </span>
            <span 
              onclick="Task.deleteTask('${task.id}')"
              class="badge bg-danger"
              ><i class="fa-solid fa-trash-can"></i
            ></span>
            <span
              onclick="Task.updateTaskStatus('${task.id}')"
              class="status badge bg-${task.done ? "secondary" : "primary"}"
            >${task.done ? "Done" : "In Progress"}
            </span>
          </div>
        </div>
        <p class="task-p">
        ${task.description}
        </p>
        <div class="date-box">
          <span>${task.date}</span>
        </div>
      </div>
    </div>`;
    });
    //Show Or Hide ClearAll button
    if (tasks.length === 0) {
      clearBtn.classList.add("d-none");
    } else {
      clearBtn.classList.remove("d-none");
    }
    tasksBox.innerHTML = tasksItems || "No Tasks Added Yet !";
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static createTask(title, description) {
    const task = {
      id: Math.ceil(Math.random() * 100000000),
      title,
      description,
      done: false,
      date: new Date().toDateString(),
    };
    console.log(task);
    tasks.push(task);
    this.getAllTasks();
  }

  static deleteTask(taskId) {
    tasks = tasks.filter((task) => `${task.id}` !== taskId);
    this.getAllTasks();
  }

  static updateTask(taskId, titleValue, descriptionValue) {
    editId = taskId;
    isEdit = true;
    taskTitleInput.value = titleValue;
    taskDescInput.value = descriptionValue;
    taskDescInput.focus();
    taskTitleInput.focus();
  }

  static updateTaskStatus(taskId) {
    //by default task.done is False
    const taskUpdated = tasks.find((task) => `${task.id}` === taskId);
    taskUpdated.done === false
      ? (taskUpdated.done = true)
      : (taskUpdated.done = false);

    this.getAllTasks();
  }
}
//OnClick ClearAll Tasks[]
clearBtn.addEventListener("click", function () {
  tasks = [];
  Task.getAllTasks();
});

//OnClick CreateTaskBtn
addTaskBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const titleVal = taskTitleInput.value;
  const descVal = taskDescInput.value;
  if (titleVal.length <= 0 || descVal.length <= 0) {
    Toastify({
      text: "Please Fill The Title and Description Fields",
      className: "info",
      duration: 2000,
      close: true,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  } else {
    Task.createTask(titleVal, descVal);
    resetInputs(taskTitleInput, taskDescInput);
  }
});

//OnClick UpdateTaskBtn
saveEditBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let taskTitle = taskTitleInput.value;
  let taskDescription = taskDescInput.value;
  if (isEdit && taskTitle && taskDescription) {
    const taskEditing = tasks.find((task) => task.id === editId);
    console.log(taskEditing);
    taskEditing.title = taskTitle;
    taskEditing.description = taskDescription;
    resetInputs(taskTitleInput, taskDescInput);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    Task.getAllTasks();
  } else {
    return;
  }
});
