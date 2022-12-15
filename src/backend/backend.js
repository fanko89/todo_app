const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// const { ObjectID } = require('mongodb');
// let objectId = new ObjectID();
// // Verify that the hex string is 24 characters long
// assert.equal(24, objectId.toHexString().length);



app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB using mongoose

// Connect to MongoDB using mongoose
//require('dotenv').config();
//const uri = 'mongodb+srv://Node_user:DGM071989@cluster0.0k0ybrw.mongodb.net/?retryWrites=true&w=majority'
// const uri = process.env.MONGO_URL
// mongoose.connect(
//   uri,
// { 

//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

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
  completed: {
    type:Boolean,
  default: false
  },
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