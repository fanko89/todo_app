
let todos =[]
let categories = []
let filterByCategory = undefined

// getting all required elements
let todoList = document.querySelector(".todoUL");
let todoInput = document.querySelector(".addTodo");
let addBtn = document.querySelector(".inputField button");
let clearBtn = document.querySelector(".footer button");
let addCategoryBtn = document.querySelector(".addCategoryBtn");
let newCategoryName = document.querySelector(".newCategoryName");
let selectCategoryList = document.querySelector("#selectCategory")
let filterCategoryList = document.querySelector("#filterCategory")
let editCategoryButton = document.querySelector("#editCategoryButton")
let editCategoryText = document.querySelector(".editCategoryName")
let editCategoryInput = document.querySelector("#editCategoryInput")
let editCategoryConfirmButton = document.querySelector(".editCategoryConfirmButton")
let editCategoryDeleteButton = document.querySelector(".editCategoryDeleteButton")


filterCategoryList.addEventListener("change",() => {
  if (filterCategoryList.selectedIndex === 0) {
    filterByCategory = undefined
  } else {
    filterByCategory = filterCategoryList.value
  }
  renderTodos(false)
})

editCategoryButton.onclick = () => {
  const categoryIndex = filterCategoryList.selectedIndex

  if (categoryIndex !== 0) {
    const categoryText = filterCategoryList.value
    editCategoryInput.hidden = false
    editCategoryText.value = categoryText
  }
}

// delete a category
editCategoryDeleteButton.onclick = () => {
  const categoryIndex = filterCategoryList.selectedIndex
  const oldName = categories[categoryIndex-1].category

  // deleting existing todos
  todos = todos.filter((todo) => {
    if (todo.category !== oldName) {
      return todo
    }
  })
  deleteCategoryOnServer(categoryIndex-1)

  // changing the value in the categories list
  categories = categories.filter((category) => {
    if (category.category !== oldName) {
      return category
    }
  })

  // re-render everything
  renderTodos()
}

// edit a category
editCategoryConfirmButton.onclick = () => {
  const categoryIndex = filterCategoryList.selectedIndex
  const newName = editCategoryText.value
  if (categories.includes(newName)) {
    renderTodos()
    return
  }
  const oldName = categories[categoryIndex-1]

  // replacing category on existing todos
  todos = todos.map((todo) => {
    if (todo.category === oldName) {
      todo.category = newName
    }
    return todo
  })
  updateCategoryOnServer(categoryIndex-1, newName)

  // changing the value in the categories list
  const indexToReplace = categories.findIndex((element) => {return element.category === oldName})
  categories[indexToReplace].category = newName

  // re-render everything
  renderTodos()
}

addCategoryBtn.onclick = () => {
  const categoryText = newCategoryName.value;
  if (categoryText === "") return;
  if (categories.includes({category: categoryText})) return;
  categories.push({category: categoryText})
  addCategoryOnServer({category: categoryText})
  renderTodos()
  addCategoryBtn.classList.remove("active");
  newCategoryName.value = "";
};

addBtn.onclick = () => {
  let todoText = todoInput.value;

  // determine category
  let categoryIndex = selectCategoryList.selectedIndex
  let category = undefined
  if (categoryIndex !== 0) {
    category = selectCategoryList.value
  }

  if (todoText === "") {
    console.error("no empty text allowed");
  } else {
    todos.push({text: todoText, completed: false, category});
    // update backend
    addTodoOnServer({text: todoText, completed: false, category})

    renderTodos();
    addBtn.classList.remove("active");
  }
  todoInput.value = "";
};


