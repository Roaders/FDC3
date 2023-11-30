"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cucumber_1 = require("@cucumber/cucumber");
var matching_1 = require("../support/matching");
var contextMap = {
    "fdc3.instrument": {
        "type": "fdc3.instrument",
        "name": "Apple",
        "id": {
            "ticker": "AAPL"
        }
    }
};
(0, cucumber_1.Given)('{string} is a {string} broadcastRequest message on channel {string}', function (field, type, channel) {
    var message = {
        meta: this.messaging.createMeta(),
        payload: {
            "channelId": channel,
            "context": contextMap[type]
        },
        type: "broadcastRequest"
    };
    this[field] = message;
});
(0, cucumber_1.Given)('{string} pipes context to {string}', function (contextHandlerName, field) {
    var _this = this;
    this[field] = [];
    this[contextHandlerName] = function (context) {
        _this[field].push(context);
    };
});
(0, cucumber_1.When)('messaging receives a {string} with payload:', function (type, docString) {
    var message = {
        meta: this.messaging.createMeta(),
        payload: JSON.parse(docString),
        type: type
    };
    this.log("Sending: ".concat(JSON.stringify(message)));
    this.messaging.receive(message, this.log);
});
(0, cucumber_1.When)('messaging receives {string}', function (field) {
    var message = (0, matching_1.handleResolve)(field, this);
    this.log("Sending: ".concat(JSON.stringify(message)));
    this.messaging.receive(message, this.log);
});
//# sourceMappingURL=channels.steps.js.map