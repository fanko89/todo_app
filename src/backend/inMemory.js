//this is the way to use inmemory server with help from postman


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


app.use(bodyParser.json());
app.use(cors());


const todos = [];
const categories = [];
const frontendIpAddress = 'http://127.0.0.1:5500';

// Returns all todo items
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Adds a new todo item
app.post('/todos', (req, res) => {
  const todo = req.body;
  todos.push(todo);
  res.json(todo);
});

// Updates a todo item
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const todo = req.body;
  todos[id] = todo;
  res.json(todo);
});

// Deletes a todo item
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  const todo = todos[id];
  todos.splice(id, 1);
  res.json(todo);
});

// Returns all categories
app.get('/categories', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', frontendIpAddress);
  res.json(categories);
});


// Adds a new category
app.post('/categories', (req, res) => {
  const category = req.body;
  categories.push(category);
  res.setHeader('Access-Control-Allow-Origin', frontendIpAddress);
  res.json(category);
});

// Updates a category
app.put('/categories/:id', (req, res) => {
  const id = req.params.id;
  const category = req.body;
  categories[id] = category;
  res.setHeader('Access-Control-Allow-Origin', frontendIpAddress);
  res.json(category);
});

// Deletes a category and all todo items in that category
app.delete('/categories/:id', (req, res) => {
  const id = req.params.id;
  const category = categories[id];
  categories.splice(id, 1);
  todos.forEach((todo, i) => {
    if (todo.category === category.category) {
      todos.splice(i, 1);
    }
  });
  res.setHeader('Access-Control-Allow-Origin', frontendIpAddress);
  res.json(category);
});

// Clears all todo items and categories
app.delete('/clear', (req, res) => {
  todos.length = 0;
  categories.length = 0;
  res.sendStatus(200);
});

// Returns the number of todo items
app.get('/tally', (req, res) => {
  const count = todos.length;
  res.json({ count });
});

app.listen(3000, () => {
  console.log('Todo app listening on port 3000!');
});















const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(cors());
const todos = [];
const categories = [];
// Connect to MongoDB using mongoose
mongoose.connect('mongodb+srv://Node_user:DGM071989@cluster0.0k0ybrw.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB!');
});

// Define mongoose schemas and models
const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  category: String,
  date: Date
});

const categorySchema = new mongoose.Schema({
  category: String
});

const Todo = mongoose.model('Todo', todoSchema);
const Category = mongoose.model('Category', categorySchema);

// Returns all todo items
app.get('/todos', (req, res) => {
  Todo.find((err, todos) => {
    if (err) return console.error(err);
    res.json(todos);
  });
});

// Adds a new todo item
app.post('/todos', (req, res) => {
  const todo = req.body;
  todo.save((err, todo) => {
    if (err) return console.error(err);
    res.json(todo);
  });
});

// Updates a todo item
app.put('/todos/:id', (req, res) => {
  Todo.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, todo) => {
    if (err) return console.error(err);
    res.json(todo);
  });
});

// Deletes a todo item
app.delete('/todos/:id', (req, res) => {
  Todo.findByIdAndDelete(req.params.id, (err, todo) => {
    if (err) return console.error(err);
    res.json(todo);
  });
});

// Returns all categories
app.get('/categories', (req, res) => {
  Category.find((err, categories) => {
    if (err) return console.error(err);
    res.json(categories);
  });
});

// Adds a new category
app.post('/categories', (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) return console.error(err);
    res.json(category);
  });
});

// Updates a category
app.put('/categories/:id', (req, res) => {
  Category.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, category) => {
    if (err) return console.error(err);
    res.json(category);
  });
});

// Deletes a category and all todo items in that category
app.delete('/categories/:id', (req, res) => {
  // Delete the category
  Category.findByIdAndDelete(req.params.id, (err, category) => {
    if (err) return console.error(err);
    // Delete all todo items in the deleted category
    Todo.deleteMany({ category: category.category }, (err) => {
      if (err) return console.error(err);
      res.json(category);
    });
  });
});

// Clears all todo items and categories
app.delete('/clear', (req, res) => {
  // Delete all todo items
  Todo.deleteMany({}, (err) => {
    if (err) return console.error(err);
    // Delete all categories
    Category.deleteMany({}, (err) => {
      if (err) return console.error(err);
      res.sendStatus(200);
    });
  });
});

// Returns the number of todo items
app.get('/tally', (req, res) => {
  Todo.countDocuments((err, count) => {
    if (err) return console.error(err);
    res.json({ count });
  });
});

app.listen(3000, () => {
  console.log('Todo app listening on port 3000!');
});