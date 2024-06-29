//Using Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//create an instance of express
const app = express();
app.use(express.json())
app.use(cors())

// connecting mongodb
mongoose.connect('mongodb://localhost/mern-app',{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
})
.then(() => {
    console.log('DB Connected!')
})
.catch((err) => {
    console.log(err)
})

//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})


const todoModel = mongoose.model('Todo', todoSchema);


app.post('/todos', async (req, res) => {
    const {title, description} = req.body;
   
    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
   

})

//Get all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
})

app.put("/todos/:id", async (req, res) => {
    try {
        const {title, description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title , description},
            { new: true }
        )
    
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found"})
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }


})


app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();    
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
   
})

const port = 8000;
app.listen(port, () => {
    console.log("Server is listening to port "+port);
})
