const assert = require("assert");
const registration = require("../lib/registration");
const mongoose = require("mongoose");

describe('registration', () => {
    var reg = {}
    before((done) => {
        mongoose.connect("mongodb://localhost/test", {
            useNewUrlParser: true
        }, function (err, db) {
            reg = new registration(db);
            db.collection('users').deleteMany({}, function (err, result) {
                assert.ok(err === null, err);
                db.collection("logs").deleteMany({}, function (err, result) {
                    assert.ok(err === null, err);
                    done();
                })
            });
        })
    });
    describe('a valid application', () => {
        var regResult = {};
        before((done) => {
            reg.applyForMembership({
                email: "mahmoud@xen.com",
                password: "1234",
                confirm: "1234"
            }, function (err, result) {
                regResult = result;
                done();
            });
        });
        it('is successful', () => {            
            regResult.success.should.equal(true);
        });
        it('creates a new user', () => {
            regResult.user.should.be.defined;
        });
        it('creates a log entry', () => {
            regResult.log.should.be.defined;
        });
        it('sets the user status to approved', () => {
            regResult.user.should.be.defined;
        });
        it('offers a welcome message', () => {
            regResult.message.should.equal("welcome!");
        });
        it('incerement the signInCount', () => {
            regResult.user.signInCount.should.equal(1);
        });
    });

    describe('an emty or null email', () => {
        var regResult = {};
        before((done) => {
            reg.applyForMembership({
                email: null,
                password: "1234",
                confirm: "1234"
            }, (err, result) => {
                regResult = result;
                done();
            })
        });
        it('is not successful', () => {
            regResult.success.should.equal(false);
        });
        it('tells user that email is required', () => {
            regResult.message.should.equal("Email and password are required");
        });
    });

    describe('empty or null password', () => {
        var regResult = {};
        before((done) => {
            reg.applyForMembership({
                email: "mahmoud@xen.com",
                password: null,
                confirm: "1234"
            }, (err, result) => {
                regResult = result;
                done();
            })
        });
        it('is not successful', () => {
            regResult.success.should.equal(false);
        });
        it('tells user that password is required', () => {
            regResult.message.should.equal("Email and password are required")
        });
    });

    describe('password and confim mismatch', () => {
        var regResult = {};
        before((done) => {
            reg.applyForMembership({
                email: "mahmoud@xen.com",
                password: "3456",
                confirm: "1234"
            }, (err, result) => {
                regResult = result;
                done();
            })
        });
        it('is not successful', () => {
            regResult.success.should.equal(false);
        });
        it('tells user that password do not match', () => {
            regResult.message.should.equal('Passwords do not match');
        });
    });

    describe('email already exists', () => {
        var regResult = {};
        before((done) => {
            var newUser = {
                email: "mahmoud@xen.com",
                password: "2222",
                confirm: "2222"
            }
            mongoose.connect("mongodb://localhost/test", {
                useNewUrlParser: true
            }, function (err, db) {
                db.collection('users').deleteMany({}, function (err, deleted) {
                    reg.applyForMembership(newUser, function (err, result) {
                        reg.applyForMembership(newUser, function (err, nextResult) {                            
                            regResult = nextResult;
                            done();
                        })
                    })
                });
            })
        });
        it('is not successful', () => {            
            regResult.success.should.equal(false);
        });
        it('tells user that email already exists', () => {
            regResult.message.should.equal("This Email already exists")
        });
    });
});