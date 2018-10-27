const User = require("../models/user");
const Application = require("../models/application");;
const mongoose = require("mongoose");
const assert = require("assert");

var RegResults = function () {
    var result = {
        success: false,
        message: null,
        user: null
    }
    return result;
}

var registration = function (db) {
    var self = this;

    var validateInputs = function (app) {
        if (!app.email || !app.password) {
            app.setInvalid("Email and password are required");
        } else if (app.password !== app.confirm) {
            app.setInvalid("Passwords do not match")
        } else {
            app.validate();
        }
    }

    var checkIfUserExists = function (app, next) {
        var collection = db.collection('users');
        collection.find({
            email: app.email
        }).toArray(next);
    }

    self.applyForMembership = function (args, next) {
        var regResults = new RegResults();
        var app = new Application(args);

        //validate inputs 
        validateInputs(app);
        //checkk to see if email exists
        checkIfUserExists(app, function (err, exists) {
            assert.ok(err === null, err)
            if (exists === undefined || exists.length === 0) {                
                //create new user
                //hash the passsword
                //creates log entry
                regResults.success = true;
                regResults.message = "welcome!"
                regResults.user = new User(args);
            }
            next(null, regResults);
        })
    }
}

module.exports = registration;