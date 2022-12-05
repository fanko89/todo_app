
// What I'm still neededing to finish for this assignment:
// 1. stop writing to local storage when the app starts (remove line 9)
// 2. create local storage for categories - save categories whenever they are altered
// 3. Load categories from local storage when you start the app

// -- Milestone - all data is sync'd to local storage

// 4. Build a backend server that can accept a list of todos
// 5. Build a backend route that can provide a list of todos
// 6. Build a backend route that can accept a list of strings (categories)
// 7. Build a backend route that can provide a list of strings (categories)
// 8. Replace all instances of saving to local storage or reading from local storage with instances of POSTing to backend or GETing from backend




let todos =[
    {
        text: "Finish Homework",
        completed: false,
        editing: false,
        category: "school",
    }
]
localStorage.setItem("TodoLocalStorage", JSON.stringify(todos));
let categories = ["school"]
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
  const oldName = categories[categoryIndex-1]

  // deleting existing todos
  todos = todos.filter((todo) => {
    if (todo.category !== oldName) {
      return todo
    }
  })
  localStorage.setItem("TodoLocalStorage", JSON.stringify(todos));

  // changing the value in the categories list
  categories = categories.filter((category) => {
    if (category !== oldName) {
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
  localStorage.setItem("TodoLocalStorage", JSON.stringify(todos));

  // changing the value in the categories list
  const indexToReplace = categories.findIndex((element) => {return element === oldName})
  categories[indexToReplace] = newName

  // re-render everything
  renderTodos()
}

addCategoryBtn.onclick = () => {
  categoryText = newCategoryName.value;
  if (categoryText === "") return;
  if (categories.includes(categoryText)) return;
  categories.push(categoryText)
  renderTodos()
  addCategoryBtn.classList.remove("active");
  newCategoryName.value = "";
};

addBtn.onclick = () => {
  let todoText = todoInput.value;
  let todoData = localStorage.getItem("TodoLocalStorage");

  // determine category
  let categoryIndex = selectCategoryList.selectedIndex
  let category = undefined
  if (categoryIndex !== 0) {
    category = selectCategoryList.value
  }
  if (todoData == null) {
    todos = []; 
  } else {
    todos = JSON.parse(todoData); 
  }

  if (todoText === "") {
    console.error("no empty text allowed");
  } else {
    todos.push({text: todoText, completed: false, category});
    localStorage.setItem("TodoLocalStorage", JSON.stringify(todos));
    renderTodos();
    addBtn.classList.remove("active");
  }
  todoInput.value = "";
};


//rendering task
function renderTodos(refreshCategories = true) {
  editCategoryInput.hidden = true
  let todoData = localStorage.getItem("TodoLocalStorage");
  console.table(todoData)
  if (todoData == null) {
    todos = [];
  } else {
    todos = JSON.parse(todoData);
  }
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
    newHTML += `<option>${element}</option>`
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
  localStorage.setItem("TodoLocalStorage", JSON.stringify(todos));
  renderTodos()
}

// delete function
function deleteTodo(index) {
  let todoData = localStorage.getItem("TodoLocalStorage");
  todos = JSON.parse(todoData);
  if (todos[index].completed) {
    todos.splice(index, 1);
    localStorage.setItem("TodoLocalStorage", JSON.stringify(todos));
    renderTodos();
  }
}

// change UI to show edit around the todo
function editTodo(id) {
  todos[id].editing = true
  localStorage.setItem("TodoLocalStorage", JSON.stringify(todos));
  renderTodos()
}

// change UI to show edit around the todo
function updateTodo(id) {
  const text = document.querySelector(".editTodo").value
  todos[id].editing = false
  todos[id].text = text
  todos[id].completed = false
  localStorage.setItem("TodoLocalStorage", JSON.stringify(todos));
  renderTodos()
}

// delete list
clearBtn.onclick = () => {
  todos = []; 
  localStorage.setItem("TodoLocalStorage", JSON.stringify(todos)); 
  renderTodos(); 
};

// initial render
renderTodos();

