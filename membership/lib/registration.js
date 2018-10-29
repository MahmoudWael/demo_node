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
    var continueWith = null;

    var validateInputs = function (app) {
        if (!app.email || !app.password) {
            app.setInvalid("Email and password are required");
        } else if (app.password !== app.confirm) {
            app.setInvalid("Passwords do not match")
        } else {
            app.validate();
        }
    }

    var checkIfUserExists = function (app) {
        return new Promise((resolve, reject) => {
            db.collection('users').find({
                email: app.email
            }).toArray(function (err, user) {
                if (err)
                    return reject(err);
                if (user == undefined || user.length == 0) {
                    return resolve(user)
                }
                app.setInvalid("This Email already exists");
                return registrationFailed(app);
            });
        })
    }

    var saveUser = function (app) {
        var user = new User(app);
        user.status = "approved";
        user.signInCount = 1;
        user.hashedPassword = bc.hashSync(app.password);
        return new Promise((resolve, reject) => {
            db.collection('users').insertOne(user, function (err, inserteduser) {
                if (err)
                    return reject(err);
                app.user = inserteduser.ops[0];
                return resolve(inserteduser);
            })
        });
    }

    var addLogEntry = function (app) {
        var log = new Log({
            subject: "Registration",
            userId: app.user._id,
            entry: "Successfully Registered"
        });
        return new Promise((resolve, reject) => {
            db.collection('logs').insertOne(log, function (err, logData) {
                if (err)
                    return reject(err)
                app.log = logData;
                resolve(logData)
            });
        });
    }

    var registrationFailed = function (app) {
        var regResults = new RegResults();
        regResults.success = false;
        regResults.message = app.message;
        if (continueWith) {
            continueWith(null, regResults);
        }
    };

    self.applyForMembership = function (args, next) {
        var app = new Application(args);
        var regResults = new RegResults();
        continueWith = next;
        validateInputs(app);
        if (app.isValid()) {
            checkIfUserExists(app)
                .then(() => {
                    return saveUser(app)
                })
                .then(() => {
                    return addLogEntry(app)
                })
                .then(() => {
                    regResults.user = app.user
                    regResults.log = app.log;
                    regResults.success = true;
                    regResults.message = "welcome!";
                    continueWith(null, regResults);
                })
                .catch(err => {
                    next(err, null)
                })
        } else {
            registrationFailed(app);
        }
    }
}

module.exports = registration;