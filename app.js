require("dotenv").config(); 
const express = require("express");
const ejs = require("ejs");
const mongoose=require("mongoose");
//const encrypt=require("mongoose-encryption");
const md5=require("md5");
 
const app = express();
 
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


const userSchema=new mongoose.Schema({
    email: String,
    password: String
});


//userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User= mongoose.model("user",userSchema);


 
app.use(express.urlencoded({
    extended:true
}));

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
    const newuser=new User({
        email:req.body.username,
        password:md5(req.body.password)
    });

    newuser.save(function(err){
        if(err) console.log(err);
        else res.render("secrets");
    });

});

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=md5(req.body.password);

    User.findOne({email:username},function(err,result){
        if(err) console.log(err);
        else{
            if(result){
                if(result.password===password) res.render("secrets");
            }
        }
    });

    


});




app.listen(3000,function(){
    console.log("successfully running on port 3000");
});