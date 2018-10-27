const should = require("should");
const User = require("../models/user");

describe("User", () => {

    describe("defaults", () => {
        var user = {};
        before(() => {
            user = new User({
                email: "mahmoud@xen.com"
            })
        });

        it('email is mahmoud@xen.com', () => {
            user.email.should.equal("mahmoud@xen.com")
        });
        it("has an authentication token", () => {
            user.authenticationToken.should.be.defined;
        });
        it("has a pending status", () => {
            user.status.should.equal("pending");
        });
        it("has a created date", () => {
            user.createdAt.should.be.defined;
        });
        it("has a signInCount of 0", () => {
            user.signInCount.should.equal(0);
        });
        it("has last login", () => {
            user.lastLoginAt.should.be.defined;
        });
        it("has current login", () => {
            user.currentLoginAt.should.be.defined;
        });
    })
});