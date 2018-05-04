"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
exports.router = express.Router();
exports.router.get('/', function (req, res, next) {
    res.send('Home');
});
//# sourceMappingURL=home.js.map