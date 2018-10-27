var application = function (args) {
    var app = {};
    app.email = args.email;
    app.password = args.password;
    app.confirm = args.confirm;
    app.status = "pending";
    app.messgae = null;
    app.isValid = function () {
        return app.status == "validated";
    }
    app.isInvaid = function(){
        return !isValid();
    }
    app.setInvalid = function (message) {
        app.status = "invalid";
        app.messgae = message
    }
    app.validate = function(){
        app.status = "validated"
    }
    return app;
}

module.exports = application;