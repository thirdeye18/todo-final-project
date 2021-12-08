form.addEventListener("submit", eventHandler);

function eventHandler(e) {
    e.preventDefault();

    let item = e.target.itemInput.value;
    let date = e.target.dateInput.value;

    let toDoContainer = document.getElementById("container");

    

}