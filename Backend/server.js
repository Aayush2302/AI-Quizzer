import express from 'express';
import app from './app.js';

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.listen(5000,()=>{
    console.log("Server started at 5000");    
})