const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const port = 8000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get("/", (req, res) => {
    res.status(200).send('Welcome to Task API').end();
});

app.post("/add", async (req, res, next) => {
    try {
        let result = db.insertTask(req.body.description);
        if (!result) res.status(400).json({error : "Adding new task, Error ocurred!"});
        res.status(200).send("ok").end();
    } catch (error) {
        //this will eventually be handled by your error handling middleware
        next(error);
    }
});

app.get("/get/:userId", async (req, res, next) => {
    try {
        let result = await db.getTask(req.params.userId);
        if (!result) if (!result) res.status(400).json({error : `Get task with id=${req.params.userId}, Error ocurred!`});
        res.status(200).json({result});
    } catch (error) {
        //this will eventually be handled by your error handling middleware
        next(error);
    }
});

app.get("/getAll", async (req, res, next) => {
    try {
        let result = await db.getAllTasks();
        if (!result) res.status(400).json({error : "Getting All tasks, Error ocurred!"});
        res.status(200).json({result});
    } catch (error) {
        //this will eventually be handled by your error handling middleware
        next(error);
    }
})

app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
})

db.createTable('tasks');


