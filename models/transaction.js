/**
 * Created by Yash 1300 on 15-12-2017.
 */
var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
    name:{
        type: String
    },
    date:{
        type: String
    },
    amount:{
        type:Number
    },
    sender:{
        type: String
    },
    receiver:{
        type: String
    }
});

module.exports = mongoose.model('Transaction', transactionSchema, "transactions");