const HEROKU_API_ROOT_URL = "http://localhost:3000";
const toDo_url = `${HEROKU_API_ROOT_URL}/todo`;


document.getElementById("signBtn").addEventListener("click", handleSign)

function handleSign(e) {
  const signBtn = e.target

  if (signBtn.innerText === "Sign In") {
      signBtn.innerText = "Sign Out"
      signBtn.className = "btn btn-danger"
      getList("false")
  }
  else {
    signBtn.innerText = "Sign In"
    signBtn.className = "btn btn-primary"
    document.getElementById("list-container").innerHTML = ""
  }
}

function getList(completed) {
  fetch(toDo_url + "?" + `complete=${completed}`)
    .then((res) => res.json())
    .then((list) => {
      renderCards(list);
    });
}

document
  .getElementById("form_submit_btn")
  .addEventListener("click", submitForm);

document
  .getElementById("inProgress")
  .addEventListener("click", handleInProgress);
document.getElementById("completed").addEventListener("click", handleCompleted);

function handleInProgress() {
  getList("false");
}

function handleCompleted() {
  getList("true");
}

function submitForm(event) {
  event.preventDefault();

  const item = document.getElementById("item").value;
  const dueDate = document.getElementById("date").value;

  document.getElementById("item").value = "";
  document.getElementById("date").value = "";

  const toDo = {
    item,
    complete: "false",
  };

  if (dueDate && dueDate.length !== 0) {
    toDo.dueDate = dueDate;
  }

  fetch(toDo_url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(toDo),
  })
    .then((res) => res.json())
    .then((list) => {
      renderCards(list);
    });
}

function renderCards(list) {
  const todoListContainer = document.getElementById("list-container");

  todoListContainer.innerHTML = "";

  list.forEach((entry) => {
    const { _id, item, dueDate, complete } = entry;

    const card = document.createElement("div");
    card.className = "card w-100";

    card.innerHTML = `
                  <div id=${_id} class="card-body">
                      <h5 class="card-title">${item}</h5>
                      <p class="card-text">${dueDate}</p>
                      <div id="car-btn-container"></div>
                  </div>`;

    todoListContainer.appendChild(card);

    if (complete === "false") {
      const completeBtn = document.createElement("btn");
      completeBtn.classList.add("btn", "btn-success");
      completeBtn.setAttribute("todoId", _id);
      completeBtn.innerText = "Complete";
      completeBtn.addEventListener("click", handleComplete);

      const editBtn = document.createElement("btn");
      editBtn.classList.add("btn", "btn-warning");
      editBtn.setAttribute("todoId", _id);
      editBtn.innerText = "Edit";
      editBtn.addEventListener("click", handleEdit);
      
      document.getElementById(_id).children[2].appendChild(completeBtn);
      document.getElementById(_id).children[2].appendChild(editBtn);
    }

    const deleteBtn = document.createElement("btn");
    deleteBtn.classList.add("btn", "btn-danger");
    deleteBtn.setAttribute("todoId", _id);
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", handleDelete);

    
    document.getElementById(_id).children[2].appendChild(deleteBtn);
    
  });
}

function handleComplete(event) {
  const id = event.target.getAttribute("todoId");
  const update = {
    _id: id,
    complete: "true",
  };
  fetch(toDo_url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(update),
  })
    .then((res) => res.json())
    .then((list) => {
      renderCards(list);
    });
}

function handleEdit(event) {
  const id = event.target.getAttribute("todoId");
  const newItemName = window.prompt("Enter new item name");
  const newDueDate = window.prompt("Enter new due date");

  const update = {
    _id: id,
    itemName: newItemName,
    dueDate: newDueDate,
  };

  fetch(toDo_url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(update),
  })
    .then((res) => res.json())
    .then((list) => {
      renderCards(list);
    });
}

function handleDelete(event) {
  const Id = event.target.getAttribute("todoId");

  fetch(toDo_url + "/" + Id, { method: "delete" })
    .then((res) => res.json())
    .then((destinations) => {
      renderCards(destinations);
    });
}
