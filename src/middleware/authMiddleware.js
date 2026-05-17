const express = require('express');
const jwt = require('jsonwebtoken');

exports.authMiddleware = (req,res,next) =>{

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            message : "Unauthorized"
        })
    }

    const token = authHeader.substring(7);

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({
            message : "Invalid token"
        })
    }
}