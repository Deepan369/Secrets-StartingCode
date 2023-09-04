require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const async = require("async");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

const userschema = new mongoose.Schema({
  email:String,
  password:String
});


userschema.plugin(encrypt,{secret : process.env.SECRET , encryptedFields:["password"]});

const User = new mongoose.model("User",userschema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newuser = new User({
    email:req.body.username,
    password:req.body.password
  });
  async function savingif(){
    try {
        const hulk = await newuser.save();
        if(hulk === newuser){
          res.render("secrets.ejs")
        }
    } finally {

    }
  }
  savingif();

});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  async function finding(){
    try {
      const founduser = await User.findOne({email:username}).exec();
      if (founduser) {
        if (founduser.password === password) {
          res.render("secrets");
        }
      }
    } finally {

    }
  }
  finding();
});

app.listen("3000",function(){
  console.log("server is running on port 3000 ");
});
