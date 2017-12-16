/**
 * Created by Yash 1300 on 11-12-2017.
 */
var mongoose = require('mongoose');
var express = require('express');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    amountleft:{
        type:Number,
        default: 0
    }
});

UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash){
        if (err)
            next(err);
        user.password = hash;
        next();
    });
});

module.exports = mongoose.model('User', UserSchema, "users");
