import "./style.css";
import "toastify-js/src/toastify.css";

import { v4 } from "uuid";
import Toastify from "toastify-js";

interface ITask {
  id: string;
  title: string;
  description: string;
}

const taskForm = document.querySelector<HTMLFormElement>("#taskForm");
const tasksList = document.querySelector<HTMLDivElement>("#taskList");

let tasks: ITask[] = [];

taskForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskForm["title"] as unknown as HTMLInputElement;
  const description = taskForm["description"] as unknown as HTMLTextAreaElement;

  tasks.push({
    id: v4(),
    title: title.value,
    description: description.value,
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  Toastify({
    text: "Task added",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();

  renderTask(tasks);
  taskForm.reset();
  title.focus();
});

document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  renderTask(tasks);
});

function renderTask(tasks: ITask[]) {
  tasksList!.innerHTML = "";
  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className =
      "bg-zinc-800 mb-1 rounded-lg hover:bg-zinc-500 p-4 hover:cursor-pointer";
    const header = document.createElement("header");
    header.className = "flex justify-between";

    const title = document.createElement("span");
    title.innerText = task.title;
    const description = document.createElement("p");
    description.innerText = task.description;

    const btnDelete = document.createElement("button");
    btnDelete.className =
      "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-md";
    btnDelete.innerText = "Delete";
    btnDelete.addEventListener("click", () => {
      const index = tasks.findIndex((predicate) => predicate.id === task.id);
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      Toastify({
        text: "Task deleted",
        style: {
          background: "#C70039",
        },
      }).showToast();
      renderTask(tasks);
    });

    header.append(title);
    header.append(btnDelete);

    taskElement.append(header);
    taskElement.append(description);

    const id = document.createElement('p');
    id.innerText = task.id;
    id.className = 'text-gray-500 text-xs';
    taskElement.append(id);

    tasksList?.append(taskElement);
  });
}
