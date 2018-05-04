"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookieParser = require("cookie-parser");
var express = require("express");
var http = require("http");
var logger = require("morgan");
var path = require("path");
var home_1 = require("./routes/home");
var users_1 = require("./routes/users");
exports.app = express();
exports.server = http.createServer(exports.app);
var PORT = process.env.PORT || 5000;
exports.app.use(logger('dev'));
exports.app.use(express.json());
exports.app.use(express.urlencoded({ extended: true }));
exports.app.use(cookieParser());
exports.app.use('/', home_1.router);
exports.app.use('/users', users_1.router);
if (process.env.NODE_ENV === 'production') {
    exports.app.use(express.static(path.join(__dirname, '../../frontend/build')));
    exports.app.get('*', function (req, res) { return res.sendFile(path.resolve(__dirname, '../../frontend/build/index.html')); });
}
exports.server.listen(PORT, function () {
    console.log("Started on port " + PORT);
});
//# sourceMappingURL=index.js.map