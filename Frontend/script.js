const HEROKU_API_ROOT_URL ="http://localhost:3000";
const toDo_url = `${HEROKU_API_ROOT_URL}/todo`;



function getList(completed){
    const body = {complete: completed}
    fetch(toDo_url,{
        headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
          body: JSON.stringify(body),
    })
    .then((res) => res.json())
    .then((list) => {
        renderCards(list);
    });
};


document
  .getElementById("form_submit_btn")
  .addEventListener("click", submitForm);

function submitForm(event) {
    event.preventDefault();

    const item = document.getElementById("item").value;
    const dueDate = document.getElementById("date").value;

    document.getElementById("item").value = "";
    document.getElementById("date").value = "";

    const toDo = {
        item,
        complete: "false"
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

    list.forEach((item) => {
      const { _id, itemName, dueDate, } = item;

      const card = document.createElement("div");
      card.classList.add("card w-75");

      card.innerHTML = `
                  <div id=${_id} class="card-body">
                      <h5 class="card-title">${itemName}</h5>
                      <p class="card-text">${dueDate}</p>
                      <div id="car-btn-container"></div>
                  </div>`;

      todoListContainer.appendChild(card);

      const completBtn = document.createElement("btn");
      completeBtn.classList.add("btn", "btn-success");
      completeBtn.setAttribute("todoId", _id);
      completeBtn.innerText = "Completed";
      completeBtn.addEventListener("click", handleComplete);

      const editBtn = document.createElement("btn");
      editBtn.classList.add("btn", "btn-warning");
      editBtn.setAttribute("todoId", _id);
      editBtn.innerText = "Edit";
      editBtn.addEventListener("click", handleEdit);

      const deleteBtn = document.createElement("btn");
      deleteBtn.classList.add("btn", "btn-danger");
      deleteBtn.setAttribute("todoId", _id);
      deleteBtn.innerText = "Delete";
      deleteBtn.addEventListener("click", handleDelete);

      document.getElementById(_id).children[2].appendChild(completeBtn);
      document.getElementById(_id).children[2].appendChild(editBtn);
      document.getElementById(_id).children[2].appendChild(deleteBtn);
    });
}

function handleComplete(event) {
    const id = event.target.getAttribute("todoId");
    const update = {
        _id: id,
        complete: "true",
    }
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

    fetch(destinations_url, {
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

    fetch(destinations_url + "/" + todoId, { method: "delete" })
      .then((res) => res.json())
      .then((destinations) => {
        renderCards(destinations);
    });
}
