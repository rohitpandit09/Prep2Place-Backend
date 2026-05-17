const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user

exports.register = async (req,res)=>{
    const {name,email,password,mobile} = req.body;

    try{
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({
            name,
            email,
            password :hashedPassword,
            mobile
        });

        // creating token 

        const token = jwt.sign({
            userId : newUser._id
        },
        process.env.JWT_SECRET,
        {expiresIn:'7d'}

        );

        

        res.status(201).json({
            message:'User registered successfully',
            newUser,
            token
        })

    }catch(err){
        res.status(500).json({
            message : err.message
        })
    }
}

// Login user

exports.login = async (req,res)=>{

    const {email,password} = req.body;

    try{
        const existingUser = await User.findOne({email});

        if(!existingUser){
            return res.status(400).json({
                message : "User does't exist"
            })
        }

        const isMatch = await bcrypt.compare(password,existingUser.password);

        if(!isMatch){
            return res.status(400).json({
                message : "Incorrect password"
            })
        }

        // create token

        const token = jwt.sign(
            {userId : existingUser._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        res.status(200).json({
            message : "Login successful",
            existingUser,
            token
        })


    }catch(err){
        res.status(400).json({
            message : err.message
        })
    }


}

// getting the user the data

exports.getProfile = async (req,res)=>{
    
    try{

        const userId = req.params.id;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }

        res.status(200).json({
            message : "Profile retrieved successfully",
            user
        })

    }catch(err){
        res.status(500).json({
            message : err.message
        })
    }
}