//rendering task
function renderTodos(refreshCategories = true) {
  editCategoryInput.hidden = true
  const pendingTasksNumb = document.querySelector(".tasksLeft");
  pendingTasksNumb.textContent = todos.length;
  if (todos.length > 0) {
    clearBtn.classList.add("active"); 
  } else {
    clearBtn.classList.remove("active"); 
  }
  let newLiTag = "";
  todos.forEach((element, index) => {

    if (element.category === filterByCategory || filterByCategory === undefined || refreshCategories) {
      if (element.editing) {
        newLiTag += `<li><input type="text" class="editTodo"  placeholder=${element.text}><span class="icon" onclick="updateTodo(${index})"><i class="fa-solid fa-check"></i></span></li>`;
      } else if (element.completed) {
        newLiTag += `<li onclick="completeTodo(${index})"><s>${element.text} ${element.category ? `(${element.category})` : ""}</s><span class="icon" onclick="deleteTodo(${index})"><i class="fas fa-trash"></i></span></li>`;
      } else {
        newLiTag += `<li onclick="completeTodo(${index})">${element.text} ${element.category ? `(${element.category})` : ""}<span class="icon" onclick="editTodo(${index})"><i class="fas fa-edit"></i></span></li>`;
      }
    }
  });
  todoList.innerHTML = newLiTag;
  if (refreshCategories) {
    renderCategories()
  }
}

function renderCategories() {
  let newHTML = "";
  selectCategoryOption =  `<option selected>Select Category</option>`
  filterByCategoryOption = `<option selected>Filter By Category</option>`

  categories.forEach((element, index) => {
    newHTML += `<option>${element.category}</option>`
  })

  if (categories.length === 0) {
    newHTML = `<option selected>No Categories Exist</option>`
    selectCategoryList.innerHTML = newHTML
    filterCategoryList.innerHTML = newHTML
  } else {
    selectCategoryList.innerHTML = selectCategoryOption + newHTML
    filterCategoryList.innerHTML = filterByCategoryOption + newHTML
  }
}

function completeTodo(id) {
  todos[id].completed = !todos[id].completed
  renderTodos()
}

// delete function
function deleteTodo(index) {
  if (todos[index].completed) {
    todos.splice(index, 1);
    deleteTodoOnServer(index)
    renderTodos();
  }
}

// change UI to show edit around the todo
function editTodo(id) {
  todos[id].editing = true
  renderTodos()
}

function updateTodo(id) {
  const text = document.querySelector(".editTodo").value
  todos[id].editing = false
  todos[id].text = text
  todos[id].completed = false
  
  updateTodoOnServer(id, {text: text, completed: false, category: todos[id].category})
  renderTodos()
}

// delete list
clearBtn.onclick = () => {
  todos = []; 
  clearAllOnServer();
  renderTodos(); 
};

require('dotenv').config();
const SERVER_URL = 'http://localhost:3000';

// Function to retrieve all todos from the server
async function getTodosFromServer() {
  const response = await fetch(`${SERVER_URL}/todos`);
  const data = await response.json();
  todos = data;
}

// Function to add a new todo to the server
async function addTodoOnServer(todo) {
  const body = JSON.stringify(todo)
  console.log(todo)
  await fetch(`${SERVER_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
}

// Function to update a todo on the server
async function updateTodoOnServer(id, updatedTodo) {
  const response = await fetch(`${SERVER_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTodo),
  });
}

// Function to delete a todo from the server
async function deleteTodoOnServer(id) {
  await fetch(`${SERVER_URL}/todos/${id}`, {
    method: 'DELETE',
  });
}

// Function to clear all todos from the server
async function clearAllOnServer() {
  await fetch(`${SERVER_URL}/clear`, {
    method: 'DELETE',
  });
}

// Function to tally the number of todos on the server
async function tallyFromServer() {
  await fetch(`${SERVER_URL}/todos/count`);
}

// Function to get all categories from server
async function getCategoriesFromServer(category) {
  console.log(category)
  const response = await fetch(`${SERVER_URL}/categories`, {
    method: 'GET',
  });
  const data = await response.json();
  categories = data;
}

// Function to add a new category to the server
async function addCategoryOnServer(category) {
  console.log(category)
  await fetch(`${SERVER_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
}

// Function to update a category on the server
async function updateCategoryOnServer(id, updatedCategory) {
  await fetch(`${SERVER_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedCategory),
  });
}

// Function to delete a category from the server
async function deleteCategoryOnServer(id) {
  await fetch(`${SERVER_URL}/categories/${id}`, {
    method: 'DELETE',
  });
}


async function main() {
  // app setup logic
  await getTodosFromServer();
  await getCategoriesFromServer()
  renderTodos();
}

main();

