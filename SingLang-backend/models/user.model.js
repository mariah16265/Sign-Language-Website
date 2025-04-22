//models/user.model.js
const mongoose = require("mongoose");

//creating a schema for the table
const userSchema = new mongoose.Schema(
    {
        // Child info
        Cname:{         //child name
            type: String, required: true},
        Cdob:{ 
            type: String, required: true},
        Cstyle:{        //communication style
            type: String}, 
        Cneeds:{ 
            type: String},

        // Grown-up info
        Gname:{     //guardian name
            type: String, required: true},
        Gemail:{ 
            type: String, required: true, unique: true},
        Gphone:{ 
            type: String, required: true},
        Grelation:{
            type: String },

        // Account setup
        username:{
            type: String, required: true, unique: true},
        password:{
            type: String, required: true }, // will be hashed using bcrypt

        }, {timestamps: true, // Adds createdAt and updatedAt
    }
);

module.exports = mongoose.model("User", userSchema);
