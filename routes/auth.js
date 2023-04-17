require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
const mongoose = require('mongoose');
const USER = require("../models/users")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const CLIENT_URL = "http://localhost:3000/";
const CLIENT_SUCCESS = "http://localhost:3000/profile";

router.get("/login/success", (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: req.user,
        session: req.session // Use req.session instead of req.cookies
      });
    }
  });
  
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        // Handle any errors that might occur during the logout process
        return next(err);
      }
      req.session.destroy();
      res.redirect(CLIENT_URL);
    });
  });

  router.get("/linkedin", passport.authenticate("linkedin", { scope: ['r_emailaddress', 'r_liteprofile'] }));

  router.get(
    "/linkedin/callback",
    passport.authenticate("linkedin", {
      successRedirect: CLIENT_SUCCESS,
      failureRedirect: "/login/failed",
    })
  );
  
router.post("/signup",(req,res)=>{
  const {userName,email,password}=req.body;

  if(!userName || !email || !password)
  {
      return res.status(422).json({error:"Please add all the fields"})
  }

  USER.findOne({email:email}).then((savedUser)=>{
      if(savedUser)
      {
          return res.status(422).json({error:"User Already Exist with that email"})
      }

      bcrypt.hash(password,12).then((hashedPassword)=>{

          const user = new USER({
            userName,  
            email,
            password: hashedPassword,
            source:"Manual Data",
          })
      
          user.save()
          .then(user=>{res.json({message: "Registered Successfully"})})
          .catch(err=>{console.log(err)})

      })

      
  })

  

  
})




router.post("/signin",(req,res)=>{
  const {email,password,random1} = req.body;

  if(!email || !password)
  {
      return res.status(422).json({error:"Please add email and password"})
  }

  USER.findOne({email:email}).then((savedUser)=>{

      if(!savedUser)
      {
          return res.status(422).json({error:"Invalid Email"})
      }
      bcrypt.compare(password, savedUser.password)
      .then((match)=>{
          if(match)
          {
              //return res.status(200).json({message:"Signed In Successfully"})
                  const token = jwt.sign({_id:savedUser.id},JWT_SECRET);
                  const { _id, userName, email, source  } = savedUser;
                  
                  res.json({ token, user: { _id, userName, email, source } })
                  // console.log({ token, user: { _id, userName, email  } })                  
              
          }
          else
          {
              res.status(422).json({error:"Invalid Password"})
          }
      })
      .catch(err=>console.log(err))
  })
})

module.exports = router;