const User = require("../models/user");
const Application = require("../models/application");;
const assert = require("assert");
const Log = require("../models/log");
const bc = require("bcrypt-nodejs");

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

    var saveUser = function (user, next) {
        db.collection('users').insertOne(user, next);
    }

    var addLogEntry = function (userId, next) {
        var log = new Log({
            subject: "Registration",
            userId: userId,
            entry: "Successfully Registered"
        });
        db.collection('logs').insertOne(log, next)
    }
    self.applyForMembership = function (args, next) {
        var regResults = new RegResults();
        var app = new Application(args);

        //validate inputs 
        validateInputs(app);
        if (app.isValid()) {
            //checkk to see if email exists
            checkIfUserExists(app, function (err, exists) {
                assert.ok(err === null, err)
                if (exists === undefined || exists.length === 0) {
                    //create new user                
                    var user = new User(app);
                    user.status = "approved";
                    user.signInCount = 1;
                    //hash the passsword
                    user.hashedPassword = bc.hashSync(app.password);
                    saveUser(user, function (err, newUser) {
                        assert.ok(err === null, err)
                        regResults.user = newUser.ops[0];

                        //creates log entry
                        addLogEntry(newUser.ops[0]._id, function (err, newLog) {
                            regResults.log = newLog;
                            regResults.success = true;
                            regResults.message = "welcome!";
                            next(null, regResults);
                        })
                    })
                } else {
                    regResults.message = "This Email already exists";
                    next(null, regResults);
                }
            });
        } else {
            regResults.message = app.message;
            next(null, regResults);
        }
    }
}

module.exports = registration;