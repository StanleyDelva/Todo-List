//Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector('.filter-todo');

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);

//Functions

function addTodo(event) {
    //prevent form from submitting
    event.preventDefault();
    //Todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //Create li
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //add todo to local storage
    saveLocalTodos(todoInput.value);
    //check button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //Trash button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //Append to list
    todoList.appendChild(todoDiv);
    //Clear todo input value
    todoInput.value = "";


}

function deleteCheck(e) {
    const item = e.target;
    //DELETE TODO
    if(item.classList[0] === 'trash-btn'){
        const todo = item.parentElement;
        //Transition
        todo.classList.add("fall");
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', function(){
            todo.remove();
        });
    }
    
    //Check Todo
    if(item.classList[0] === 'complete-btn'){
        const todo = item.parentElement;
        todo.classList.toggle("completed");
        saveCompletedTodos(todo);
    }

}

function filterTodo(e){
    const todos = todoList.childNodes;
    todos.forEach(function(todo){
        switch(e.target.value){
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if(todo.classList.contains("completed")){
                    todo.style.display = "flex";
                }else{
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if(!todo.classList.contains("completed")){
                    todo.style.display = "flex";
                }else{
                    todo.style.display = "none";
                }
                break;
        }
    })
}

function saveLocalTodos(todo){
    let todos;
    //check if any todos are saved already
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}


//trying to make a new array of to-dos that were completed; will check array against saved todos, then reappply completed status at startup
//also have to delete from completed array if complete button is clicked again after complete condition is already applied
//also should delete from completed list if todo is deleted from local storage
function saveCompletedTodos(todo) {
    let cTodos;
    
    if(localStorage.getItem('completed') === null){
        cTodos = [];
    }else{
        cTodos = JSON.parse(localStorage.getItem('completed'));
    }
    //Need to get text from todo
    cTodos.push(todo.textContent);
    localStorage.setItem("completed", JSON.stringify(cTodos));

}

//FIND A WAY TO COMPARE COMPLETED ARRAY WITH ALL TODOS, THEN REAPPLY COMPLETED STATUS AT STARTUP
function getTodos(){
    let todos;
    let Ctodos;
    //check local storage 
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    
    if(localStorage.getItem('completed') === null){
        Ctodos = [];
    }else{
        Ctodos = JSON.parse(localStorage.getItem('completed'));
    }   

    todos.forEach(function(todo){
        //Todo div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        //Create li
        const newTodo = document.createElement("li");
        newTodo.innerText = todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);
        //check button
        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);
        //Trash button
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);
        //Append to list
        todoList.appendChild(todoDiv);


    })

    //Loop through length of todos; if element i of todos equals element i of Ctodos, reapply completed class on startup
    for(let i = 0; i < todos.length; i++) {
        if(todos[i] == Ctodos[i]){
            todo = document.getElementsByClassName('todo-item');
            nlength = todo.length;

            for (let x = 0; x < nlength; x++) {
                if(todo[x].innerText == Ctodos[i]) {
                    todo[x].classList.toggle("completed");
                }
            }
        

               

        }
    }


}

function removeLocalTodos(todo) {
    let todos;
    let Ctodos;
    //check local storage 
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    if(localStorage.getItem('completed') === null){
        Ctodos = [];
    }else{
        Ctodos = JSON.parse(localStorage.getItem('completed'));
    }    

    //Get index of todo that needs to be deleted, and splice it from todo storage and completed storage, if applicable
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    for(let i = 0; i < Ctodos.length; i++){
        if(todoIndex == Ctodos[i]){
            Ctodos.splice(Ctodos.indexOf(todoIndex), 1);
        }
    }
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('completed', JSON.stringify(Ctodos));
}