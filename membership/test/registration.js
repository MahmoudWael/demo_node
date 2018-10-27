const assert = require("assert");
const registration = require("../lib/registration");
const mongoose = require("mongoose");

describe('registration', () => {
    var reg = {}
    before((done) => {
        mongoose.connect("mongodb://localhost/test", function (err, db) {
            reg = new registration(db);
            done();
        })
    });
    describe('a valid application', () => {
        var regResult = {};
        before((done) => {
            reg.applyForMembership({
                email: "Xmahmoud@xen.com",
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

        });
        it('sets the user status to approved', () => {

        });
        it('offers a welcome message', () => {

        });
    });

    describe('an emty or null email', () => {
        it('is not successful', () => {

        });
        it('tells user that email is required', () => {

        });
    });

    describe('empty or null password', () => {
        it('is not successful', () => {

        });
        it('tells user that password is required', () => {

        });
    });

    describe('password and confim mismatch', () => {
        it('is not successful', () => {

        });
        it('tells user that password do not match', () => {

        });
    });

    describe('email already exists', () => {
        it('is not successful', () => {

        });
        it('tells user that email already exists', () => {

        });
    });
});