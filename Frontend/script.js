const HEROKU_API_ROOT_URL = "http://localhost:3000";
const toDo_url = `${HEROKU_API_ROOT_URL}/todo`;

let auth0 = null;

window.onload = async () => {
  await configureClient();
  await processLoginState();
  updateUI();
};

const configureClient = async () => {
  auth0 = await createAuth0Client({
    domain: "dev-wb32quj9.us.auth0.com",
    client_id: "xTz2vpPOEIDCFlWHpltZSZVjep7bvZFG",
  });
};

const processLoginState = async () => {
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    signBtn.innerText = "Sign Out";
    signBtn.className = "btn btn-danger";
    signBtn.setAttribute("onclick", "logout()");
    const user = await auth0.getUser();
    var userId = user.sub;
    sessionStorage.setItem("userId", userId);
    getList("false");
  } else {
    signBtn.innerText = "Sign In";
    signBtn.className = "btn btn-primary";
    document.getElementById("list-container").innerHTML = "";
    sessionStorage.removeItem("userId");
  }
};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.href,
  });
};

const logout = () => {
  auth0.logout({
    returnTo: window.location.href,
  });
};

function getList(completed) {
  fetch(
    `${toDo_url}?complete=${completed}&userId=${sessionStorage.getItem(
      "userId"
    )}`
  )
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

  const itemName = document.getElementById("item").value;
  const dueDate = document.getElementById("date").value;
  const userId = sessionStorage.getItem("userId");

  document.getElementById("item").value = "";
  document.getElementById("date").value = "";

  const toDo = {
    itemName,
    complete: "false",
    userId,
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
    const { _id, itemName, dueDate, complete } = entry;

    const card = document.createElement("div");
    card.className = "card w-100";

    card.innerHTML = `
                  <div id=${_id} class="card-body">
                      <h5 class="card-title">${itemName}</h5>
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
  const userId = sessionStorage.getItem("userId");
  const update = {
    _id: id,
    complete: "true",
    userId,
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
  const userId = sessionStorage.getItem("userId");

  const update = {
    _id: id,
    itemName: newItemName,
    dueDate: newDueDate,
    userId,
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
  const id = event.target.getAttribute("todoId");
  const userId = sessionStorage.getItem("userId");

  const itemToDelete = {
    _id: id,
    userId,
  };

  fetch(toDo_url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
    body: JSON.stringify(itemToDelete),
  })
    .then((res) => res.json())
    .then((list) => {
      renderCards(list);
    });
}
