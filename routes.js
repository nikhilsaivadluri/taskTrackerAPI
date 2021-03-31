
const express = require('express')
const routes = new express.Router();
const Tasks = require('./models/tasks');
const Middleware = require("./middleware");
const jwt = require("jsonwebtoken");
const Config = require("./config");


routes.post("/login", async(req,res)=>{

    let name = req.body.name;
    let apikey = req.body.id;
    
    if(apikey==undefined ||apikey!=Config.apikey)
    {
        res.status(401).send({message:"Authorization information is missing or invalid"});
        return;
    }
    let token = jwt.sign({ name: name },
        Config.jwtsecret,
        {
            expiresIn: '24h' // expires in 24 hours
        }
    );
    let response = {
        token:{
            name:name,
            token:token
        },
        image:"/images/profile.jpg"
    }
    res.status(200).send(response);
})


routes.post("/tasks",Middleware.authenticate, async(req, res) => {
    let taskname = req.body.name;

    if (!req.body.hasOwnProperty("name")) {
        res.status(400).send({ message: "Task details is missing or didn't have a name attribute" });
        return;
    }

    const task = new Tasks({
        name: taskname,
        completed: false
    })

    task.save((error, document) => {
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).send(document);
    })

});

routes.get("/tasks",Middleware.authenticate, async(req, res) => {

    Tasks.find({}, function (err, result) {
        if (err) {
            res.status(400).send(error);
        }
        res.status(200).send(result);
    })

});


routes.put("/tasks/:id",Middleware.authenticate, async(req, res) => {

    const task = await Tasks.findOne({ _id: req.params.id },function (err, result){
        if(err)
        {
            res.status(404).send({ message: "Task was not found" });
            return;
        }
        return result;
    });
    
    task.name = req.body.name;
    task.completed = req.body.completed;
    task.save((error, document) => {
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).send(document);
    })

});

routes.delete("/tasks/:id",Middleware.authenticate, async(req, res) => {

    const task = await Tasks.findOne({ _id: req.params.id },function (err, result){
        if(err)
        {
            res.status(404).send({ message: "Task was not found" });
            return;
        }
        return result;
    });
    
    if(task.completed)
    {
        res.status(400).send({ message: "Task is marked complete,it cannot be deleted" });
        return;
    }

    task.remove((error, document) => {
        if (error) {
            res.status(400).json(error);
        }
        res.status(200).json(document);
    })

});


routes.get("/dashboard",Middleware.authenticate, async(req, res) => {

    Tasks.find({}, function (err, result) {
        if (err) {
            res.status(400).send(error);
        }
        
        let tasksCompleted = 0;
        result.forEach(task =>{
            if(task.completed)
            tasksCompleted++;
        });

        let latestTasks = (result.length > 3) ? result.slice(result.length - 3, result.length) : result;

        let response={
            tasksCompleted:tasksCompleted,
            totalTasks:result.length,
            latestTasks:latestTasks
        }

        res.status(200).send(response);
    })


});


module.exports = routes;








module.exports = routes;