const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(cors());


// Connect to MongoDB using mongoose
mongoose.connect('mongodb+srv://Node_user:DGM071989@cluster0.0k0ybrw.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true
  //useUnifiedTopology: true
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
  
});
console.log (todoSchema)
const categorySchema = new mongoose.Schema({
  category: String
});

const Todo = mongoose.model('Todo', todoSchema);
const Category = mongoose.model('Category', categorySchema);

// Returns all todo items
app.get('/todos' = async (req, res) => {
  await Todo.find((err, todos) => {
    if (err) return console.error(err);
    res.json(todos);
  });
});

// Adds a new todo item
app.post('/todos' = async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save((err, todo) => {
    if (err) return console.error(err);
    res.json(todo);
  });
});

// Updates a todo item
app.put('/todos/:id' = async (req, res) => {
  await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, todo) => {
    if (err) return console.error(err);
    res.json(todo);
  });
});

// Deletes a todo item
app.delete('/todos/:id' = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id, (err, todo) => {
    if (err) return console.error(err);
    res.json(todo);
  });
});

// Returns all categories
app.get('/categories' = async (req, res) => {
  await Category.find((err, categories) => {
    if (err) return console.error(err);
    res.json(categories);
  });
});

// Adds a new category
app.post('/categories' = async (req, res) => {
  const category = new Category(req.body);
  await category.save((err, category) => {
    if (err) return console.error(err);
    res.json(category);
  });
});

// Updates a category
app.put('/categories/:id' = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, category) => {
    if (err) return console.error(err);
    res.json(category);
  });
});

// Deletes a category and all todo items in that category
app.delete('/categories/:id' = async (req, res) => {
  // Delete the category
  await Category.findByIdAndDelete(req.params.id, (err, category) => {
    if (err) return console.error(err);
    // Delete all todo items in the deleted category
    Todo.deleteMany({ category: category.category }, (err) => {
      if (err) return console.error(err);
      res.json(category);
    });
  });
});

// Clears all todo items and categories
app.delete('/clear'= async (req, res) => {
  // Delete all todo items
  await Todo.deleteMany({}, (err) => {
    if (err) return console.error(err);
    // Delete all categories
    Category.deleteMany({}, (err) => {
      if (err) return console.error(err);
      res.sendStatus(200);
    });
  });
});

// Returns the number of todo items
app.get('/tally' = async (req, res) => {
  await Todo.countDocuments((err, count) => {
    if (err) return console.error(err);
    res.json({ count });
  });
});

app.listen(3000, () => {
  console.log('Todo app listening on port 3000!');
});