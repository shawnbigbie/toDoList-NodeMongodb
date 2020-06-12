const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const Tasks = require('./models/tasks');

// CONNECTION TO MONGODB
mongoose.connect('mongodb+srv://Emma:password999@usersignup-6yj6w.mongodb.net/toDoList?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.engine('.hbs', hbs ({
    defaultLayout: 'layout',
    extname: 'hbs'
}));

app.set('view engine', '.hbs');

app.get('/', async(req,res) => {
    //display all items from database

    // let resultArray = [];

    // find all data in the database
    let data = await Tasks.find().lean().exec();
    console.log(data);

    // let allTasks = data.toDo;
    // console.log(allTasks)

    //if can't find any entries in the database
    if (data == null) {
        res.render('index', {err: "You do not have any Tasks saved"});
        return;
    }

    // if (allTasks == null) {
    //     res.render('index', {err: "you do not have any tasks"})
    //     return;
    // }
    // res.render('index', {allTasks: allTasks.toObject()});
    
    //otherwise return all data
    res.render('index', { allTasks: data});
})

//delete items from database
app.get('/delete/:id', async(req,res) => {
    const id = req.params.id;
    console.log(id);
    Tasks.findByIdAndRemove(id, err => {
        if (err) return res.send(500,err);
        res.redirect('/');
    });

});

//edit items in database
app.get('/complete/:id', async(req,res) => {
    const id = req.params.id;
    console.log(id);
    Tasks.findByIdAndUpdate(id, {status: true}, err =>
{
    if (err) return res.send(500,err);
    res.redirect('/')
});
});


// app.get('/complete/:id', async(req,res) => {
//     const taskDone = req.params.id;
//     console.log(taskDone);
//     res.redirect('/');
// })





app.post('/', async(req,res) => {
    //check if task has been entered first
    if (!req.body.newTask) {
        res.render('index', {err: "Please enter your task"});
        return;
    }
    //otherwise send task to database
    let task = new Tasks({
        toDo: req.body.newTask,
        timeUploaded: Date.now(),
        status: false
    });

    console.log(req.body.newTask);
    await task.save().catch((reason) => {
        res.render('index', {err: 'failed to save to database'})
        return;
    });
    res.redirect('/');
})
//originally has this {task: task.toObject()} but 'get' this is the get method

// success:"Item added",

app.listen(3005, () => {
    console.log("you are listening on port 3005")
})