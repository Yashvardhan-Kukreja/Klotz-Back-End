/**
 * Created by Yash 1300 on 11-12-2017.
 */
var mongoose = require('mongoose');
var express = require('express');
var bcrypt = require('bcrypt');
//var session = require('client-sessions');
var user = require('../models/user');
var Transaction = require('../models/transaction');

module.exports = function(router){

    router.post('/register', function(req, res){
        var newUser = new user({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        newUser.save(function(err){
            if (err){
                console.log(err);
                res.json({success:0, message:"Error while registering the user"});
            } else {
                user.findOne({email: req.body.email}, function(err, output){
                    if (err){
                        console.log(err);
                        res.json({success:0, message:"Error while registering the user"});
                    } else {
                        if (output){
                            res.json({success:0, message:"A user already exists with the following E-mail ID"});
                        } else {
                            res.json({success:1, message:"User registered successfully"});
                        }
                    }
                });
            }
        });
    });

    router.post('/authenticate', function(req, res){
        var email = req.body.email;
        var password = req.body.password;

        user.findOne({email: email}, function (err, output){
            if (err){
                console.log(err);
                res.json({success:0, message:"Error while authenticating the user"});
            } else {
                if (!output){
                    console.log("No such user found");
                    res.json({success:0, message:"No user found with this E-mail ID"});
                } else {
                    var passwordMatches = bcrypt.compareSync(password, output.password);
                    if (!passwordMatches){
                        console.log("Wrong password entered");
                        res.json({success:0, message:"Wrong password entered"});
                    } else {
                        res.json({success:1, message:"User successfully authenticated", name:output.name, balance:output.amountleft});
                    }
                }
            }
        });
    });

    router.post('/fetchTransactions', function(req, res){
        var email = req.body.email;
        var transactionReceived = [];
        var transactionSent = [];
        Transaction.find({}).exec(function(err, output){
            if (err){
                console.log(err);
                res.json({success:0, message:"Error while fetching the details of the user"});
            } else {
                for (var i=0;i<output.length;i++){
                    if (output[i].receiver === email)
                        transactionReceived.push(output[i]);
                    else if (output[i].sender === email)
                        transactionSent.push(output[i]);
                }
                setTimeout(function(){
                    res.json({success:1, message:"Details successfully displayed", transactionSent:transactionSent, transactionReceived:transactionReceived});
                }, 500);
            }
        });

    });

    router.post('/makeTransaction', function(req, res) {
        var sender = req.body.sender;
        var receiver = req.body.receiver;
        var amount = req.body.amount;
        var name = req.body.name;
        var date = req.body.date;

        user.findOne({email: sender}, function (err, output) {
            if (err) {
                console.log(err);
                res.json({success: 0, message: "Error in transaction"});
            } else {
                if (!output) {
                    console.log("No such user found");
                    res.json({success: 0, message: "No user found with this E-mail ID"});
                } else {
                    user.findOne({email: receiver}, function (err, output2) {
                        if (err) {
                            console.log(err);
                            res.json({success: 0, message: "Error in transaction"});
                        } else {
                            if (!output2) {
                                console.log("No such user found");
                                res.json({success: 0, message: "No user found with this E-mail ID"});
                            } else {
                                user.findOneAndUpdate({email: sender}, {amountleft: parseInt(output.amountleft) - amount}, function (err) {
                                    if (err) {
                                        console.log(err);
                                        res.json({success: 0, message: "Error in transaction"});
                                    } else {
                                        user.findOneAndUpdate({email: receiver}, {amountleft: parseInt(output2.amountleft) + amount}, function (err) {
                                            if (err) {
                                                console.log(err);
                                                res.json({success: 0, message: "Error in transaction"});
                                            } else {
                                                var trans = new Transaction({
                                                    name: name,
                                                    date: date,
                                                    amount: amount,
                                                    sender: sender,
                                                    receiver: receiver
                                                });
                                                trans.save(function(err){
                                                    if (err){
                                                        console.log(err);
                                                        res.json({success: 0, message: "Error in transaction"});
                                                    } else {
                                                        res.json({success: 1, message: "Transaction successful"});
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    return router;
};