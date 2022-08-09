const express=require("express");

const cors=require("cors");

const path=require('path');

const mysql=require("mysql");

const dotenv=require("dotenv");

dotenv.config({path: './.env'});

const app=express();

app.use(cors());

const db=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

console.log(__dirname);

app.use(express.urlencoded({extended: false}));
app.use(express.json());

db.connect((error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("mysql connected");
    }
});

//define routes
app.use('/auth',require('./routes/auth'));

app.listen(3000,()=>{
    console.log("server up");
});