//npm i mongoose
//npm i mongodb
//https://cloud.mongodb.com/

//use mongodb document database 
//const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://Node_user:<password>@cluster0.0k0ybrw.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     console.log('connected')
//     client.close();
//   });

//mongoose adds a strict structure like set schemas
const mongoose = require('mongoose');
const uri = "mongodb+srv://Node_user:DGM071989@cluster0.0k0ybrw.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(
    uri,
    {
        useNewUrlParser: true
       
    }
)
.then(e => console.log('MongoDB Ready!'))
.catch(console.error)


//require('./createUser')  If I made a file called create user and had the code below in it.

//sending data to database
const User = require('./user')

const newUser = new User({
    firstName: "Derek",
    middleName: "James",
    lastName: 34,
    email:'deek311@gmail.com'
})
newUser.save().then(doc => {
    console.log('new user saved to DB')
    console.log(doc)
})