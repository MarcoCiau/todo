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
    console.log(req.body.description);
    
    try {
        let result = db.insertTask(req.body.description);
        if (!result) res.sendStatus(403);
        res.status(200).send("ok").end();
    } catch (error) {
        next(error);
    }

});

app.get("/get/:userId", async (req, res, next) => {
    console.log(req.params.userId);
    try {
        let result = await db.getTask(req.params.userId);
        res.status(200).json({result});
    } catch (error) {
        //this will eventually be handled by your error handling middleware
        next(error);
    }
});

app.get("/getAll", async (req, res, next) => {
    try {
        let result = await db.getAllTasks();
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


